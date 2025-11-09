import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import HomePage from './components/HomePage.jsx';
import QuizPage from './components/QuizPage.jsx';
import DiseaseDetectorPage from './components/DiseaseDetectorPage.jsx';
import FollowUpQuestionsPage from './components/FollowUpQuestionsPage.jsx';
import DiseasePredictionPage from './components/DiseasePredictionPage.jsx';
import HealthPlannerPage from './components/HealthPlannerPage.jsx';
import PlannerQuestionsPage from './components/PlannerQuestionsPage.jsx';
import PlannerResultsPage from './components/HealthPlanPage.jsx';
import EnvironmentPage from './components/EnvironmentPage';
import ExercisesPage from './components/ExercisesPage.jsx';
import ExerciseListPage from './components/ExerciseListPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'quiz',
        element: <QuizPage />,
      },
      {
        path: 'disease-detector',
        element: <DiseaseDetectorPage />,
      },
      {
        path: 'follow-up-questions',
        element: <FollowUpQuestionsPage />,
      },
      {
        path: 'diagnosis',
        element: <DiseasePredictionPage />,
      },
      {
        path: 'health-planner', // ✅ Objective input
        element: <HealthPlannerPage />,
      },
      {
        path: 'planner-questions', // ✅ 15 follow-up questions
        element: <PlannerQuestionsPage />,
      },
      {
        path: 'planner-results',
        element: <PlannerResultsPage />,
      },
      {
        path: 'environment',
        element: <EnvironmentPage/>,
      },
      {
        path: 'exercises',
        element: <ExercisesPage />,
      },
      {
        path: 'exercises/:difficulty',
        element: <ExerciseListPage />,
      }

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
