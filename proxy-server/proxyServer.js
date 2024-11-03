const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;  // Default to 3001 if PORT is not set

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
    const { endpoint, data, headers } = req.body; // Capture headers if needed
    try {
        // Forward the request to the specified endpoint with the provided data and headers
        const response = await axios.post(endpoint, data, { headers });
        res.json(response.data);
    } catch (error) {
        // Check if the error is coming from the destination endpoint
        if (error.response) {
            // Errors from the destination endpoint
            console.error('Destination Endpoint Error:', error.response.status);
            console.error('Error Details:', error.response.data);
            res.status(error.response.status).json({
                type: 'DestinationEndpointError',
                message: 'Error from the destination endpoint',
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            });
        } else if (error.request) {
            // Errors related to the proxy's request handling
            console.error('Proxy Request Error:', error.message);
            res.status(500).json({
                type: 'ProxyRequestError',
                message: 'Error occurred during the proxy request',
                details: error.message
            });
        } else {
            // Other errors, possibly in the proxy's setup or configuration
            console.error('Proxy Server Error:', error.message);
            res.status(500).json({
                type: 'ProxyServerError',
                message: 'Error within the proxy server',
                details: error.message
            });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});