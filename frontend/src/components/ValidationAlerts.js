import React from 'react';
import { Alert, Typography, Box } from '@mui/material';

const ValidationAlerts = ({ isValid, validationErrors, paramValidationErrors, response, formattedRequest }) => {
    const validateParam = (field, expected, actual) => {
        if (expected === actual) {
            return (
                <Alert severity="success" key={field} style={{ marginTop: '10px' }}>
                    {field}: {actual} is valid
                </Alert>
            );
        } else {
            return (
                <Alert severity="error" key={field} style={{ marginTop: '10px' }}>
                    {field}: {actual} is invalid, expected: {expected}
                </Alert>
            );
        }
    };

    const validationResults = [
        { field: 'gsId', expected: formattedRequest?.gsId, actual: response?.gsId },
        { field: 'gpId', expected: formattedRequest?.gpId, actual: response?.gpId },
        { field: 'requestId', expected: formattedRequest?.requestId, actual: response?.requestId }
    ];

    return (
        <>
            <Box>
                <Typography variant="h6">JSON Format Validation:</Typography>
                {isValid ? (
                    <Alert severity="success" style={{ marginTop: '20px' }}>
                        JSON format is valid
                    </Alert>
                ) : (
                    <>
                        {validationErrors && (
                            <Alert severity="error" style={{ marginTop: '20px' }}>
                                <Typography variant="body1"><strong>Validation Errors:</strong></Typography>
                                <Box component="ul">
                                    {validationErrors.map((error, index) => (
                                        <Box component="li" key={index}>
                                            {error.instancePath} {error.message}
                                        </Box>
                                    ))}
                                </Box>
                            </Alert>
                        )}
                        {response && (
                            <Box>
                                <Typography variant="body1" style={{ marginTop: '10px' }}>
                                    <strong>Actual Response:</strong>
                                </Typography>
                                <pre style={{ backgroundColor: '#f6f8fa', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                                    {JSON.stringify(response, null, 2)}
                                </pre>
                            </Box>
                        )}
                    </>
                )}
            </Box>

            <Box>
                <Typography variant="h6">Parameter Values Validation:</Typography>
                {response && formattedRequest && (
                    <>
                        {validationResults.map(({ field, expected, actual }) => (
                            validateParam(field, expected, actual)
                        ))}
                    </>
                )}
            </Box>
        </>
    );
};

export default ValidationAlerts;
