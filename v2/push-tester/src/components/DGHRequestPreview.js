import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const DGHRequestPreview = ({ endpoint, formattedRequest }) => {
    return (
        <Card style={{ marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h6">Request Preview:</Typography>
                <pre>
                    {JSON.stringify({ method: 'POST', url: endpoint, headers: { 'Content-Type': 'application/json' }, data: formattedRequest }, null, 2)}
                </pre>
            </CardContent>
        </Card>
    );
};

export default DGHRequestPreview;