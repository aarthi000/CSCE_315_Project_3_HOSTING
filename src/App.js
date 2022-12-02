import React from "react";
import './App.css';
import { BrowserRouter as Routers, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Customer from "./components_customer/customerWindowGUI"
import Server from "./components_server/serverWindowGUI";
import Manager from "./components/ManagerWindowGUI"
import Report from "./components/Report"
import LoginManager from "./login/managerLogin"
import LoginServer from "./login/serverLogin";

function App() {
  return (
    <div className="main-app">
      <Routers>
		<Routes>
			<Route exact path="/" element={<Home/>} />
			<Route exact path="/customer" element={<Customer/>} />
      <Route exact path="/loginServer" element={<LoginServer/>} /> 
			<Route exact path="/server" element={<Server/>} />
			{/* <Route exact path="/manager" element={<ManagerWindow/>} /> */}
      <Route exact path="/manager" element={<Manager/>} />
      <Route exact path="/restock" element={<Report header={'Restock Report'} type={'restock'} />} />
      <Route exact path="/sales" element={<Report header={'Sales Report'} type={'sales'} />} />
      <Route exact path="/excess" element={<Report header={'Excess Report'} type={'excess'} />} />
      <Route exact path="/addons" element={<Report header={'Add-ons Report'} type={'addons'} />} />
      <Route exact path="/loginManager" element={<LoginManager/>} /> 
		</Routes>
      </Routers>
    </div>  
  );
}

export default App;
