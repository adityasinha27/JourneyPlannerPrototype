const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load .env early

// Route imports
const busStopRoutes = require('./routes/busStopRoutes');
const busRouteRoutes = require('./routes/busRouteRoutes');
const graphRoutes = require('./routes/graphRoutes');
const journeyRoutes = require('./routes/journeyRoutes');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/busstops', busStopRoutes);
app.use('/api/busroutes', busRouteRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/journey', journeyRoutes);

// Root
app.get('/', (req, res) => res.send('🚍 Mo Bus API is running'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  // optional config (can be omitted for modern versions)
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
