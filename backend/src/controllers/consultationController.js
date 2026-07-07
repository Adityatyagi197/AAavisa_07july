const prisma = require('../config/db');

const getConsultations = async (req, res) => {
  try {
    const consultations = await prisma.consultation.findMany({
      include: {
        lead: { select: { firstName: true, lastName: true, email: true } },
        consultant: { select: { fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const mapped = consultations.map(c => ({
      ...c,
      clientName: c.lead ? `${c.lead.firstName} ${c.lead.lastName}` : 'Unknown',
      agentName: c.consultant?.fullName || 'Unassigned'
    }));
    
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching consultations' });
  }
};

const createConsultation = async (req, res) => {
  try {
    const { leadId, meetingDate, meetingTime, durationMinutes, assignedConsultantId, notes } = req.body;
    
    const consultation = await prisma.consultation.create({
      data: {
        leadId,
        date: meetingDate,
        timeSlot: meetingTime,
        durationMinutes: durationMinutes || 30,
        consultantId: assignedConsultantId,
        internalNotes: notes,
        meetingLink: 'https://zoom.us/j/' + Math.floor(100000000 + Math.random() * 900000000)
      }
    });

    res.status(201).json(consultation);
  } catch (error) {
    console.error('Error booking consultation:', error);
    res.status(500).json({ message: 'Server error booking consultation' });
  }
};

const updateOutcome = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, eligibility, recommendedService, recommendedPackageId, internalNotes } = req.body;
    
    const consultation = await prisma.consultation.update({
      where: { id },
      data: { status, eligibility, recommendedService, recommendedPackageId, internalNotes }
    });
    
    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating consultation outcome' });
  }
};

module.exports = { getConsultations, createConsultation, updateOutcome };
