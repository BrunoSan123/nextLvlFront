import React from 'react'
import logo from '../assets/logo.svg'
import './home.css'
import{FiLogIn} from 'react-icons/fi'
import {Link} from 'react-router-dom'



const Home = ()=>{
    return(

        <div id="page-home">
            <div className="content">
                <header>
                <img src={logo} alt="Ecoleta"/>
                </header>

                <main>
                    <h1>Seu Market Place de Coletas de Residuos</h1>
                    <p>Ajudamos as pessoas a encontrarem pontos de coletas de forma eficiente.</p>

                    <Link to="/create-point">
                        <span>
                            <FiLogIn/>
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home
