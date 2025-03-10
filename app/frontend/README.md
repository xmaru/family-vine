# Frontend - Family Vine

This is the frontend application for the Family Vine project, built with React and Create React App.

## Overview

The frontend of Family Vine is a single-page application (SPA) that provides a user-friendly interface for managing family documents and visualizations. It interacts with the backend API to perform operations such as user authentication, document uploads, and data visualization.

## Prerequisites

- Node.js (version 14 or later)
- npm (version 6 or later)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/family-vine.git
   cd family-vine/app/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**

   Create a `.env` file in the `app/frontend` directory and add the following:

   ```plaintext
   REACT_APP_API_URL=http://localhost:8000/api
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

Ejects the app from Create React App, allowing full control over the configuration.

## Project Structure

- **src/components**: Contains reusable React components.
- **src/pages**: Contains page components for different routes.
- **src/api**: Contains API service files for interacting with the backend.
- **src/context**: Contains context providers for global state management.

## TODO

### Components
- [ ] Complete authentication components (LoginForm, RegisterForm)
- [ ] Build visualization components for family trees
- [ ] Create metadata editing interface
- [ ] Implement relationship management UI
- [ ] Add document preview functionality
- [ ] Create error and notification components

### State Management
- [ ] Implement global state management with Redux or Context API
- [ ] Add proper error handling and loading states
- [ ] Implement caching for improved performance

### UI/UX
- [ ] Design and implement responsive layouts
- [ ] Add theme support (light/dark mode)
- [ ] Improve accessibility (ARIA attributes, keyboard navigation)
- [ ] Create skeleton loaders for better loading experience
- [ ] Add animations and transitions

### Testing
- [ ] Set up unit tests for components
- [ ] Implement integration tests for workflows
- [ ] Add end-to-end testing with Cypress
- [ ] Set up code coverage reporting

### Features
- [ ] Add drag-and-drop functionality for document uploads
- [ ] Implement search functionality across documents
- [ ] Create interactive family tree visualization
- [ ] Add document tagging and filtering
- [ ] Implement user settings and preferences

### Infrastructure
- [ ] Set up CI/CD pipeline
- [ ] Configure code splitting for improved load times
- [ ] Implement proper error tracking
- [ ] Add analytics integration
- [ ] Create progressive web app capabilities

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
