import React from 'react';
import { Container, Typography, TextField, Button, Alert } from '@mui/material';
import useDetailedGameHistory from './useDetailedGameHistory';
import RequestPreview from './RequestPreview';
import ResponseDisplay from './ResponseDisplay';
import ValidationAlerts from './ValidationAlerts';

const DetailedGameHistory = () => {
    const {
        transactionLog,
        endpoint,
        formattedRequest,
        response,
        error,
        isValid,
        validationErrors,
        paramValidationErrors,
        iframeUrl,
        handleLogChange,
        handleEndpointChange,
        sendRequest
    } = useDetailedGameHistory();

    return (
        <Container>
            <Typography variant="h4">Detailed Game History</Typography>
            <TextField
                label="Transaction Log"
                name="transactionLog"
                onChange={handleLogChange}
                multiline
                variant="outlined"
                fullWidth
                style={{ overflow: 'hidden' }}
            />
            <TextField
                label="Push Endpoint"
                name="endpoint"
                onChange={handleEndpointChange}
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <RequestPreview endpoint={endpoint} formattedRequest={formattedRequest} />
            <Button variant="contained" color="primary" onClick={sendRequest}>
                {transactionLog && !error ? 'Generate and Send New Request' : 'Send Request'}
            </Button>
            {error && (
                <Alert severity="error" style={{ marginTop: '20px' }}>
                    {error}
                </Alert>
            )}
            <ResponseDisplay response={response} iframeUrl={iframeUrl} />
            <ValidationAlerts
                isValid={isValid}
                validationErrors={validationErrors}
                paramValidationErrors={paramValidationErrors}
                response={response}
                formattedRequest={formattedRequest} // Ensure to pass formattedRequest here
            />
        </Container>
    );
};

export default DetailedGameHistory;
