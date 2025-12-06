const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getUserProperties,
  getFeaturedProperties
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/user/my-properties', protect, getUserProperties);
router.get('/:id', getProperty);
router.post('/', protect, upload.array('images', 10), createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;