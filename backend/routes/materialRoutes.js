const express = require('express');
const { 
  getMaterials, 
  getMaterial, 
  uploadMaterial, 
  updateMaterialStatus, 
  likeMaterial, 
  addComment,
  getUserMaterials
} = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.get('/', getMaterials);
router.get('/me', protect, getUserMaterials);
router.get('/:id', getMaterial);

// Protected routes
router.post('/', protect, authorize('admin'), upload.single('file'), uploadMaterial);
router.put('/:id/like', protect, likeMaterial);
router.post('/:id/comment', protect, addComment);

// Admin only routes
router.put('/:id/status', protect, authorize('admin'), updateMaterialStatus);

module.exports = router;
