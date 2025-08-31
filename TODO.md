# TODO List for API-Driven Mini Web App

## Backend Setup
- [x] Set up Express server in server.js with MongoDB connection
- [x] Create Mongoose model for API results in models/Result.js
- [x] Implement controller for GitHub API fetch, save to DB, retrieve results in controllers/resultController.js
- [x] Set up routes in routers/resultRouter.js
- [x] Configure .env with MongoDB URI

## Frontend Implementation
- [x] Modify App.jsx to include keyword input form
- [x] Add functionality to call backend API for search
- [x] Create dashboard component to display stored results
- [x] Implement error handling and basic styling

## Testing and Finalization
- [x] Test backend endpoints (needs MongoDB URI set in .env)
- [x] Test frontend integration (needs backend running)
- [ ] Add pagination if needed
- [x] Final cleanup and documentation
