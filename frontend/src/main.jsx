import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

// Importing all of our page components
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DeckPage from './pages/DeckPage.jsx';
import AnalyzerPage from './pages/AnalyzerPage.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AIPage from './pages/AIPage.jsx';

import './index.css'

// Define our application's routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // --- PUBLIC ROUTES ---
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      
      // --- PRIVATE ROUTES ---
      // We create a new route element that uses our PrivateRoute component.
      {
        element: <PrivateRoute />,
        // All routes nested inside here will now be protected by the bouncer.
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "deck", element: <DeckPage /> },
          { path: "analyzer", element: <AnalyzerPage /> },
          { path: "ai-tools", element: <AIPage /> },
          { path: "review", element: <ReviewPage /> },
          { path: "resources", element: <ResourcesPage /> },
        ],
      },
    ],
  },
]);

// Render the app with the router
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)