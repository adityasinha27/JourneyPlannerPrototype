const express = require('express');
const router = express.Router();
const { dijkstra } = require('../utils/dijkstraPlanner');

router.get('/', async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.status(400).json({ message: "Source and destination are required." });
  }

  try {
    const result = await dijkstra(source, destination);
    if (result.error) return res.status(404).json({ message: result.error });

    res.status(200).json(result);
  } catch (err) {
    console.error("Dijkstra route error:", err.message);
    res.status(500).json({ message: "Failed to compute shortest path." });
  }
});

module.exports = router;
