// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json({ limit: '10mb' })); // Increase payload size limit
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Handle URL-encoded data

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

// Get a random prompt (and remove it from the list)
app.get('/kriskringle/prompt', (req, res) => {
    if (prompts.length === 0) {
        return res.status(404).json({ message: "No prompts available!" });
    }
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const [randomPrompt] = prompts.splice(randomIndex, 1); // Remove the prompt from the array
    res.json(randomPrompt);
});

// Submit a completed drawing
app.post('/kriskringle/completed', (req, res) => {
    const { title, image } = req.body;

    if (!image) {
        return res.status(400).json({ message: "Image is required!" });
    }

    completedDrawings.push({ title: title || "Untitled", image });
    res.status(201).json({ message: "Drawing added successfully!" });
});

// Get all completed drawings
app.get('/kriskringle/completed', (req, res) => {
    res.json(completedDrawings);
});

// Clear all prompts and drawings (Admin Endpoint)
app.delete('/kriskringle/clear', (req, res) => {
    prompts.length = 0; // Clear all prompts
    completedDrawings.length = 0; // Clear all drawings
    res.status(200).json({ message: "All prompts and drawings have been cleared!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
