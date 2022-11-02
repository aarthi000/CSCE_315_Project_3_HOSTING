import React from "react";
import logo from './images/revs.png';
import './Home.css';
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    function clickCustomer () {
        navigate("/customer")
    }
    function clickServer () {
        navigate("/server")
    }
    function clickManager () {
        navigate("/manager")
    }

    return (
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div class="btn-group">
            <button class="role-button" onClick={clickCustomer}>Customer</button>
            <button class="role-button" onClick={clickServer}>Server</button>
            <button class="role-button" onClick={clickManager}>Manager</button>
          </div>
        </header>
      </div>        
    )
}

export default Home;