const prisma = require('../config/db');

const getDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      include: {
        client: { select: { firstName: true, lastName: true } }
      },
      orderBy: { uploadedDate: 'desc' }
    });
    
    const mapped = documents.map(d => ({
      ...d,
      clientName: d.client ? `${d.client.firstName} ${d.client.lastName}` : 'Unknown'
    }));
    
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching documents' });
  }
};

const uploadDocument = async (req, res) => {
  try {
    // Multer places file info in req.file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { clientId, category } = req.body;
    
    const document = await prisma.document.create({
      data: {
        clientId,
        name: req.file.originalname,
        category: category || 'General',
        url: `/uploads/${req.file.filename}`,
        size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
        status: 'Pending Verification'
      }
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error uploading document' });
  }
};

const reviewDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedbackComment } = req.body;
    
    const document = await prisma.document.update({
      where: { id },
      data: { status, comment: feedbackComment }
    });
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error reviewing document' });
  }
};

module.exports = { getDocuments, uploadDocument, reviewDocument };
