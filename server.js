const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load the environment variables from the .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const database = process.env.MONGO_DATABASE;
const host = process.env.MONGO_HOST;
const options = process.env.MONGO_OPTIONS;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(`mongodb+srv://${username}:${password}@${host}/${database}${options}`, {
    useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Define Task model
const TaskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
}, {
    versionKey: false // Disable the __v field that Mongoose automatically adds
});

const Task = mongoose.model('Task', TaskSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
  const newTask = new Task({
    text: req.body.text,
    completed: false
  });
  await newTask.save();
  res.json(newTask);
});

// Update a task (complete or update text)
app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.text = req.body.text || task.text;
  task.completed = req.body.completed != null ? req.body.completed : task.completed;
  await task.save();
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    const result = await Task.findByIdAndDelete(req.params.id);
    res.json(result);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});