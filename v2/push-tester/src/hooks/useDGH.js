import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Ajv from 'ajv';
import dghResponseSchema from '../schemas/dghResponseSchema';

const ajv = new Ajv({ allErrors: true, verbose: true });

const useDGH = () => {
    const [transactionLog, setTransactionLog] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const [formattedRequest, setFormattedRequest] = useState({});
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState(null);
    const [isValid, setIsValid] = useState(null);
    const [requestId, setRequestId] = useState(uuidv4());
    const [inputChanged, setInputChanged] = useState(false);
    const [history, setHistory] = useState([]); // State to store request-response history

    useEffect(() => {
        document.title = 'DGH PUSHER';
    }, []);

    const generateRequest = (details) => {
        return {
            gsId: details._meta.gsId,
            gpId: "pop",
            requestId: requestId,
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
    };

    const handleLogChange = (e) => {
        const log = e.target.value;
        setTransactionLog(log);
        setInputChanged(true);
        try {
            const details = JSON.parse(log);
            const request = generateRequest(details);
            setFormattedRequest(request);
        } catch (error) {
            console.error('Failed to parse transaction log:', error);
            setFormattedRequest({});
        }
    };

    const handleEndpointChange = (e) => {
        setEndpoint(e.target.value);
        setInputChanged(true);
    };

    const sendRequest = async () => {
        try {
            setError(null);
            setValidationErrors(null);
            setIsValid(null);
            setResponse(null);

            if (!inputChanged) {
                const newRequestId = uuidv4();
                setRequestId(newRequestId);
                setFormattedRequest(prevRequest => ({
                    ...prevRequest,
                    requestId: newRequestId
                }));
            }

            const updatedRequest = {
                ...formattedRequest,
                requestId: requestId
            };

            const res = await axios.post('http://localhost:3002/proxy', {
                endpoint: endpoint,
                data: updatedRequest
            });

            console.log('Response:', res.data);

            // JSON schema validation
            const valid = ajv.validate(dghResponseSchema, res.data);
            setResponse(res.data);
            setIsValid(valid); // Set isValid based on validation result
            if (!valid) {
                const detailedErrors = ajv.errors.map((error) => {
                    const parameter = error.instancePath.split('/').pop();
                    let explanation = `Error in "${parameter}": ${error.message}`;
                    return explanation;
                });
                setValidationErrors(detailedErrors);
            } else {
                setValidationErrors(null);

                // Open the URL in a popup window
                if (res.data.data && res.data.data.url) {
                    window.open(
                        res.data.data.url,
                        '_blank',
                        'width=800,height=600,resizable,scrollbars=yes,status=yes'
                    );
                }
            }

            // Add request-response pair to history and keep only the last 10 entries
            setHistory(prevHistory => [
                ...prevHistory.slice(-9), // Keep the last 9 entries
                { request: updatedRequest, response: res.data, isValid: valid }
            ]);

            setInputChanged(false);
        } catch (error) {
            console.error('Failed to send request:', error);
            setError(error.response ? error.response.data : 'Request failed');
        }
    };

    return {
        transactionLog,
        endpoint,
        formattedRequest,
        response,
        error,
        isValid,
        validationErrors,
        history, // Return history for display
        handleLogChange,
        handleEndpointChange,
        sendRequest
    };
};

export default useDGH;