import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import Document from '../models/document.model.js';

const router = express.Router();

// Create a new document (requires authentication)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newDocument = new Document({
      owner: req.user._id,
      title: title || 'Untitled Document',
      content: content || ''
    });
    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ message: 'Failed to create document.' });
  }
});

// Get a specific document by ID (requires authentication)
// router.get('/:id', authMiddleware, async (req, res) => {
//   try {
//     const document = await Document.findById(req.params.id);
//     if (!document) {
//       return res.status(404).json({ message: 'Document not found.' });
//     }
//     // Check if the current user is the owner or a collaborator
//     if (!document.owner.equals(req.user._id) && !document.collaborators.some(collaborator => collaborator.equals(req.user._id)) && !document.isPublic) {
//       return res.status(403).json({ message: 'Not authorized to view this document.' });
//     }
//     res.status(200).json(document);
//   } catch (error) {
//     console.error('Error fetching document:', error);
//     res.status(500).json({ message: 'Failed to fetch document.' });
//   }
// });


// backend/routes/document.routes.js




router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('owner', 'username email') // Populate owner with username and email
      .populate('collaborators', 'username email'); // Populate collaborators with username and email

    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    if (
      !document.owner.equals(req.user._id) &&
      !document.collaborators.some((collaborator) => collaborator.equals(req.user._id)) &&
      !document.isPublic
    ) {
      return res.status(403).json({ message: 'Not authorized to view this document.' });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Failed to fetch document.' });
  }
});



router.put('/:id/share', authMiddleware, async (req, res) => {
  try {
    const { userId, action } = req.body; // 'action' can be 'add' or 'remove'
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    if (!document.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to share this document.' });
    }

    if (action === 'add') {
      if (!document.collaborators.includes(userId)) {
        document.collaborators.push(userId);
      }
    } else if (action === 'remove') {
      document.collaborators = document.collaborators.filter(
        (collaboratorId) => !collaboratorId.equals(userId)
      );
    } else {
      return res.status(400).json({ message: 'Invalid action.' });
    }

    const updatedDocument = await document.save();
    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error('Error sharing document:', error);
    res.status(500).json({ message: 'Failed to share document.' });
  }
});


//fetch collaborated documents
router.get('/user/collaborations', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({
      collaborators: req.user._id,
    }).populate('owner', 'username email'); // Populate owner details

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching collaborated documents:', error);
    res.status(500).json({ message: 'Failed to fetch collaborated documents.' });
  }
});



// Update a document (requires authentication)
// router.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     const document = await Document.findById(req.params.id);
//     if (!document) {
//       return res.status(404).json({ message: 'Document not found.' });
//     }
//     // Check if the current user is the owner
//     if (!document.owner.equals(req.user._id)) {
//       return res.status(403).json({ message: 'Not authorized to update this document.' });
//     }
//     document.title = title || document.title;
//     document.content = content || document.content;
//     const updatedDocument = await document.save();
//     res.status(200).json(updatedDocument);  
//   } catch (error) {
//     console.error('Error updating document:', error);
//     res.status(500).json({ message: 'Failed to update document.' });
//   }
// });


// backend/routes/document.routes.js
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const document = await Document.findById(req.params.id);
    // console.log(content);  //log to debugging

    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    // Check if the user is the owner OR a collaborator
    if (
      !document.owner.equals(req.user._id) &&
      !document.collaborators.some(collaborator => collaborator.equals(req.user._id))
    ) {
      return res.status(403).json({ message: 'Not authorized to update this document.' });
    }

    document.content = content;
    const updatedDocument = await document.save();
    // console.log(updatedDocument)  //logs for debussing
    // console.log(updatedDocument.content.ops)

    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Failed to update document.' });
  }
});




// Delete a document (requires authentication)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }
    // Check if the current user is the owner
    if (!document.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this document.' });
    }
    await Document.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Document deleted successfully.' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Failed to delete document.' });
  }
});

// Get all documents owned by the current user (requires authentication)
router.get('/user/documents', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({ owner: req.user._id });
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching user documents:', error);
    res.status(500).json({ message: 'Failed to fetch user documents.' });
  }
});

export default router;