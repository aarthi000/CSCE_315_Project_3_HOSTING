// import React from "react";
// import logo from './images/revs.png';
// import './Home.css';
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import jwt_decode from "jwt-decode";

// function Home() {

// 	const [user, setUser] = useState({});

//     useEffect(() => {
// 		/* global google */
// 		google.accounts.id.initialize({
// 			client_id: "150015526860-t3v7iu43ajjcu4mehrv7cqsip7q234qd.apps.googleusercontent.com",
// 			callback: clickManager
// 		});

// 		google.accounts.id.renderButton(
// 			document.getElementById("signInDiv"),
// 			{theme: 'outline', size: 'small', width:'100px'}
// 		);
//     }, []);

//     const navigate = useNavigate();

//     function clickCustomer () {
//         navigate("/customer")
//     }
//     function clickServer () {
//         navigate("/server")
//     }
//     function clickManager (response) {
// 		console.log("Encoded JWT ID Token: " + response.credential);
// 		var userObject = jwt_decode(response.credential);
// 		console.log(userObject);
// 		setUser(userObject);
// 		document.getElementById("signInDiv").hidden = true;
//         navigate("/manager")
//     }

// 	function handleSignout(event) {
// 		setUser({});
// 		document.getElementById("signInDiv").hidden = false;

// 	}



//     return (
//         <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <div className="btn-group">
//             <button className="role-button" onClick={clickCustomer}>Customer</button>
//             <button className="role-button" onClick={clickServer}>Server</button>
//             {/* <button class="role-button" onClick={clickManager}>Manager</button> */}
// 			<button className="role-button" id="signInDiv"></button>
// 			{ Object.keys(user).length !== 0 &&
// 				<button onClick = { (e) => handleSignout(e)}>Sign Out</button>
// 			}
//           </div>
//         </header>
//       </div>        
//     )
// }

// export default Home;

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