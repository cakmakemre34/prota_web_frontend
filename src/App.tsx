import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyles';
import HomePage from './pages/HomePage';
import ChatboxPage from './pages/ChatboxPage';
import SelectionPage from './pages/SelectionPage';
import RoutesPage from './pages/RoutesPage';
import PlannedRoutesPage from './pages/PlannedRoutesPage';

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chatbox" element={<ChatboxPage />} />
          <Route path="/selection" element={<SelectionPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/planned-routes" element={<PlannedRoutesPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;