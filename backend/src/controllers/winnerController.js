import Event from "../model/Event.js";
import Registration from "../model/Registration.js";
import Team from "../model/Team.js";

export const markWinner = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { participantId, teamId, rank } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!participantId && !teamId) {
      return res.status(400).json({ message: "participantId or teamId is required" });
    }

    if (participantId && teamId) {
      return res.status(400).json({ message: "Provide either participantId or teamId, not both" });
    }

    if (participantId) {
      const registration = await Registration.findOne({ eventId, participantId });
      if (!registration) {
        return res.status(404).json({ message: "Participant registration not found" });
      }

      registration.isWinner = true;
      registration.rank = rank;
      await registration.save();

      return res.json({ message: "Participant marked as winner", winner: registration });
    }

    const team = await Team.findOne({ _id: teamId, eventId });
    if (!team) {
      return res.status(404).json({ message: "Team not found for this event" });
    }

    team.isWinner = true;
    team.rank = rank;
    await team.save();

    res.json({ message: "Team marked as winner", winner: team });
  } catch (error) {
    next(error);
  }
};

export const getWinners = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const [participantWinners, teamWinners] = await Promise.all([
      Registration.find({ eventId, isWinner: true })
        .populate("participantId", "name email studentId institution")
        .sort({ rank: 1, createdAt: 1 }),
      Team.find({ eventId, isWinner: true })
        .populate("leaderId", "name email studentId")
        .populate("members.userId", "name email studentId institution")
        .sort({ rank: 1, createdAt: 1 }),
    ]);

    res.json({
      participantWinners,
      teamWinners,
      count: participantWinners.length + teamWinners.length,
    });
  } catch (error) {
    next(error);
  }
};
