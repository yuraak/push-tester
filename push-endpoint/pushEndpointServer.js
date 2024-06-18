const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/backend/my-push-endpoint', (req, res) => {
    fs.readFile(path.join(__dirname, 'MyEndpointJSON.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read predefined response file' });
            return;
        }
        const MyEndpointJSON = JSON.parse(data);
        res.json(MyEndpointJSON);
    });
});

const PORT = process.env.PORT || 3002; // Changed port to 3002
app.listen(PORT, () => console.log(`Push endpoint server running on port ${PORT}`));
