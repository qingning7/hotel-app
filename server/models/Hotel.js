const mongoose = require('mongoose');

const roomTypeSchema = mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  area: String,
  bed: String,
  features: [String],
  img: String
});

const hotelSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  city: String,
  address: String,
  desc: String,
  roomType: String, // Main room type description
  opened: String,
  price: String, // Kept as string to match current usage, or Number if consistent
  images: [String],
  roomTypes: [roomTypeSchema],
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  star: Number,
  checkinTime: String,
  checkoutTime: String,
  phone: String,
  amenities: [String],
  policies: String,
  policyDetail: {
    breakfast: String,
    childrenPolicy: String,
    petPolicy: String,
    depositPolicy: String,
    extraBedPolicy: String
  },
  nearby: {
    attractions: [String],
    malls: [String],
    transport: [String]
  },
  offers: [String],
  status: {
    type: String,
    default: 'pending' // 'pending', 'approved', 'rejected'
  },
  reason: String, // Rejection reason
  createdBy: String,
  deleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Number,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);
