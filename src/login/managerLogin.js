import React from "react";
import './managerLogin.css';
import '../Home.css';
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

function LoginManager() {

	const [user, setUser] = useState({});

  const[employees, setEmployees] = useState([]);

  const getEmployeeCred = async () => {
    try{
      console.log("working 1");
      var response = await fetch ("http://localhost:4999/getemployee");
      console.log("working 2");

      var jsonData = await response.json();
      console.log("working 3");

      setEmployees(jsonData);
      console.log("working 4");
      // console.log(jsonData);


    }catch (err){
      console.error("Error in getEmployeeCred");
      console.error(err.message);
    }
  }

  useEffect(() => {
  /*global google*/
  google.accounts.id.initialize({
    client_id: "150015526860-t3v7iu43ajjcu4mehrv7cqsip7q234qd.apps.googleusercontent.com",
    callback: clickManager
  });
  
  google.accounts.id.renderButton(
    document.getElementById("signInDiv"),
    {theme: 'outline',size:'large'}
  );
  }, []);

  const navigate = useNavigate();

  function clickManager (response) {
    console.log("Encoded JWT ID Token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    // console.log(userObject);
    getEmployeeCred();
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
    console.log("EMPLOYEES");
    console.log(employees);
    
    // for (let i = 0; i < 5; i++) {
    //   console.log("EmployeeName")
    //   console.log(employees[i][1]);
    //   if ((userObject.given_name == employees[i][1]) /*&& (employees[i][2] == "Manager")*/) {
    //     navigate("/manager");
    //     return;
    //   }
    // }
    // alert("You do not have access, please use authorized login!");
    // navigate("/")
  }
  

	function handleSignout(event) {
		setUser({});
		document.getElementById("signInDiv").hidden = false;

	}

  function LoginForm() {
    var username = document.getElementById("usernameCred").value; 
    var password = document.getElementById("passwordCred").value; 

    if (username == "Harshi" && password == "rev1234") {
      navigate("/manager");
    }
    else {
      alert("You do not have access, please use authorized email!");
      navigate("/")
    }
    
  }



  return (
    <div className="page">
      <div className="cover">
        <h2 className="man-title">Manager Login</h2>
        <h1 className="man-title">Username</h1>
        <input type="text" className="login-cred" id="usernameCred" placeholder="Username (Manager Name)"/>
        <h1 className="man-title">Password</h1>
        <input type="password" className="login-cred" id="passwordCred" placeholder="Password"/>
        <button onClick={() => LoginForm()} className="customize_button">Login</button>
        <h1 className="man-title">- OR - </h1>
        <div className="google">
          <button id="signInDiv"></button>
        </div>
        
      </div>
    </div>
  )
}

export default LoginManager;