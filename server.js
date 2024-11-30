// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

// In-memory data storage
const prompts = [];
const completedDrawings = [];

// Routes

// Add a new prompt
app.post('/kriskringle/prompts', (req, res) => {
    const { prompt } = req.body;
    const id = prompts.length + 1;
    prompts.push({ id, prompt });
    res.status(201).json({ message: "Prompt added!", id });
});

// Get a random prompt
app.get('/kriskringle/prompt', (req, res) => {
    if (prompts.length === 0) {
        return res.status(404).json({ message: "No prompts available!" });
    }
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    res.json(randomPrompt);
});

// Submit a completed drawing
app.post('/kriskringle/completed', (req, res) => {
    const { id, image } = req.body;
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) {
        return res.status(404).json({ message: "Prompt not found!" });
    }
    completedDrawings.push({ id, prompt: prompt.prompt, image });
    res.status(201).json({ message: "Drawing added!" });
});

// Get all completed drawings
app.get('/kriskringle/completed', (req, res) => {
    res.json(completedDrawings);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
