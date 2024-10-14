const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to authenticate the user
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);
  
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Save the user data in request
        next();
    });
};

// Get all tasks
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const tasks = await Task.find({ _userId: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add a new task
router.post('/', authenticateJWT, async (req, res) => {
    const newTask = new Task({
        _userId: req.user.id,
        text: req.body.text,
        completed: false
    });
    try {
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: 'Error creating task' });
    }
});

// Update a task (complete or update text)
router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, _userId: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.text = req.body.text || task.text;
        task.completed = req.body.completed != null ? req.body.completed : task.completed;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
});

// Delete a task
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const result = await Task.findOneAndDelete({ _id: req.params.id, _userId: req.user.id });
        if (!result) return res.status(404).json({ message: 'Task not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

module.exports = router;