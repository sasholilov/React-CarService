import "./App.css";
import { Navbar } from "./components/navbar/navbar";
import { Cars } from "./components/cars/cars";
import { Register } from "./components/register/register";
import { SignIn } from "./components/sign-in/sign-in";
import { Services } from "./components/services/services";
import { Repairs } from "./components/repairs/repairs";
import { Reminders } from "./components/reminders/reminders";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/home/home";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/services" element={<Services />} />
        <Route path="/repairs" element={<Repairs />} />
        <Route path="cars" element={<Cars />} />
      </Routes>
    </div>
  );
}

export default App;
