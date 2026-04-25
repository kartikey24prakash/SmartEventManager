import Event from "../model/Event.js";
import Registration from "../model/Registration.js";
import Team from "../model/Team.js";
import User from "../model/User.js";

export const getOverviewAnalytics = async (_req, res, next) => {
  try {
    const [totalEvents, totalParticipants, totalRegistrations, totalTeams] =
      await Promise.all([
        Event.countDocuments(),
        User.countDocuments({ role: "participant" }),
        Registration.countDocuments(),
        Team.countDocuments(),
      ]);

    const [eventsByStatus, eventsByType, genderDistribution, coordinatorCount, eventDetails] =
      await Promise.all([
      Event.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Event.aggregate([{ $group: { _id: "$eventType", count: { $sum: 1 } } }]),
      User.aggregate([
        { $match: { role: "participant" } },
        { $group: { _id: "$gender", count: { $sum: 1 } } },
      ]),
      User.countDocuments({ role: "coordinator" }),
      Event.find()
        .populate("coordinators", "name email coordinatorId")
        .sort({ createdAt: -1 }),
    ]);

    const detailedEvents = await Promise.all(
      eventDetails.map(async (event) => {
        const [registrationsCount, teams] = await Promise.all([
          Registration.countDocuments({
            eventId: event._id,
            status: { $ne: "withdrawn" },
          }),
          Team.find({
            eventId: event._id,
            status: { $ne: "withdrawn" },
          }).select("members"),
        ]);

        const teamParticipants = teams.reduce((sum, team) => sum + team.members.length, 0);

        return {
          _id: event._id,
          name: event.name,
          status: event.status,
          eventType: event.eventType,
          participationType: event.participationType,
          coordinators: event.coordinators,
          registrationsCount,
          teamsCount: teams.length,
          totalParticipants: registrationsCount + teamParticipants,
        };
      })
    );

    const coordinatorWorkloadMap = new Map();

    detailedEvents.forEach((event) => {
      event.coordinators.forEach((coordinator) => {
        const key = coordinator._id.toString();
        const current = coordinatorWorkloadMap.get(key) || {
          coordinator,
          events: [],
          totalParticipants: 0,
        };

        current.events.push({
          _id: event._id,
          name: event.name,
          status: event.status,
        });
        current.totalParticipants += event.totalParticipants;
        coordinatorWorkloadMap.set(key, current);
      });
    });

    res.json({
      totalEvents,
      totalParticipants,
      totalRegistrations,
      totalTeams,
      coordinatorCount,
      eventsByStatus,
      eventsByType,
      genderDistribution,
      eventDetails: detailedEvents,
      coordinatorWorkload: Array.from(coordinatorWorkloadMap.values()),
    });
  } catch (error) {
    next(error);
  }
};

export const getEventAnalytics = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const [event, registrations, teams] = await Promise.all([
      Event.findById(eventId).populate("coordinators", "name email coordinatorId"),
      Registration.find({ eventId }).populate(
        "participantId",
        "name email gender institution studentId contactNumber"
      ),
      Team.find({ eventId })
        .populate("leaderId", "name email studentId contactNumber")
        .populate(
          "members.userId",
          "name email gender institution studentId contactNumber"
        ),
    ]);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const institutions = {};
    const genders = {};

    registrations.forEach((registration) => {
      const participant = registration.participantId;
      if (!participant) {
        return;
      }

      const institution = participant.institution || "Unknown";
      const gender = participant.gender || "Unknown";
      institutions[institution] = (institutions[institution] || 0) + 1;
      genders[gender] = (genders[gender] || 0) + 1;
    });

    teams.forEach((team) => {
      team.members.forEach((member) => {
        const participant = member.userId;
        if (!participant) {
          return;
        }

        const institution = participant.institution || "Unknown";
        const gender = participant.gender || "Unknown";
        institutions[institution] = (institutions[institution] || 0) + 1;
        genders[gender] = (genders[gender] || 0) + 1;
      });
    });

    res.json({
      event: {
        _id: event._id,
        name: event.name,
        participationType: event.participationType,
        status: event.status,
        coordinators: event.coordinators,
      },
      registrationsCount: registrations.length,
      teamsCount: teams.length,
      totalParticipants:
        registrations.length + teams.reduce((sum, team) => sum + team.members.length, 0),
      institutionBreakdown: institutions,
      genderBreakdown: genders,
      winners: {
        individual: registrations.filter((item) => item.isWinner).length,
        team: teams.filter((item) => item.isWinner).length,
      },
      participantDetails: registrations,
      teamDetails: teams,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminEventsReport = async (_req, res, next) => {
  try {
    const events = await Event.find()
      .populate("coordinators", "name email coordinatorId")
      .sort({ createdAt: -1 });

    const report = await Promise.all(
      events.map(async (event) => {
        const [registrations, teams] = await Promise.all([
          Registration.find({ eventId: event._id })
            .populate("participantId", "name email studentId institution")
            .sort({ createdAt: -1 }),
          Team.find({ eventId: event._id })
            .populate("leaderId", "name email studentId")
            .populate("members.userId", "name email studentId institution")
            .sort({ createdAt: -1 }),
        ]);

        const teamParticipants = teams.reduce((sum, team) => sum + team.members.length, 0);

        return {
          _id: event._id,
          name: event.name,
          status: event.status,
          eventType: event.eventType,
          participationType: event.participationType,
          coordinators: event.coordinators,
          registrationsCount: registrations.filter((item) => item.status !== "withdrawn").length,
          teamsCount: teams.filter((item) => item.status !== "withdrawn").length,
          totalParticipants:
            registrations.filter((item) => item.status !== "withdrawn").length + teamParticipants,
          registrations,
          teams,
        };
      })
    );

    res.json({ events: report, count: report.length });
  } catch (error) {
    next(error);
  }
};
