import React from 'react';
import { Typography } from '@mui/material';

const ResponseDisplay = ({ response, iframeUrl }) => (
    <>
        <Typography variant="h6" style={{ marginTop: '20px' }}>Response:</Typography>
        {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        {iframeUrl && <iframe src={iframeUrl} width="600" height="400" title="Detailed Game History"></iframe>}
    </>
);

export default ResponseDisplay;
