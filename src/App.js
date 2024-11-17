import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';

import './App.css';

const App = () => {
    const [mycompany, setMyCompany] = useState(() => {
        // Obtener el valor inicial de Local Storage
        const saved2 = localStorage.getItem("mycompany");
        return saved2 ? JSON.parse(saved2) : 0;
    });

    useEffect(() => {
        // Guardar en Local Storage cada vez que "valor" cambie
        localStorage.setItem("mycompany", JSON.stringify(mycompany));
    }, [mycompany]);
    return (
        <Router>
          <div> 
                <div className="content" style = {{position: 'relative'}}>
                    <Routes>
                        <Route path="/" element={mycompany === 0 ? (<Navigate to="/login" replace/>) : (<Navigate to="/dashboard" replace/>)}/>
                        <Route path="/Login" element={<Login sendCompany = {setMyCompany}/>} />
                        <Route path="/Register" element={<Register/>} />
                        <Route path="/Dashboard" element={mycompany !== 0 ? (<Dashboard company = {mycompany}/>) : (<Navigate to="/login" replace/>)}></Route>
                    </Routes>
                </div>

          </div>
        </Router>
    );
};

export default App;