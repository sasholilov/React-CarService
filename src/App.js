import "./App.css";
import { Navbar } from "./components/navbar/navbar.component";
import { Cars } from "./components/cars/cars.component";
import { Register } from "./components/register/register.component";
import { SignIn } from "./components/sign-in/sign-in.component";
import { Services } from "./components/services/services.component";
import { Repairs } from "./components/repairs/repairs.component";
import { Documents } from "./components/documents/documents.component";
import { Routes, Route, Outlet } from "react-router-dom";
import { Home } from "./components/home/home.component";
import { Footer } from "./components/footer/footer.component";
import { Profile } from "./components/profile/profile.component";
import { UserProvider } from "./components/context/userContext.js";
import { CarsUpdate } from "./components/cars/cars-update.component";

function App() {
  return (
    <div id="app-container">
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/services" element={<Services />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/carsupdate" element={<CarsUpdate />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <div id="main-content">
          <Outlet />
        </div>
        <div className="footer">
          <Footer />
        </div>
      </UserProvider>
    </div>
  );
}

export default App;
