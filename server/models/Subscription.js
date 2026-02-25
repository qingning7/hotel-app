const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  hotelId: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    index: true
  },
  checkinDate: {
    type: String,
    required: true
  },
  checkoutDate: {
    type: String,
    required: true
  },
  roomId: String,
  roomName: String,
  roomCount: {
    type: Number,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  nights: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancel_pending', 'cancelled'],
    default: 'active'
  },
  cancelReason: String,
  cancelRequestedAt: Number,
  cancelApprovedAt: Number,
  cancelReviewedBy: String,
  createdAt: {
    type: Number,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
