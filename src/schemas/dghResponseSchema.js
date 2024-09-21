const dghResponseSchema = {
    type: 'object',
    properties: {
        gsId: { type: 'string' },
        gpId: { type: 'string' },
        requestId: { type: 'string' },
        command: { type: 'string', enum: ['PTC_GetDetailedGameHistoryAck'] },
        data: {
            type: 'object',
            properties: {
                ttlSeconds: { type: 'integer', optional: true },
                url: { type: 'string' }
            },
            required: ['url']
        }
    },
    required: ['gsId', 'gpId', 'requestId', 'command', 'data']
};

export default dghResponseSchema;