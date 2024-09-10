push-tester/
│
├── public/
├── src/
│   ├── components/
│   │   ├── DGHMain.js              // Main component to render the app
│   │   ├── DGHRequestPreview.js    // Component to show the request preview
│   │   ├── DGHResponseDisplay.js   // Component to display API response
│   │   └── DGHValidationAlerts.js  // Component to display validation results and errors
│   │
│   ├── hooks/
│   │   └── useDGH.js               // Custom hook to manage state, requests, and validation
│   │
│   ├── schemas/
│   │   └── dghResponseSchema.js    // JSON schema for validating the API response
│   │
│   ├── App.js
│   └── index.js
│
└── proxy-server/
    └── proxyServer.js

	1.	DGHMain.js: Main component that contains the UI for interacting with the DGH push requests.
	2.	DGHRequestPreview.js: Component to display the formatted request that will be sent.
	3.	DGHResponseDisplay.js: Component to show the response received from the push request.
	4.	DGHValidationAlerts.js: Component to display validation results and any errors encountered.
	5.	useDGH.js: Custom hook for managing state, making API requests, and performing validations.
	6.	dghResponseSchema.js: Schema for validating the JSON response structure from the API.