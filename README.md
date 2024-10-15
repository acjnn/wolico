# Express for Wolico

This app takes crypto data and offers various aggregations

### Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Getting started

### Prerequisites
To run the app locally, make sure you have the following installed on your system:
- [Node.js](https://nodejs.org) (version 22)
- [Postgres](https://www.postgresql.org/) (running instance or connection string)

### Installation
1. Clone the repository from GitHub:
   ```bash
   git clone https://github.com/acjnn/wolico.git
   ```

2. Navigate to the project directory:
   ```bash
   cd wolico
   ```

3. Install the required dependencies using npm:
   ```bash
   npm install
   ```

## Usage
1. Rename the `.env.example` file to `.env` and update the environment variables:
    - `POSTGRES_URI`: Provide the connection string for your PostgreSQL instance.
    - `JWT_SECRET`: Set a secret key for JWT token generation.
    - `APP_PORT` : Your desired port number 

2. Start the app:
   ```bash
   npm start
   ```

3. The app will be accessible at `http://localhost:<APP_PORT>`.

## API Endpoints
The app provides several API endpoints for performing various operations:

___

## Run & Install PostgreSQL
Remember to change the <postgres_data> volume to an actual directory in your host.
   ```bash
   docker run --name postgres-wolico \
   -v <postgres_data>/var/lib/postgresql/data \
   -e POSTGRES_USER=admin \
   -e POSTGRES_PASSWORD=wolico \
   -e POSTGRES_DB=wolico \
   -p 5432:5432 \
   -d postgres
   ```
