# Machine Health App (React Native Expo)

Welcome to my version of the Machine Health App, a React Native Expo project designed to evaluate the health of various machines in an automobile factory. This README will guide you on setting up and running the app, as well as understanding its structure.

## Running the Mobile App Locally

### Prerequisites

Before you begin, make sure you have the following software installed on your development machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) (package manager)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for running Expo projects)

### Installation

```bash
yarn
```

### Running the App

To run the app, use the following command:

```bash
yarn start
```

This will launch the Expo development server, and you can access the app on your device using the Expo Go app or an emulator. You can hit `i` or `a` on the keyboard to launch the ios or android app respectively.

## Project Structure

The project structure is organized as follows:

- `app/_layout.tsx`: The entry point of the Expo app, where the navigation is configured
- `app/`: Contains individual screens or pages/tabs of the app
  - `app/index.tsx`: **The first screen shown to the user.** It is also the Registration Screen
  - `app/login.tsx`: The Login Screen
  - `app/firebase.tsx`: Contains the firebase configuration, and logic for initializing firebase in the app
- `components/`: Contains reusable components used throughout the app.
- `data/`: Stores JSON files with machine and part data for evaluation.

## Screens and Features

The app has the following screens and features:

- **Machine Health Screen**: This screen has two tabs, described below:
  - **Main Tab** - Allows the user to view all machines currently in the databse, calculate machine health score, and reset the machines in the database
  - **Log Part Tab** - Allows user to update an existing machine with a new value for a part, or add a new part (and a new machine) to the database
- **Registration Screen**: Allows the user to create a new user for the app (via firebase) using an email and password
- **Login Screen**: Allows the user to sign in to the app if they have already created a user, but have been signed out

## Other Changes

- I have updated the initial landing page for the app to be the Registration Screen, instead of the Tabs screen, so that we can check if the user is authenticated first before allowing them to enter the rest of the app. Once the user is successfully logged in, the app navigates them to the **Main Tab** on the **Machine Health Screen**
