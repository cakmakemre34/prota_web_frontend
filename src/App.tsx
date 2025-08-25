import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyles';
import HomePage from './pages/HomePage';
import ChatboxPage from './pages/ChatboxPage';
import RoutesPage from './pages/RoutesPage';

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chatbox" element={<ChatboxPage />} />
          <Route path="/routes" element={<RoutesPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;