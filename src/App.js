import React from "react";
import './App.css';
import { BrowserRouter as Routers, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Customer from "./components_customer/customerWindowGUI"
// import ManagerWindow from "./ManagerWindowGUI"


function App() {
  return (
    <div className="main-app">
      <Routers>
		<Routes>
			<Route exact path="/" element={<Home/>} />
			<Route exact path="/customer" element={<Customer/>} />
			{/* <Route exact path="/server" element={<Server/>} /> */}
			{/* <Route exact path="/manager" element={<ManagerWindow/>} /> */}
		</Routes>
      </Routers>
    </div>  
  );
}

export default App;
