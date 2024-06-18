const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Backend request to the DGH endpoint received from frontend
app.post('/backend/dgh-request', async (req, res) => {
    const { request, endpoint } = req.body;
    try {
        const response = await axios.post(endpoint, request);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
