const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        assignedTo: { select: { fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const mapped = clients.map(c => ({
      ...c,
      name: `${c.firstName} ${c.lastName}`,
      serviceId: c.serviceType,
      assignedConsultantName: c.assignedTo?.fullName,
      assignedConsultantId: c.assignedToId
    }));
    
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching clients' });
  }
};

const createClient = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, nationality, serviceType, serviceId, assignedToId } = req.body;
    
    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        nationality,
        serviceType: serviceType || serviceId,
        assignedToId
      }
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating client' });
  }
};

const updateClientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, visaStatus } = req.body;
    
    const data = {};
    if (status) data.status = status;
    if (visaStatus) data.visaStatus = visaStatus;
    
    const client = await prisma.client.update({
      where: { id },
      data
    });
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating client' });
  }
};

const generateCredentials = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Generate a secure random 8-character password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let plainPassword = '';
    for (let i = 0; i < 8; i++) plainPassword += chars.charAt(Math.floor(Math.random() * chars.length));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    await prisma.client.update({
      where: { id },
      data: { password: hashedPassword, isTemporaryPassword: true }
    });

    // Return the plaintext password so it can be securely displayed/emailed ONCE
    res.json({ success: true, password: plainPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error generating credentials' });
  }
};

const clientLogin = async (req, res) => {
  try {
    const { clientId, password } = req.body;

    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client || !client.password) {
      return res.status(401).json({ message: 'Invalid credentials or portal access not generated yet' });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: client.id, role: 'client' },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      client: {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        isTemporaryPassword: client.isTemporaryPassword
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error logging in client' });
  }
};

const changeClientPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.client.update({
      where: { id },
      data: { password: hashedPassword, isTemporaryPassword: false }
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating password' });
  }
};

module.exports = { getClients, createClient, updateClientStatus, generateCredentials, clientLogin, changeClientPassword };
