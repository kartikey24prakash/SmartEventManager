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

export const generateCertificate = async (req, res, next) => {
  try {
    const {
      participantId,
      eventId,
      certificateType = "participation",
      teamId,
      rank,
    } = req.body;

    const [participant, event] = await Promise.all([
      User.findById(participantId),
      Event.findById(eventId),
    ]);

    if (!participant || !event) {
      return res.status(404).json({ message: "Participant or event not found" });
    }

    if (teamId) {
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
    } else {
      const registration = await Registration.findOne({ participantId, eventId });
      if (!registration) {
        return res.status(400).json({ message: "Participant is not registered for this event" });
      }
    }

    const existing = await Certificate.findOne({ participantId, eventId, certificateType });
    if (existing) {
      return res.status(409).json({
        message: "Certificate already generated",
        certificate: existing,
      });
    }

    const certificate = await Certificate.create({
      certificateNumber: buildCertificateNumber(event._id, participant._id),
      participantId,
      eventId,
      teamId,
      certificateType,
      rank,
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
        status: { $ne: "withdrawn" },
      });

      targets = registrations.map((registration) => ({
        participantId: registration.participantId,
        rank: registration.rank,
      }));
    } else {
      const teams = await Team.find({
        eventId,
        status: { $ne: "withdrawn" },
      });

      teams.forEach((team) => {
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
