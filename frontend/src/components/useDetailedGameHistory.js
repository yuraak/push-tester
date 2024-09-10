import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Ajv from 'ajv';
import detailedGameHistoryResponseSchema from './detailedGameHistoryResponseSchema';

const ajv = new Ajv();

const useDetailedGameHistory = () => {
    const [transactionLog, setTransactionLog] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const [formattedRequest, setFormattedRequest] = useState({});
    const [response, setResponse] = useState(null);
    const [iframeUrl, setIframeUrl] = useState('');
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState(null);
    const [isValid, setIsValid] = useState(null);
    const [paramValidationErrors, setParamValidationErrors] = useState([]);
    const [requestId, setRequestId] = useState(uuidv4());
    const [inputChanged, setInputChanged] = useState(false);

    useEffect(() => {
        document.title = 'DGH PUSHER'; // Set the tab title
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

    const validateParamValues = (response) => {
        const errors = [];
        const validations = [
            { field: 'gsId', message: `gsId should be ${formattedRequest.gsId}`, actual: response.gsId, expected: formattedRequest.gsId },
            { field: 'gpId', message: `gpId should be ${formattedRequest.gpId}`, actual: response.gpId, expected: formattedRequest.gpId },
            { field: 'requestId', message: `requestId should be ${requestId}`, actual: response.requestId, expected: requestId }
        ];
        validations.forEach(validation => {
            if (validation.actual !== validation.expected) {
                errors.push(validation);
            }
        });
        return errors;
    };

    const sendRequest = async () => {
        try {
            setError(null);
            setValidationErrors(null);
            setIsValid(null);
            setParamValidationErrors([]);
            setResponse(null);
            setIframeUrl('');

            // Generate a new UUID for the request if the input hasn't changed
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

            // Send the request to the proxy server instead of directly to the target API
            const res = await axios.post('http://localhost:3002/proxy', {
                endpoint: endpoint, // The actual endpoint to forward to
                data: updatedRequest // The data to send
            });

            console.log('Response:', res.data);

            // Validate the response against the schema
            const valid = ajv.validate(detailedGameHistoryResponseSchema, res.data);
            setResponse(res.data);
            if (!valid) {
                setValidationErrors(ajv.errors);
                setIsValid(false);
            } else {
                setValidationErrors(null);
                setIsValid(true);
                setIframeUrl(res.data.data.url);

                // Validate parameter values
                const paramErrors = validateParamValues(res.data);
                setParamValidationErrors(paramErrors);
            }

            setInputChanged(false); // Mark input as unchanged after request is sent
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
        paramValidationErrors,
        iframeUrl,
        handleLogChange,
        handleEndpointChange,
        sendRequest
    };
};

export default useDetailedGameHistory;