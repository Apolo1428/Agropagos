import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Importar Firestore
import { collection, addDoc } from 'firebase/firestore'; // Métodos Firestore
import "../styles/LoginRegister.css"
import "../styles/Dashboard.css"

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            // Guardar nuevo usuario en Firestore
            await addDoc(collection(db, "Usuarios"), {
                username: username,
                password: password,
                email: email,
                company: company
            });
            alert('Usuario registrado con éxito');
            navigate('/Login'); // Redirigir al login después del registro
        } catch (error) {
            alert('No se pudo registrar el usuario');
        }
    };

    return (
        <div className="register-wrapper">
        <div className="register-container">
            <h2>Registrarse</h2>
            <form onSubmit={handleSubmit} className ='flex'>
                <div style = {{marginRight: "30px"}}>
                    <div>
                        <label>Correo electrónico:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            placeholder='example@email.com'
                        />
                    </div>
                    <div>
                        <label>Empresa</label>
                        <input 
                            type="text" 
                            value={company} 
                            onChange={(e) => setCompany(e.target.value)}
                            required 
                            placeholder='Nombre empresa'
                            autoComplete="off"
                            list = "listaEmpresas"
                        />
                        <datalist id="listaEmpresas">
                            <option value="Agrolmos"/>
                            <option value="Camposol"/>
                            <option value="Danper"/>
                            <option value="Drokasa"/>
                            <option value="Inca Frut"/>
                            <option value="Louis Dreyfus Peru"/>
                            <option value="Viru"/>
                        </datalist>
                    </div>
                </div>
                <div>
                <div>
                    <label>Nombre usuario:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUser(e.target.value)} 
                        required 
                        placeholder='Nombre usuario'
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Confirmar Contraseña:</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Registrarse</button>
                <label>¿Ya tienes cuenta? <span onClick={() => navigate('/Login')} className="link">Inicia Sesión</span></label>
                </div>
            </form>

        </div>
        </div>
    );
};

export default Register;
