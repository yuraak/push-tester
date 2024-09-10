import React from 'react';
import { Alert } from '@mui/material';

const DGHValidationAlerts = ({ isValid, validationErrors }) => {
    return (
        <>
            {isValid && <Alert severity="success" style={{ marginTop: '20px' }}>JSON format is valid</Alert>}
            {validationErrors && validationErrors.length > 0 && (
                <Alert severity="error" style={{ marginTop: '20px' }}>
                    <strong>JSON Schema Validation Errors:</strong>
                    {validationErrors.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </Alert>
            )}
        </>
    );
};

export default DGHValidationAlerts;