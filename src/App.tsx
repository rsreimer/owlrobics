import React from 'react';
import './App.css';

import {BrowserRouter, Route, Routes} from "react-router-dom";
import {CanvasPage} from "./pages/canvas/CanvasPage";
import {OwlPage} from "./pages/owl/OwlPage";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/canvas" element={<CanvasPage/>}/>
                <Route path="/" element={<OwlPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
