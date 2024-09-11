import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DGHDynamicMain from './components/dynamic/DGHDynamicMain'; // Ensure this path is correct

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/dynamic" element={<DGHDynamicMain />} />  {/* Dynamic route */}
                <Route path="/" element={<DGHDynamicMain />} />         {/* Default route */}
            </Routes>
        </Router>
    );
};

export default App;