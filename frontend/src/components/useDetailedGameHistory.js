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
    const [requestId, setRequestId] = useState(uuidv4()); // Initialize with a UUID
    const [inputChanged, setInputChanged] = useState(false); // Track input changes

    useEffect(() => {
        document.title = 'DGH PUSHER'; // Set the tab title
    }, []);

    const generateRequest = (details) => {
        return {
            gsId: details._meta.gsId,
            gpId: "pop",
            requestId: requestId, // Use the current UUID
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
        setInputChanged(true); // Mark input as changed
        try {
            const details = JSON.parse(log);
            console.log('Parsed Details:', details); // Log parsed details
            const request = generateRequest(details);
            setFormattedRequest(request);
        } catch (error) {
            console.error('Failed to parse transaction log:', error);
            setFormattedRequest({});
        }
    };

    const handleEndpointChange = (e) => {
        setEndpoint(e.target.value);
        setInputChanged(true); // Mark input as changed
    };

    const validateParamValues = (response) => {
        const errors = [];
        const validations = [
            { field: 'gsId', message: `gsId should be ${formattedRequest.gsId}`, actual: response.gsId, expected: formattedRequest.gsId },
            { field: 'gpId', message: `gpId should be ${formattedRequest.gpId}`, actual: response.gpId, expected: formattedRequest.gpId },
            { field: 'requestId', message: `requestId should be ${requestId}`, actual: response.requestId, expected: requestId } // Use requestId state
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
            setError(null); // Clear any previous errors
            setValidationErrors(null); // Clear previous validation errors
            setIsValid(null); // Clear previous validation status
            setParamValidationErrors([]); // Clear previous param validation errors
            setResponse(null); // Clear previous response
            setIframeUrl(''); // Clear previous iframe URL

            if (!inputChanged) {
                // Generate a new UUID for the request if the input hasn't changed
                const newRequestId = uuidv4();
                setRequestId(newRequestId); // Update the requestId state
                setFormattedRequest(prevRequest => ({
                    ...prevRequest,
                    requestId: newRequestId // Update the request preview with new UUID
                }));
            }

            const updatedRequest = {
                ...formattedRequest,
                requestId: requestId // Use the current UUID
            };

            console.log('Sending Request to Endpoint: http://localhost:3000/backend/dgh-request'); // Log the endpoint

            const res = await axios.post('http://localhost:3000/backend/dgh-request', {
                request: updatedRequest,
                endpoint
            });
            console.log('Response:', res.data); // Log the response

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
            setError(error.message || 'Failed to send request');
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
