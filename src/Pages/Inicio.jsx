import React from 'react';
import "../styles/InicioContainer.css"

const Inicio = () => {
    // Datos de ejemplo de pagos
   
    return (
        <div className='inicioContainer'>
            <body>
            <header>
                <div className = "backgroundImage"></div>
                <div className = "title-box">
                    <h1>Agropagos</h1>
                    <p>Agropagos es la solución blockchain <br></br>para pagos inteligentes interempresariales.</p>
                </div>
                
            </header>
            <section>
                <div className = "contenedorHorizontal">
                    <h2>Sobre Nosotros</h2>
                    <p>Somos una empresa innovadora especializada en soluciones tecnológicas para la agroindustria,
                        dedicada a optimizar y transformar la gestión de pagos mediante la tecnología blockchain.
                        Nuestra experiencia en el sector y el profundo entendimiento de los desafíos logísticos y 
                        financieros nos permiten ofrecer una plataforma de contratos inteligentes sobre la blockchain de Solana, 
                        facilitando transacciones rápidas, transparentes y seguras para todos los actores involucrados: 
                        productores, proveedores, transportistas y distribuidores.</p>
                </div>
                <div className = "contenedorHorizontal2">
                    <p>Nuestra misión es transformar el ecosistema agroindustrial en Perú mediante 
                     la implementación de soluciones tecnológicas basadas en blockchain, que permitan 
                     transacciones seguras, eficientes y automatizadas. Nos enfocamos en proporcionar 
                     a nuestros usuarios herramientas innovadoras para mejorar la transparencia 
                     y la agilidad en sus operaciones, reduciendo costos y facilitando el acceso a pagos confiables y rápidos.</p>
                    <h2>Misión</h2>
                </div>

                <div className = "contenedorHorizontal">
                    <h2>Visión</h2>
                    <p>Ser líderes en la digitalización del sector agroindustrial en Perú, utilizando
                        blockchain para empoderar a los actores del sector con plataformas que optimicen 
                        sus procesos financieros. Aspiramos a construir un ecosistema donde la tecnología 
                        permita a las empresas alcanzar nuevas alturas de eficiencia y crecimiento, mejorando 
                        la confianza y la colaboración entre todos los participantes.</p>
                </div>

                <div className = "contenedorHorizontal2">
                    
                    <ul>
                        <li><strong>Innovación:</strong> Lideramos el cambio con soluciones blockchain que transforman la gestión financiera en el sector agroindustrial.</li>
                        <li><strong>Transparencia:</strong> Cada transacción es clara y verificable, asegurando confianza en cada operación.</li>
                        <li><strong>Eficiencia:</strong> Optimizamos procesos para ahorrar tiempo y recursos, mejorando la competitividad de nuestros clientes.</li>
                        <li><strong>Compromiso:</strong> Apoyamos el crecimiento y desarrollo de nuestros clientes en un mercado cada vez más digital y globalizado.</li>
                    </ul>
                    <h2>Valores de la Empresa</h2>
                </div>
                <div style ={{display: 'flex'}}>
                    <div className= "contactanosMsgBox">
                        <h2>Contactanos</h2>
                    </div>
                    <div className = "contacto">
                    <ul style = {{width: '100vh'}}>
                        <h2>Información de contacto</h2> 
                        <li>
                            <h3>Whatsapp</h3>
                            <p>999999999</p>
                            <p>999999999</p>
                            <p>999999999</p>
                        </li>
                        <li>
                            <h3>Correos</h3>
                            <p>luz@gmail</p>
                            <p>Anto@gmail</p>
                            <p>Sharu@gmail</p>
                            <p>Farid@gmail</p>
                            <p>Noe@gmail</p>
                        </li>
                        <li>
                            <h3>Horario</h3>
                            <p>Lunes a viernes: 9:00 - 21:00</p>
                        </li>
                    </ul>
                    </div>
                    <div className = "contacto">
                        <form>
                        <h2>Contacto rápido</h2> 
                            <input
                                type="text"
                                required
                                placeholder='Nombre'
                            />
                            <br></br>
                            <input
                                type="text"
                                required
                                placeholder='Correo'
                            />
                            <br></br>
                            <input
                                type="text"
                                required
                                placeholder='Telefono'
                            />
                            <br></br>
                            <input style = {{paddingBottom: "100px"}}
                                type="text"
                                required
                                placeholder='Mensaje'
                            /><br></br>
                            <button type="submit">Enviar</button>
                        </form>
                    </div>
                </div>  
            </section>
            <footer>
                <p>&copy; 2024 Empresa Agropagos. Todos los derechos reservados, nuestro 20 porfi.</p>
            </footer>

            </body>
        </div>
    );
};

export default Inicio;
