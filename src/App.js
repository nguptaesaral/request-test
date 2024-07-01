import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UpdateBacklog from './pages/backlogManager/manage.backlog';
import BacklogManager from './pages/backlogManager/manager.backlog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"user/backlogs/:crm_id"} element={<UpdateBacklog />} />
        <Route path={"user/backlog-manager"} element={<BacklogManager />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
