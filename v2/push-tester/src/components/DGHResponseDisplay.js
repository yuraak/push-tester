import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import DGHValidationAlerts from './DGHValidationAlerts';

const DGHResponseDisplay = ({ response, isValid, validationErrors }) => {
    return (
        <Card style={{ marginTop: '20px', marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h6">Response:</Typography>
                <pre>{JSON.stringify(response, null, 2)}</pre>
                
                {/* Display JSON validation result */}
                <DGHValidationAlerts isValid={isValid} validationErrors={validationErrors} />
            </CardContent>
        </Card>
    );
};

export default DGHResponseDisplay;