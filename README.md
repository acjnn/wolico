# Express for Wolico

This app takes crypto data and offers various aggregations.
More details can be found here:
[Google Docs](https://docs.google.com/document/d/126ALlkyxZS-k8n-_PaSpLfUV6SMvGssOZjSD8b-RxF0/edit?usp=sharing)

### Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Additional](#additional)

## Getting started
To quickly build and test the app, if Docker and Docker compose are present in the system, the following command can be launched:
   ```bash
   docker compose up --build
   ```

### Prerequisites
To run the app locally, make sure you have the following installed on your system:
- [Node.js](https://nodejs.org) (tested on version 22)
- [Postgres](https://www.postgresql.org/) (running instance or connection string)
- [npm](https://www.npmjs.com/) (tested on version 10)

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
1. Clone and Rename the `.env.example` file to `.env` and update the environment variables:
    - `POSTGRES_URI`: Provide the connection string for your PostgreSQL instance.
    - `APP_PORT` : Your desired port number 
    - `CG_API` : Coin Gecko API

2. Start the app:
   ```bash
   npm start
   ```

3. The endpoints will be accessible at `http://localhost:<APP_PORT>`.

## API Endpoints
The app provides several API endpoints for performing various operations:
- /api/crypto/hottest
- /api/crypto/top_movers
- /api/job/run/<jobName>
- /api/job/list
- /api/log/job/<jobId>
- /api/log/api?startDate=<date>&endDate=<date>

___

## Additional

### Run & Install PostgreSQL
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
