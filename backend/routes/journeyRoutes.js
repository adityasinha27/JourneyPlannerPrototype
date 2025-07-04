const express = require('express');
const router = express.Router();
const { findAllPaths } = require('../utils/journeyPlanner');

router.get('/', async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination)
    return res.status(400).json({ message: "Please provide source and destination" });

  const result = await findAllPaths(source, destination);
  if (result.error) return res.status(404).json({ message: result.error });

  res.status(200).json(result);
});

module.exports = router;
