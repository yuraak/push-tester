import React from 'react';
import { Container, Typography, TextField, Button, Alert } from '@mui/material';
import useDGH from '../hooks/useDGH';
import DGHRequestPreview from './DGHRequestPreview';
import DGHResponseDisplay from './DGHResponseDisplay';
import HistoryDisplay from './HistoryDisplay'; // Import the HistoryDisplay component

const DGHMain = () => {
    const {
        transactionLog,
        endpoint,
        formattedRequest,
        response,
        error,
        isValid,
        validationErrors,
        iframeUrl,
        history, // Extract history from useDGH hook
        handleLogChange,
        handleEndpointChange,
        sendRequest
    } = useDGH();

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
                variant="outlined"
                fullWidth
                style={{ marginBottom: '20px' }}
            />
            <DGHRequestPreview endpoint={endpoint} formattedRequest={formattedRequest} />
            <Button variant="contained" color="primary" onClick={sendRequest} style={{ marginTop: '20px' }}>
                {transactionLog && !error ? 'Generate and Send New Request' : 'Send Request'}
            </Button>
            {error && (
                <Alert severity="error" style={{ marginTop: '20px' }}>
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                </Alert>
            )}
            <DGHResponseDisplay 
                response={response} 
                iframeUrl={iframeUrl} 
                isValid={isValid} 
                validationErrors={validationErrors} 
            />
            <HistoryDisplay history={history} /> {/* Add the HistoryDisplay component */}
        </Container>
    );
};

export default DGHMain;