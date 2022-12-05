import React from "react";
import logo from './images/revs.png';
import './Home.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

function Home() {

    const navigate = useNavigate();

    function clickCustomer () {
        navigate("/customer")
    }
    function clickServer () {
        // navigate("/loginServer")
        navigate("/server")
    }
    function clickManager () {
      // navigate("/loginManager");
      navigate("/manager")
    }

    return (
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="btn-group">
            <button className="role-button" onClick={clickCustomer}>Customer</button>
            <button className="role-button" onClick={clickServer}>Server</button>
            <button className="role-button" onClick={clickManager}>Manager</button>
          </div>
          
        </header>
      </div>        
    )
  }
export default Home;