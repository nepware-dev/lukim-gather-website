import React, {BrowserRouter, Route, Routes} from 'react-router-dom';

import Home from '@containers/Home';
import Dashboard from '@containers/Dashboard';
import Surveys from '@containers/Surveys';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/surveys' element={<Surveys />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
