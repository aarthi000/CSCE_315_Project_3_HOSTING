import React from "react";
import './App.css';
import { BrowserRouter as Routers, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Customer from "./components_customer/customerWindowGUI"
import ManagerWindow from "./components/ManagerWindow"
import Restock from "./components/Restock"
import Sales from "./components/Sales"
import Excess from "./components/Excess"
import Addons from "./components/Addons"

function App() {
  return (
    <div className="main-app">
      <Routers>
		<Routes>
			<Route exact path="/" element={<Home/>} />
			<Route exact path="/customer" element={<Customer/>} />
			{/* <Route exact path="/server" element={<Server/>} /> */}
			<Route exact path="/manager" element={<ManagerWindow/>} />
      <Route exact path="/restock" element={<Restock/>} />
      <Route exact path="/sales" element={<Sales/>} />
      <Route exact path="/excess" element={<Excess/>} />
      <Route exact path="/addons" element={<Addons/>} />
		</Routes>
      </Routers>
    </div>  
  );
}

export default App;
