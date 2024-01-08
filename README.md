# Factory Health Monitor - Authentication, State Management, and Persistence

## Introduction

Welcome to my solution to the BellSant Coding challenge. Given a starter project that includes a React Native mobile app and a backend API, (each in their respective folders) candidates were tasked with updating the project to meet the following goal:

_The goal of this coding challenge is to add authentication and session management to the app, improve the state management of the data returned by the API, and implement a persistence layer on the backend. When a user logs in, their history of data points and scores should be retrieved and displayed_

### About The Application

The application itself is a tool for evaluating the health of various machines in an automobile manufacturing plant. This plant features a range of machines, each with specific data points needed to assess the condition of the production process.

#### Machines and Their Variables

1. **Welding Robots**

   - Welding Robot Error Rate
   - Welding Arm Vibration Level
   - Electrode Wear
   - Gas Shielding Pressure
   - Welding Wire Feed Rate
   - Arc Stability
   - Weld Seam Width
   - Cooling System Efficiency

2. **Painting Stations**

   - Paint Flow Rate
   - Paint Pressure
   - Paint Color Consistency
   - Paint Nozzle Condition

3. **Assembly Lines**

   - Part Alignment Accuracy
   - Assembly Line Speed
   - Component Fitting Tolerance
   - Conveyor Belt Speed

4. **Quality Control Stations**
   - Inspection Camera Calibration
   - Inspection Light Intensity
   - Inspection Software Version
   - Inspection Criteria Settings

### Time Limit

The recommended time limit for this challenge is approximately 3 hours.

I ultimately spent 10 hours implementing and documenting my solution.

## Repository Structure

The repository is structured as follows:

```
├── native-app/
│   ├── source code files...
│   ├── README.md               # The README file for running the React Native Mobile app
│   └── ...
│
├── backend/
│   ├── source code files...
│   ├── README.md               # The README file for running the API Backend
│   └── ...
│
├── MachineHealth.apk           # The compiled android app provided by BellSantCoding, before
|                               # I made changes to the app
|
├── README.md                   # This README file
```

## Getting Started

To run the Machine Health Evaluation app locally, you'll need to clone this repository to your local machine, and set up and run both the React Native app and the API backend separately. Each of the respective folders are in this directory and each have their own README files to help you get started.

To use the Machine Health Evaluation app locally, you'll need to keep both the API and the React Native app running simultaneously. It's recommended to open separate terminal/command windows for each and run them in parallel.

- In one terminal window, navigate to the `backend` folder and run the API backend.
- In another terminal window, navigate to the `native-app` folder and run the React Native app.

## My Approach to the Challenge

### Part 1. Authentication and Session Management

To implement user authentication in the mobile app, I chose to use Firebase Authentication. Users are now able to register on the app via Firebase, and log in securely using their credentials. The solution also allows users to remain authenticated between app sessions.

### Part 2. Data State Management

While the starter project's solution for data state management relied primarily on client side storage via `AsyncStorage`, I decided to go with a significantly different approach. Instead of storing the data via `AsyncStorage`, the machine data is retrieved on demand, using the `GET /machine` endpoint for retrieving the machines in the database, and using `GET /machine-health` to retrieve machine and factory scores from the database. In this way, the mobile app relies entirely on the backend for updating the machines and scores displayed on the app.

I opted for this approach in order to make the server the single point of truth for the application, which greatly simplifies client-side state management and allows for more straightforward testing of the app. The app now loads machine data for the **Main Tab** and the **Log Part Tab** whenever the user arrives at those screens, and also reloads machine data if the "Reset Machine Data" button is clicked, or if we edit machine data by saving changes on the **Log Part Tab**. In this way, machine data is always up to date.

A more optimized solution might use React-Query for optimizing API calls or Redux for maintaining application state, but given the time constraints, I thought it best to keep things simple.

### Part 3 Persistence Layer on the Backend

For a persistence layer, I decided to use a Heroku-hosted Postgres database coupled with the prisma library - it's a quick and straightforward means of persisting data on the backend, and one I've implemented before. An alternative solution may have called for a thid party storage such as Cloud Firestore, but I preferred the strong typing provided by prisma, especially given that the machine types were already provided at the start of the challenge. All machines and their parts are stored in the database for future retrieval, however, due to time constraints, I was unable to implement persistence for machine scores. However, if I were to implement machine score persistence, I would follow the following steps:

Step 1. Add a new table for machine scores to `schema.prisma`, something like this:

```
model MachineScore {
    id                        String   id @default(uuid())
    machineId                 String
    machineType               String
    machineScore              Float
    dateCreated               DateTime @default(now())
}

```

Step 2. Create a migration using `yarn prisma migrate dev` to add the new `MachineScore` table to the database

Step 3. Update the `GET /machine-health` endpoint to create a new `MachineScore` entry in the database for each machine score it calculates while executing the endpoint's logic

Step 4. Implement a new endpoint `GET machine-health/history/:machineId` endpoint which would return all the entries for a given machine in the `MachineScore` table as a JSON array, sorted by most recent using the `dateCreated` field

Step 5. Implement a `<HistoricalMachineScore>` component in the mobile app for displaying the history of a given machine

Step 6. Add a new tab to the mobile app that allows the user to select different machine ids from a `<Picker>` element, and then retrieve and display the machine scores for that machine in cronological order using the `GET machine-health/history/:machineId` endpoint and `<HistoricalMachineScore>` component mentioned earlier

### Part 4. Stretch Goals (Optional)

The stretch goals for this challenge called for implementing a section to show the history of scores with trends over time, with possible visualization to represent the trends in machine health scores. Due to time constraints, I was unable to implement the stretch goals, but given more time I would likely implement the `MachineScore` solution mentioned above, and use Recharts and/or the D3 library to implement more advanced data visualizations, as I have worked with those libraries on prior projects.

### Other Assumptions

- Because automobile plants can be quite large, the current solution assumes that an automobile plant can have multiple machines of the same type. For this reason, the main insertion method for the database (`POST /machine`) allows for multiple machines of the same type (i.e. 2 Welding Robots) to be inserted at the same time. This is also the reason that the `PUT /machine` endpoint allows for both the creation of a new machine, as well as the editing of an existing machine - the app needed a new means of adding parts to an existing machine. The solution also assumes that parts of a machine with "unset" values are 0. For example, if a new Welding Robot machine is created in the database with an error rate of `0.77`, its errorRate field would be set to `0.77`, and every other part would have a value of 0.

## Things I Would Implement With More Time:

- Update the backend and database to store score history, such that we keep track of each time that machine scores are calculated. I would also update the mobile app to show this score history (as described earlier in this README)
- Update the backend's endpoints to be secured via auth token, such that only API calls made with a valid auth token would be accepted (all other requests would be rejected with a 401 status code)
- Once the backend's endpoints were secured, I would add a `userId` field to the 4 machine tables in the database schema (`schema.prisma`), and update the `POST /machine` and `PUT machine` endpoints to set the corresponding `userId` on each machine when they get created in the database
- Update the app to have a sign out button, so that the user can sign themselves out of the mobile app
- Update the firebase config (`native-app/app/firebase.ts`) to read in firebase credentials via environment variables, for reasons of security
- Update the registration screen (`native-app/app/index.tsx`) and login screen (`native-app/app/login.tsx`) to show error messages if registration or login fails (as of now, errors can only be identified by checking the console where the mobile app is running)
- Update the UI overall to be more aesthetically appealing
- Update the backend to link all machines to a single `machine` table, such that each entry in the table has an id, timestamp, and machineType, and a link to one of the 4 existing tables. This will allow for easier identification of machines at run time, and allow us to do useful operations such as timestamp sorting using database queries
- Add a test suite for the backend using Jest, one that checks for each of the possible status codes and responses for the implemented API endpoints, and checks for more complicated user flows, including but not limited to:

  - Edit flow - create machine, then edit machine, then edit different part of the same machine, and check that machine parts have correct values
  - Reset flow - create machine, delete all machines, then create another machine, and check that there is only 1 machine in the database
  - Machine health flow - create machine, then check retrieved machine score is correct. Then add another part to the same machine, retrieve its machine score, and check that its score is now appropriately different

- Add a test suite for the mobile app, with tests including but not limited to the following. Tests should be run both on an iOS device and an Android device

  - Checking that registration fails when inputting already registered email
  - Checking that registration fails with invalid email
  - Checking that registration fails with valid email but invaid password (i.e. pasword is too short)
  - Checking that registration succeeds with valid email and password
  - Checking that login fails with incorrect password
  - Checking that login fails with unregistered email
  - Checking that login succeeds with correct user name and password
  - Checking that logging in, closing the app without signing out, and then opening the app brings the user to the **Main Tab** instead f the Registration or Login Screen
  - Checking that the **Main Tab** shows an instructional message when machine scores haven't been calculated yet
  - Checking that the **Main Tab** shows no machines if user hasn't logged any parts yet
  - Checking that the **Main Tab** shows correct machines and parts after logging parts and values on the **Log Part Tab**
    .
