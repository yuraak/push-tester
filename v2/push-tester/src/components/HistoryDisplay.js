import React from 'react';
import { Card, CardContent, Typography, Alert } from '@mui/material';

const HistoryDisplay = ({ history }) => {
    return (
        <div style={{ marginTop: '20px' }}>
            <Typography variant="h6">Request-Response History (Last 10):</Typography>
            {history.map((entry, index) => (
                <Card key={index} style={{ marginBottom: '10px' }}>
                    <CardContent>
                        <Typography variant="subtitle1">Request {index + 1}:</Typography>
                        <pre>{JSON.stringify(entry.request, null, 2)}</pre>
                        <Typography variant="subtitle1">Response {index + 1}:</Typography>
                        <pre>{JSON.stringify(entry.response, null, 2)}</pre>
                        {entry.isValid ? (
                            <Alert severity="success" style={{ marginTop: '10px' }}>
                                JSON Validation: Passed
                            </Alert>
                        ) : (
                            <Alert severity="error" style={{ marginTop: '10px' }}>
                                JSON Validation: Failed
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default HistoryDisplay;