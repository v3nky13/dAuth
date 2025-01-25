import { Route, Routes } from "react-router-dom"
import './indexApp.css';
import SignupPage from "./pages/Signup"
import NavBar from "./pages/LandingPage"
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);


  const name = queryParams.get("username");

  return (
   <Routes>
      {/* Add routes here */}
      
      <Route path="/" element={<SignupPage />} />
      <Route path="/landing" element={<NavBar />} />
      
   </Routes>
  )
}

export default App
