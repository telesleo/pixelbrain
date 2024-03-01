import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DatasetCreator from './pages/DatasetCreator';

function App() {
  return (
    <Routes>
      <Route path="/dataset-creator" element={<DatasetCreator />} />
    </Routes>
  );
}

export default App;
