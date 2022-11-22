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
    async function clickManager () {
        // Create a request URL to send to the server
        const requestURL = "http://localhost:3300/inventory";
        const request = new Request(requestURL);

        await fetch(request, {
    	      method: 'GET', 
            headers: { 
                'Content-Type': 'application/json',
            },
            mode: 'cors', 
        });
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