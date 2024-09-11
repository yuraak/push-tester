import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, TextField, Button, Alert, Paper, Box, Stack } from '@mui/material';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, verbose: true });
const dghResponseSchema = {
    type: 'object',
    properties: {
        gsId: { type: 'string' },
        gpId: { type: 'string' },
        requestId: { type: 'string' },
        command: { type: 'string', enum: ['PTC_GetDetailedGameHistoryAck'] },
        data: {
            type: 'object',
            properties: {
                ttlSeconds: { type: 'integer', optional: true },
                url: { type: 'string' }
            },
            required: ['url']
        }
    },
    required: ['gsId', 'gpId', 'requestId', 'command', 'data']
};

const DGHDynamicMain = () => {
    const [transactionLog, setTransactionLog] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const [formattedRequest, setFormattedRequest] = useState({});
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isValid, setIsValid] = useState(null);
    const [history, setHistory] = useState([]);
    const [nextRequestId, setNextRequestId] = useState(uuidv4()); // Initial UUID for the first request

    // Function to update request and preview with a new requestId
    const updateRequestPreview = useCallback(() => {
        try {
            const details = JSON.parse(transactionLog);
            const request = {
                gsId: details._meta.gsId,
                gpId: "pop",
                requestId: nextRequestId,  // Use the next generated request ID
                command: "PTC_GetDetailedGameHistory",
                data: {
                    playerId: details.playerId,
                    skinId: details.skinId,
                    gameId: details.gameId,
                    gameCycleId: details.gameCycleId,
                    gameCycleFinishDateTime: details.gameCycleFinishDateTime,
                    localeCode: details.localeCode
                }
            };
            setFormattedRequest(request);
        } catch (error) {
            console.error('Failed to parse transaction log:', error);
            setFormattedRequest({});
        }
    }, [transactionLog, nextRequestId]);

    useEffect(() => {
        document.title = 'DGH PUSHER';
    }, []);

    useEffect(() => {
        updateRequestPreview();
    }, [transactionLog, updateRequestPreview]);

    const handleLogChange = (e) => {
        setTransactionLog(e.target.value);
    };

    const handleEndpointChange = (e) => {
        setEndpoint(e.target.value);
    };

    const sendRequest = async () => {
        try {
            setError(null);
            setIsValid(null);
            setResponse(null);

            const res = await axios.post('http://localhost:3002/proxy', {
                endpoint: endpoint,
                data: formattedRequest
            });

            const valid = ajv.validate(dghResponseSchema, res.data);
            setResponse(res.data);
            setIsValid(valid);

            // Log request, response, and endpoint in history
            setHistory(prev => [{ endpoint, request: formattedRequest, response: res.data, isValid: valid }, ...prev.slice(0, 9)]);

            // Prepare the next request ID for the next request
            setNextRequestId(uuidv4());
            updateRequestPreview(); // Update the preview with the new request ID

            // Open URL in a popup if present
            if (res.data.data && res.data.data.url) {
                window.open(res.data.data.url, '_blank', 'width=800,height=600,noopener,noreferrer');
            }

        } catch (error) {
            setError(error.response ? error.response.data : 'Request failed');
        }
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const reopenIframe = () => {
        if (response && response.data && response.data.url) {
            window.open(response.data.url, '_blank', 'width=800,height=600,noopener,noreferrer');
        }
    };

    const renderTitle = (text) => (
        <Typography variant="subtitle1" style={{ marginBottom: '-10px', fontWeight: 500, color: 'rgba(0, 0, 0, 0.6)' }}>
            {text}
        </Typography>
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>DGH Pusher</Typography>
            <TextField
                label="Transaction Log"
                name="transactionLog"
                onChange={handleLogChange}
                value={transactionLog}
                multiline
                variant="outlined"
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                style={{ marginBottom: '20px' }}
            />
            <TextField
                label="Push Endpoint"
                name="endpoint"
                onChange={handleEndpointChange}
                value={endpoint}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                style={{ marginBottom: '20px' }}
            />
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px', position: 'relative' }}>
                <Box position="absolute" top="-8px" left="10px" bgcolor="white" px="5px">
                    {renderTitle('Request Preview')}
                </Box>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {JSON.stringify({ method: 'POST', url: endpoint, headers: { "Content-Type": "application/json" }, data: formattedRequest }, null, 2)}
                </pre>
            </Paper>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={sendRequest}>
                    Send
                </Button>
                <Button variant="outlined" color="secondary" onClick={reopenIframe}>
                    Re-open Iframe
                </Button>
            </Stack>
            {error && (
                <Alert severity="error" style={{ marginTop: '20px' }}>
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                </Alert>
            )}
            {response && (
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', position: 'relative' }}>
                    <Box position="absolute" top="-8px" left="10px" bgcolor="white" px="5px">
                        {renderTitle('Response')}
                    </Box>
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {JSON.stringify(response, null, 2)}
                    </pre>
                    {isValid ? (
                        <Alert severity="success">JSON Validation: Passed</Alert>
                    ) : (
                        <Alert severity="error">JSON Validation: Failed</Alert>
                    )}
                </Paper>
            )}
            <Typography variant="h5" gutterBottom style={{ marginTop: '40px' }}>History</Typography>
            <Button variant="outlined" color="secondary" onClick={clearHistory} style={{ marginTop: '10px' }}>
                Clear History
            </Button>
            {history.map((entry, index) => (
                <Paper elevation={3} key={index} style={{ padding: '20px', marginTop: '20px', position: 'relative' }}>
                    <Box position="absolute" top="-8px" left="10px" bgcolor="white" px="5px">
                        {renderTitle(index === 0 ? 'Latest' : `Push ${index + 1}`)}
                    </Box>
                    <Typography variant="subtitle1" style={{ marginTop: '10px', fontWeight: 500 }}>Endpoint:</Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{entry.endpoint}</pre>
                    <Typography variant="subtitle1" style={{ marginTop: '10px', fontWeight: 500 }}>Request:</Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                        {JSON.stringify(entry.request, null, 2)}
                    </pre>
                    <Typography variant="subtitle1" style={{ marginTop: '10px', fontWeight: 500 }}>Response:</Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                        {JSON.stringify(entry.response, null, 2)}
                    </pre>
                    {entry.isValid ? (
                        <Alert severity="success">JSON Validation: Passed</Alert>
                    ) : (
                        <Alert severity="error">JSON Validation: Failed</Alert>
                    )}
                </Paper>
            ))}
        </Container>
    );
};

export default DGHDynamicMain;