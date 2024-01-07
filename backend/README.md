# BellSant Machine Health API

Welcome to my version of the BellSant Machine Health API! This API allows you to evaluate the health of various machines and their components based on provided data. This README provides instructions on how to set up and use the API.

## Running the Backend Locally

### Prerequisites

Before you get started, make sure you have the following prerequisites installed on your system:

- Node.js: [Download Node.js](https://nodejs.org/)
- Yarn (optional but recommended, can use NPM instead): [Install Yarn](https://classic.yarnpkg.com/en/docs/install/)

## Installation

Follow these steps to set up the backend:

1. Navigate to the project directory:

   ```bash
   cd api
   ```

2. Install dependencies using Yarn (or npm if you prefer):

   ```bash
   yarn
   ```

3. Add necessary environment variables to enable the API to connect to the database.

- 3a. If you'd like to use the database I set up, reach out to me **mgomez05** for the database credentials

```
 DATABASE_URL=""
 SHADOW_DATABASE_URL=""
```

- 3b. If you'd like to use your own database for this application, set up an empty, publicly accessible database and consult the prisma documentation for how to set the value of `DATABASE_URL` (https://www.prisma.io/docs/orm/overview/databases/postgresql)
  - If the database user you provided in `DATABASE_URL` has permission to create databases, the `SHADOW_DATABASE_URL` environment variable I mentioned above in 3a is not necessary. After setting the `DATABASE_URL`, run `yarn prisma migrate dev` in terminal to apply the existing migrations to your database

```
 DATABASE_URL=""
```

4. Initialize the prisma client

```bash
yarn prisma generate
```

### Starting the API

To start the API, run the following command:

```bash
yarn start
```

The API will be accessible at `http://localhost:3001` by default. You can change the port or other configurations in the `app.ts` file.

### Check API is Up and Running

You can check the status of the backend by sending a request to the `POST /machine` endpoint. Here's an example using cURL:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "machines": {
    "weldingRobot": {
      "errorRate": "0.5",
      "vibrationLevel": "2.5"
    }
  }
}' http://localhost:3001/machine
```

The response will specify how many machines in your request were able to created. For the example above, the response should look like this:

```
STATUS 200
{
    "message": "Successfully created 1 out of 1 machines in database"
}
```

### API Endpoints

#### `GET /machine`

- Used for populating the **Main Tab** of the mobile app
- Returns all machines in the database
- If there are no machines in the database, returns the empty list

**Sample Response**

```
STATUS 200
[
    {
        "id": "7139c76d-3eaa-4b31-a845-95c0638d2dc9",
        "errorRate": 0.79,
        "vibrationLevel": 0.68,
        "electrodeWear": 0,
        "shieldingPressure": 0,
        "wireFeedRate": 0,
        "arcStability": 0,
        "seamWidth": 0,
        "coolingEfficiency": 0,
        "dateCreated": "2024-01-06T05:48:33.938Z"
    },
    {
        "id": "e467dfec-73e6-41ef-a220-f536996629d5",
        "flowRate": 0,
        "pressure": 0,
        "colorConsistency": 99,
        "nozzleCondition": 0,
        "dateCreated": "2024-01-07T04:14:49.923Z"
    }
    ...
]
```

#### `POST /machine`

- Used for manual testing
- Inserts 1 or more machines into the database

**Sample Request Body**

```
{
  "machines": {
    "weldingRobot": {
      "errorRate": "0.79",
      "vibrationLevel": "0.68"
    },
    "assemblyLine": {
      "alignmentAccuracy": 0.21
    }
  }
}
```

**Sample Response**

```
STATUS 200
{
    "message": "Successfully created 2 out of 2 machines in database"
}
```

#### `PUT /machine`

Used for the **Log Part Tab** on the mobile app

- If given a 'machineId' argument, it attempts to update the machine with id `machineId` using the data provided
- Otherwise, if no `machineId` is provided, it attempts to add a new machine with the data provided

**Sample Update Machine Request Body**

```
{
  "machineId": "af7cdd29-bcfc-4413-be29-a53884c80a71",
  "machine": {
    "weldingRobot": {
      "vibrationLevel": "0.5"
    }
  }
}
```

**Sample Update Machine Response**

```
STATUS 200
{
    "message": "Machine was created / updated successfully in the database",
    "data": {
        "status": 200,
        "message": "Machine was updated successfully",
        "updatedMachine": {
            "id": "af7cdd29-bcfc-4413-be29-a53884c80a71",
            "errorRate": 0,
            "vibrationLevel": 0,
            "electrodeWear": 99,
            "shieldingPressure": 0,
            "wireFeedRate": 0,
            "arcStability": 0,
            "seamWidth": 0,
            "coolingEfficiency": 0,
            "dateCreated": "2024-01-07T04:16:07.449Z"
        }
    }
}

```

**Sample New Machine Request Body**

```
{
  "machine": {
    "weldingRobot": {
      "vibrationLevel": "0.5"
    }
  }
}
```

**Sample New Machine Response**

```
STATUS 200
{
    "message": "Machine was created / updated successfully in the database",
    "data": {
        "status": 200,
        "machineCreationResult": {
            "message": "Successfully created 1 out of 1 machines in database"
        }
    }
}
```

#### `DELETE /machine`

- Used for the "Reset Machine Data" button on the **Main Tab** of the mobile app
- Delete all machines in the database

**Sample Response**

```
STATUS 200
{
    "message": "Successfully removed all machines from the database"
}
```

#### `GET /machine-health`

Returns the machine halth score of all machines in the database,
as well as an overall factory score

**Sample Response**

```
STATUS 200
{
    "factory": "38.01",
    "machineScores": [
        {
            "machineType": "weldingRobot",
            "machineTypeId": "af7cdd29-bcfc-4413-be29-a53884c80a71",
            "machineScore": "0.00"
        },
        {
            "machineType": "weldingRobot",
            "machineTypeId": "a1666915-938b-4dc5-bf56-47dac105d8b9",
            "machineScore": "94.17"
        },
        ...
    ]
}
```

### Important Folders and Files in the Backend

- `prisma/` - Contains important information about prisma, which is the database access library used in the project
  - `migrations/` - Contains all the migrations needed to create a database compatible with this project
  - `schema.prisma` - Contains the database schema, outlining all the database tables used in the project
- `addMachinesToDatabase.ts` - Contains the logic for the `POST /machine` endpoint and related helper functions
- `editMachineData.ts` - Contains the logic for the `PUT /machine` endpoint
- `getMachineHealth.ts` - Contains the logic for the `GET /machine` endpoint
- `prismaUtils.ts` - Contains the `getPrismaClient()` function, which helps initialize the prisma client and provide a single point of truth for accessing the prisma client throughout the backend
- `machineHealth.ts` - Contains the logic for the old `POST /machine-health` endpoint provided by BellSant
  - **NOTE:** The `POST /machine-health` endpoint is not accessible in my version of the backend API

### About Prisma

- Prisma is an ORM library in Node.js and TypeScript used for accessing a database. Multiple databases are supported, but this project uses a Postgresql database. (The database type is specified in `prisma/schema.prisma`)
- Extensive knowledge of prisma is not needed for this project, but you can find more information here if you'd like to learn: https://www.prisma.io/
