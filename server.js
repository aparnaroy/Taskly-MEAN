const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const authRoutes = require('./routes/auth-routes');
const taskRoutes = require('./routes/task-routes');

// Load the environment variables from the .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const database = process.env.MONGO_DATABASE;
const host = process.env.MONGO_HOST;
const options = process.env.MONGO_OPTIONS;

// MongoDB Connection
mongoose.connect(`mongodb+srv://${username}:${password}@${host}/${database}${options}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));


// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});