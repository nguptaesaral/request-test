import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UpdateBacklog from './pages/backlogManager/manage.backlog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/backlogs/:crm_id"} element={<UpdateBacklog />} />
        {/* <Route path={"/backlog-manager"} element={<BacklogManager />} />
        <Route path={"/total-backlogs"} element={<TotalBacklog />} /> */}

      </Routes>
    </BrowserRouter>

  );
}

export default App;
