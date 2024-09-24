## Table of Contents

- [Getting Started](#getting-started)
- [Running Locally](#running-locally)
- [Deploying to AWS](#deploying-to-aws)
- [Available Scripts](#available-scripts)
- [Learn More](#learn-more)

## Getting Started

### Prerequisites

- Node.js (version 20 or later)
- npm (version 6 or later)
- Docker (for containerized deployment)

## Running Locally

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-repo/dgh-pusher.git
    cd dgh-pusher
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Start the development server:**

    ```sh
    npm start
    ```

4. **Start the proxy server:**

    Open a new terminal window and navigate to the `proxy-server` directory:

    ```sh
    cd proxy-server
    node proxyServer.js
    ```

5. **Open the application:**

    Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Deploying to AWS

### Using Docker

1. **Build the Docker image:**

    ```sh
    docker build -t dgh-pusher .
    ```

2. **Run the Docker container:**

    ```sh
    docker run -p 80:3000 -p 3002:3002 dgh-pusher
    ```

3. **Deploy to AWS:**

    - Push the Docker image to a container registry (e.g., Amazon ECR).
    - Create an ECS task definition using the pushed Docker image.
    - Set up an ECS service to run the task definition.
    - Configure an Application Load Balancer to route traffic to the ECS service.

### Using EC2

1. **Launch an EC2 instance:**

    - Choose an Amazon Machine Image (AMI) with Node.js and Docker pre-installed.
    - Configure security groups to allow traffic on ports 3000 and 3002.

2. **SSH into the EC2 instance:**

    ```sh
    ssh -i your-key.pem ec2-user@your-ec2-instance-public-dns
    ```

3. **Clone the repository:**

    ```sh
    git clone https://github.com/your-repo/dgh-pusher.git
    cd dgh-pusher
    ```

4. **Install dependencies:**

    ```sh
    npm install
    ```

5. **Build and run the Docker container:**

    ```sh
    docker build -t dgh-pusher .
    docker run -p 80:3000 -p 3002:3002 dgh-pusher
    ```

6. **Access the application:**

    Open your EC2 instance's public DNS in your browser, e.g., `http://your-ec2-instance-public-dns`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
