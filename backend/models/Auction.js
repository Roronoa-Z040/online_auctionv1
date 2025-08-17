const mongoose = require('mongoose');

const AuctionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  startingPrice: { type: Number, required: true, min: 0 },
  currentPrice: { type: Number, default: 0, min: 0 },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['ACTIVE', 'ENDED'], default: 'ACTIVE' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });


AuctionSchema.pre('save', function(next) {
  if (this.isNew && (this.currentPrice === undefined || this.currentPrice === null)) {
    this.currentPrice = this.startingPrice;
  }
  if (this.endDate && this.endDate < new Date() && this.status !== 'ENDED') {
    this.status = 'ENDED';
  }
  next();
});

module.exports = mongoose.model('Auction', AuctionSchema);
