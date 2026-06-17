const express = require("express");

const Board = require("../models/Board");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,adminMiddleware,
  async (req, res) => {

    try {

      const board =
        await Board.create({
          title: req.body.title,
          user: req.user.id,
        });

      res.status(201).json(board);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

router.get(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const boards =
        await Board.find({
          user: req.user.id,
        });

      res.json(boards);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

module.exports = router;