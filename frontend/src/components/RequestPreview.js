import React from 'react';
import { Typography } from '@mui/material';

const RequestPreview = ({ endpoint, formattedRequest }) => (
    <div>
        <Typography variant="h6">Request Preview:</Typography>
        <Typography variant="body1"><strong>Method:</strong> POST</Typography>
        <Typography variant="body1"><strong>URL:</strong> {endpoint}</Typography>
        <Typography variant="body1"><strong>Headers:</strong></Typography>
        <pre>{JSON.stringify({ 'Content-Type': 'application/json' }, null, 2)}</pre>
        <Typography variant="body1"><strong>Data:</strong></Typography>
        <pre>{JSON.stringify(formattedRequest, null, 2)}</pre>
    </div>
);

export default RequestPreview;
