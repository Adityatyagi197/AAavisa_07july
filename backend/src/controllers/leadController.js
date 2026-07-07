const prisma = require('../config/db');

const getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        assignedTo: {
          select: { fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    // Map to frontend expectation
    const mapped = leads.map(l => ({
      ...l,
      name: `${l.firstName} ${l.lastName}`,
      serviceId: l.serviceType,
      assignedConsultantId: l.assignedToId,
      assignedConsultantName: l.assignedTo?.fullName
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching leads', error: error.message });
  }
};

const createLead = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      source, 
      campaignId, 
      serviceType, 
      serviceId, 
      nationality, 
      preferredLanguage, 
      applicantsCount 
    } = req.body;
    
    // Simple auto-assign logic: assign to first available consultant
    const consultants = await prisma.user.findMany({ where: { role: 'consultant' } });
    const assignedToId = consultants.length > 0 ? consultants[0].id : null;

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        source,
        campaignId,
        serviceType: serviceType || serviceId,
        nationality,
        preferredLanguage,
        applicantsCount: applicantsCount ? String(applicantsCount) : undefined,
        assignedToId
      }
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating lead', error: error.message });
  }
};

const assignLead = async (req, res) => {
  try {
    const { leadId, agentId } = req.body;
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { assignedToId: agentId }
    });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error assigning lead' });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { leadId, status } = req.body;
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { status }
    });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating status' });
  }
};

module.exports = { getLeads, createLead, assignLead, updateLeadStatus };
