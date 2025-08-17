const Auction = require('../models/Auction');

// Create
const createAuction = async (req, res) => {
  try {
    const { title, description, startingPrice, endDate } = req.body;
    if (!title || startingPrice === undefined || !endDate) {
      return res.status(400).json({ message: 'title, startingPrice, and endDate are required' });
    }
    const auction = await Auction.create({
      title,
      description,
      startingPrice,
      endDate,
      createdBy: req.user._id,
    });
    res.status(201).json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read all (with basic filtering & pagination)
const getAuctions = async (req, res) => {
  try {
    const { q, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.title = { $regex: q, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Auction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate('createdBy','name email'),
      Auction.countDocuments(filter)
    ]);
    res.json({ items, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read one
const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate('createdBy','name email');
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    // Only owner can update
    if (auction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updatable = ['title','description','startingPrice','currentPrice','endDate','status'];
    updatable.forEach(k => {
      if (req.body[k] !== undefined) auction[k] = req.body[k];
    });
    await auction.save();
    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await auction.deleteOne();
    res.json({ message: 'Auction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createAuction, getAuctions, getAuctionById, updateAuction, deleteAuction };
