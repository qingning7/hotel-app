const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user' // 'admin', 'merchant', 'user'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
