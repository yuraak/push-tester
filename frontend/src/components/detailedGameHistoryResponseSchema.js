const detailedGameHistoryResponseSchema = {
    "type": "object",
    "properties": {
      "gsId": { "type": "string" },
      "gpId": { "type": "string" },
      "requestId": { "type": "string" },
      "command": { 
        "type": "string",
        "const": "PTC_GetDetailedGameHistoryAck"
      },
      "data": {
        "type": "object",
        "properties": {
          "ttlSeconds": { "type": "integer" },
          "url": { "type": "string", "format": "uri" }
        },
        "required": ["url"]
      }
    },
    "required": ["gsId", "gpId", "requestId", "command", "data"]
  };
  
  export default detailedGameHistoryResponseSchema;
  