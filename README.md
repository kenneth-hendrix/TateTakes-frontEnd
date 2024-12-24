# Tate Takes
Front end for [Tate Takes](https://tatetakes.com). Relies on [Mailer Lite](https://github.com/kenneth-hendrix/mailerLite-express) for email subscriptions
## Clone and Install
```bash
git clone https://github.com/kenneth-hendrix/TateTakes-frontEnd.git
cd TateTakes-frontEnd
npm install
```
##  Requirements
This project uses [Firebase](https://firebase.google.com) for user authentication and Firestore for data storage.
  1. Create a Firebase project and set up Firebase Authentication and Firestore.
  2. Store your Firebase connection details in the src/app/environments/ folder.
  3. Add the development configuration to environment.ts and the production configuration to environment.prod.ts.

Example of environment.ts (development environment):
```ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'abcdefthijklmnopqrstuvwxyz',
    authDomain: 'example.firebaseapp.com',
    projectId: 'example',
    storageBucket: 'example.appspot.com',
    messagingSenderId: '1234567890',
    appId: 'abcdefthijklmnopqrstuvwxyzabcdefthijklmnopqrstuvwxyz',
  },
};
```
## Commands
| Command              | Description                                                                           |
|----------------------|---------------------------------------------------------------------------------------|
| npm run start        | Start development server                                                              |
| npm run build        | Build the application for production                                                  |
| npm run lint         | Runs ESLint on the source code to check for linting errors                            |
| npm run lint:fix     | Runs ESLint and attempts to automatically fix any linting errors                      |
| npm run prettier     | Runs Prettier to check if the code in the src folder is formatted                     |
| npm run prettier:fix | Runs Prettier and automatically formats the code in the src folder                    |
| npm run format       | Formats the code using Prettier, then runs ESLint to fix any remaining linting issues |
---
Notes:
- Firebase Authentication: If you're using Firebase Authentication, ensure you've configured the sign-in methods (like email/password, Google, etc.) in the Firebase console.
- Firestore: The app uses Firestore for storing user data or other app-related information. Make sure your Firestore rules are correctly set up in the Firebase console for security.
