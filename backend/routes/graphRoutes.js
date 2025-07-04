const express = require('express');
const router = express.Router();
const routeGraph = require('../utils/routeGraph');

router.get('/build', async (req, res) => {
  try {
    const graph = await routeGraph.buildGraph();
    res.status(200).json(graph);
  } catch (err) {
    res.status(500).json({ message: 'Failed to build graph', error: err });
  }
});

module.exports = router;
