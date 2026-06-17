const express = require("express");

const Task = require("../models/Task");

const authMiddleware =
  require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        title,
        description,
        board,
      } = req.body;

      const task =
        await Task.create({
          title,
          description,
          board,
          user: req.user.id,
        });

      res.status(201).json(task);

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

      const tasks =
        await Task.find({
          user: req.user.id,
        })
        .populate("board");

      res.json(tasks);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const task =
        await Task.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(task);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      await Task.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Task Deleted Successfully",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

router.patch(
  "/:id/status",
  authMiddleware,
  async (req, res) => {

    try {

      const task =
        await Task.findByIdAndUpdate(
          req.params.id,
          {
            status:
              req.body.status,
          },
          {
            new: true,
          }
        );

      res.json(task);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

module.exports = router;