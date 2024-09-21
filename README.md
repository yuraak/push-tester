# Push Tester

## About the Project

Push Tester is a React application designed for testing push notifications. It includes a proxy server for handling requests to external APIs, ensuring secure and efficient communication.

## Project Structure

- `src/`: Contains React application source code
- `proxy-server/`: Contains the proxy server implementation
- `.github/workflows/`: Contains GitHub Actions workflow for deployment

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/push-tester.git
   cd push-tester
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run start:proxy`: Starts the proxy server
- `npm run start:react`: Starts only the React application
- `npm run pm2:start`: Starts both React app and proxy server using PM2
- `npm run pm2:stop`: Stops PM2 processes
- `npm run pm2:restart`: Restarts PM2 processes
- `npm run pm2:delete`: Deletes PM2 processes

## Proxy Server

The proxy server runs on port 3002 and handles POST requests to the `/proxy` endpoint. It forwards requests to specified external APIs and manages error handling.

### Usage

Send a POST request to `http://localhost:3002/proxy` with the following body:

## Deployment

The project is set up for automatic deployment to a VPS when pushing to the `build` branch using GitHub Actions.

### Deployment Process:

1. Push to the `build` branch triggers the GitHub Actions workflow.
2. The workflow builds the project and deploys it to the VPS.
3. On the VPS, the application is started using PM2.

### Manual Deployment:

For manual deployment, SSH into your VPS and run:

```
cd ~/push-tester
git pull origin main
npm ci
npm run build
npm run pm2:stop || true
npm run pm2:delete || true
npm run pm2:start
```

## Environment Variables

Ensure the following environment variables are set in your deployment environment:

- `VPS_HOST`: Your VPS host address
- `VPS_USERNAME`: SSH username for your VPS
- `VPS_SSH_KEY`: SSH private key for authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.