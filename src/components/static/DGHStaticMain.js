import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, TextField, Checkbox, FormControlLabel, Paper, Box, Stack, Button, Grid } from '@mui/material';

const DGHStaticMain = () => {
    const [baseUrl, setBaseUrl] = useState('');
    const [selectedParameters, setSelectedParameters] = useState({
        playerId: false,
        skinId: false,
        gameId: false,
        gameCycleId: false,
        gameCycleFinishDateTime: false,
        localeCode: false
    });
    const [parameterValues, setParameterValues] = useState({
        playerId: { name: '', value: '' },
        skinId: { name: '', value: '' },
        gameId: { name: '', value: '' },
        gameCycleId: { name: '', value: '' },
        gameCycleFinishDateTime: { name: '', value: '' },
        localeCode: { name: '', value: '' }
    });
    const [urlPreview, setUrlPreview] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        document.title = 'DGH PUSHER / static'; // Set tab title
    }, []);

    const handleBaseUrlChange = (e) => {
        setBaseUrl(e.target.value);
    };

    const handleCheckboxChange = (e) => {
        setSelectedParameters({
            ...selectedParameters,
            [e.target.name]: e.target.checked
        });
    };

    const handleParameterChange = (e, key, type) => {
        setParameterValues({
            ...parameterValues,
            [key]: {
                ...parameterValues[key],
                [type]: e.target.value
            }
        });
    };

    const updateUrlPreview = useCallback(() => {
        let url = baseUrl;
        const params = [];
        for (const key in selectedParameters) {
            if (selectedParameters[key]) {
                const name = parameterValues[key].name || key;
                const value = parameterValues[key].value || '';
                params.push(`${name}=${encodeURIComponent(value)}`);
            }
        }
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        setUrlPreview(url);
    }, [baseUrl, selectedParameters, parameterValues]);

    useEffect(() => {
        updateUrlPreview();
    }, [updateUrlPreview]);

    const handleOpenIframe = () => {
        window.open(urlPreview, '_blank', 'width=800,height=600,noopener,noreferrer');
        setHistory(prev => [urlPreview, ...prev.slice(0, 9)]);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>DGH Pusher / Static Approach</Typography>
            <TextField
                label="Base URL"
                name="baseUrl"
                onChange={handleBaseUrlChange}
                value={baseUrl}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                style={{ marginBottom: '20px' }}
            />
            <Box style={{ marginBottom: '20px' }}>
                {Object.keys(selectedParameters).map((param) => (
                    <FormControlLabel
                        key={param}
                        control={
                            <Checkbox
                                checked={selectedParameters[param]}
                                onChange={handleCheckboxChange}
                                name={param}
                                color="primary"
                            />
                        }
                        label={param.replace(/([A-Z])/g, ' $1').trim()}  // Format label for readability
                    />
                ))}
            </Box>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                {Object.keys(selectedParameters).map((key) => (
                    selectedParameters[key] && (
                        <React.Fragment key={key}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label={`Parameter Name for ${key}`}
                                    value={parameterValues[key].name}
                                    onChange={(e) => handleParameterChange(e, key, 'name')}
                                    variant="outlined"
                                    fullWidth
                                    style={{ marginBottom: '10px' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label={`Value for ${key}`}
                                    value={parameterValues[key].value}
                                    onChange={(e) => handleParameterChange(e, key, 'value')}
                                    variant="outlined"
                                    fullWidth
                                    style={{ marginBottom: '10px' }}
                                />
                            </Grid>
                        </React.Fragment>
                    )
                ))}
            </Grid>
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px', position: 'relative' }}>
                <Box position="absolute" top="-8px" left="10px" bgcolor="white" px="5px">
                    <Typography variant="subtitle1" style={{ fontWeight: 500, color: 'rgba(0, 0, 0, 0.6)' }}>
                        URL Preview
                    </Typography>
                </Box>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {urlPreview}
                </pre>
            </Paper>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleOpenIframe}>
                    Open URL in Iframe
                </Button>
            </Stack>
            <Box display="flex" alignItems="center" marginTop="40px">
                <Typography variant="h5" gutterBottom>History</Typography>
                <Button variant="outlined" color="secondary" onClick={clearHistory} style={{ marginLeft: '10px' }}>
                    Clear History
                </Button>
            </Box>
            {history.map((url, index) => (
                <Paper elevation={3} key={index} style={{ padding: '20px', marginTop: '20px', position: 'relative' }}>
                    <Box position="absolute" top="-8px" left="10px" bgcolor="white" px="5px">
                        <Typography variant="subtitle1" style={{ fontWeight: 500, color: 'rgba(0, 0, 0, 0.6)' }}>
                            {index === 0 ? 'Latest' : `URL ${index + 1}`}
                        </Typography>
                    </Box>
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {url}
                    </pre>
                </Paper>
            ))}
        </Container>
    );
};

export default DGHStaticMain;