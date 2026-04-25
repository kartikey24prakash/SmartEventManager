import PDFDocument from "pdfkit";

import Certificate from "../model/Certificate.js";
import Event from "../model/Event.js";
import Registration from "../model/Registration.js";
import Team from "../model/Team.js";
import User from "../model/User.js";

const buildCertificateNumber = (eventId, participantId) =>
  `CERT-${eventId.toString().slice(-4)}-${participantId
    .toString()
    .slice(-4)}-${Date.now()}`;

const assertCertificateEligibility = async ({
  participantId,
  eventId,
  certificateType,
  teamId,
  rank,
}) => {
  const event = await Event.findById(eventId);
  if (!event) {
    return { status: 404, message: "Event not found" };
  }

  if (event.participationType === "individual") {
    const registration = await Registration.findOne({ participantId, eventId });

    if (!registration) {
      return { status: 400, message: "Participant is not registered for this event" };
    }

    if (certificateType === "participation" && registration.status !== "participated") {
      return {
        status: 400,
        message: "Only participants marked as participated can receive participation certificates",
      };
    }

    if (
      ["achievement", "winner"].includes(certificateType) &&
      (!registration.isWinner || ![1, 2, 3].includes(Number(registration.rank)))
    ) {
      return {
        status: 400,
        message: "Only winner participants with rank 1, 2, or 3 can receive achievement certificates",
      };
    }

    return {
      event,
      resolvedRank: registration.rank,
      teamId: undefined,
    };
  }

  if (!teamId) {
    return { status: 400, message: "teamId is required for team event certificates" };
  }

  const team = await Team.findById(teamId);
  if (!team || team.eventId.toString() !== eventId.toString()) {
    return { status: 404, message: "Team not found for this event" };
  }

  const isMember = team.members.some((member) => member.userId.toString() === participantId.toString());
  if (!isMember) {
    return { status: 400, message: "Participant is not a member of this team" };
  }

  if (certificateType === "participation" && team.status !== "participated") {
    return {
      status: 400,
      message: "Only team members who actually participated can receive participation certificates",
    };
  }

  if (
    ["achievement", "winner"].includes(certificateType) &&
    (!team.isWinner || ![1, 2, 3].includes(Number(team.rank)))
  ) {
    return {
      status: 400,
      message: "Only winner teams with rank 1, 2, or 3 can receive achievement certificates",
    };
  }

  return {
    event,
    resolvedRank: team.rank,
    teamId: team._id,
  };
};

export const generateCertificate = async (req, res, next) => {
  try {
    const {
      participantId,
      eventId,
      certificateType = "participation",
      teamId,
      rank,
    } = req.body;

    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const eligibility = await assertCertificateEligibility({
      participantId,
      eventId,
      certificateType,
      teamId,
      rank,
    });

    if (eligibility.message) {
      return res.status(eligibility.status).json({ message: eligibility.message });
    }

    const existing = await Certificate.findOne({ participantId, eventId, certificateType });
    if (existing) {
      return res.status(409).json({
        message: "Certificate already generated",
        certificate: existing,
      });
    }

    const certificate = await Certificate.create({
      certificateNumber: buildCertificateNumber(eligibility.event._id, participant._id),
      participantId,
      eventId,
      teamId: eligibility.teamId,
      certificateType,
      rank: eligibility.resolvedRank ?? rank,
      generatedBy: req.user._id,
    });

    res.status(201).json({ certificate });
  } catch (error) {
    next(error);
  }
};

export const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.certificateId)
      .populate("participantId", "name institution")
      .populate("eventId", "name eventDate venue");

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    certificate.downloadCount += 1;
    certificate.lastDownloadedAt = new Date();
    await certificate.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate-${certificate.certificateNumber}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    doc.fontSize(24).text("SMART Event Manager", { align: "center" });
    doc.moveDown();
    doc.fontSize(20).text("Certificate", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(14).text(`Certificate No: ${certificate.certificateNumber}`, {
      align: "center",
    });
    doc.moveDown();
    doc.text(`This certifies that ${certificate.participantId.name}`, {
      align: "center",
    });
    doc.moveDown();
    doc.text(
      `from ${certificate.participantId.institution || "the institution"} participated in ${
        certificate.eventId.name
      }.`,
      { align: "center" }
    );
    doc.moveDown();
    doc.text(`Certificate Type: ${certificate.certificateType}`, { align: "center" });
    doc.moveDown();
    doc.text(`Venue: ${certificate.eventId.venue || "TBD"}`, { align: "center" });
    doc.moveDown();
    doc.text(
      `Generated on ${new Date(certificate.generatedAt).toLocaleDateString("en-IN")}`,
      { align: "center" }
    );

    doc.end();
  } catch (error) {
    next(error);
  }
};

export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ participantId: req.user._id })
      .populate("eventId", "name eventDate")
      .sort({ createdAt: -1 });

    res.json({ certificates });
  } catch (error) {
    next(error);
  }
};

export const batchGenerateCertificates = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { certificateType = "participation" } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    let targets = [];

    if (event.participationType === "individual") {
      const registrations = await Registration.find({
        eventId,
        status:
          certificateType === "participation"
            ? "participated"
            : { $in: ["participated"] },
      });

      targets = registrations
        .filter((registration) =>
          certificateType === "participation"
            ? registration.status === "participated"
            : registration.isWinner && [1, 2, 3].includes(Number(registration.rank))
        )
        .map((registration) => ({
          participantId: registration.participantId,
          rank: registration.rank,
        }));
    } else {
      const teams = await Team.find({
        eventId,
        status:
          certificateType === "participation"
            ? "participated"
            : { $in: ["participated"] },
      });

      teams.forEach((team) => {
        if (
          certificateType !== "participation" &&
          (!team.isWinner || ![1, 2, 3].includes(Number(team.rank)))
        ) {
          return;
        }

        team.members.forEach((member) => {
          targets.push({
            participantId: member.userId,
            teamId: team._id,
            rank: team.rank,
          });
        });
      });
    }

    let createdCount = 0;

    for (const target of targets) {
      const existing = await Certificate.findOne({
        participantId: target.participantId,
        eventId,
        certificateType,
      });

      if (existing) {
        continue;
      }

      await Certificate.create({
        certificateNumber: buildCertificateNumber(event._id, target.participantId),
        participantId: target.participantId,
        eventId,
        teamId: target.teamId,
        certificateType,
        rank: target.rank,
        generatedBy: req.user._id,
      });

      createdCount += 1;
    }

    res.json({
      message: "Batch certificate generation completed",
      createdCount,
      requestedCount: targets.length,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      certificateNumber: req.params.certificateNumber,
    })
      .populate("participantId", "name email studentId")
      .populate("eventId", "name eventDate venue");

    if (!certificate) {
      return res.status(404).json({ isValid: false, message: "Certificate not found" });
    }

    res.json({
      isValid: true,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};
