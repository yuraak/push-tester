const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3002; // Choose a different port to avoid conflicts with frontend

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint to forward requests
app.post('/proxy', async (req, res) => {
    const { endpoint, data } = req.body; // Receive endpoint and data from the frontend
    try {
        const response = await axios.post(endpoint, data); // Forward request to the specified endpoint
        res.json(response.data); // Send back the response data to the frontend
    } catch (error) {
        console.error('Error forwarding request:', error.message);
        res.status(500).json({ error: error.message }); // Return error if the request fails
    }
});

// Start the proxy server
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});