const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createAuction, getAuctions, getAuctionById, updateAuction, deleteAuction } = require('../controllers/auctionController');

const router = express.Router();

router.get('/', getAuctions);
router.get('/:id', getAuctionById);

router.post('/', protect, createAuction);
router.put('/:id', protect, updateAuction);
router.delete('/:id', protect, deleteAuction);

module.exports = router;
