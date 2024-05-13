import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import List from './pages/List';
import Main from './pages/Main';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: 'files',
    element: <List />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
