const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true
  },
  busNumber: {
    type: String,
    required: true
  },
  stops: [
    {
      stop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusStop',
        required: true
      },
      order: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('BusRoute', busRouteSchema);
