import { useState } from "react";
import Icon from "../../assets/man_icon.svg";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("IN Handle");

    

    try {
      // Change Link
      navigate("/login");
      // const response = await axios.post("http://localhost:5173/login", {
      //   username,
      //   password,
      // });
      // console.log("Response Status: ", response.status); 

      // if (response.status === 201) {
      //   console.log(response.data.message);
      //   setUsername("");
      //   setPassword("");
      //   localStorage.setItem('username', response.data.username)
      // } else  {
      //   console.log("Error response message: ", response.data.message);
      // }
    } catch (err) {
      console.error("Error during signup:", err);
    }
  };

  return (
    <div>
      <Header />

      <div className="flex items-center justify-between h-full mt-1 rounded-md">
        {/* Image on the left */}
        <div className="flex-1">
          <img src={Icon} alt="Icon" className="w-full h-[700px] object-cover" />
        </div>

        {/* Form details on the right */}
        <div className="flex-1 flex justify-center items-center">
          <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-80">
            <div>
              <label className="font-bold text-xl text-violet-800">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="block w-full p-2 mt-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="font-bold text-xl text-violet-800">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="block w-full p-2 mt-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="bg-violet-400 text-white px-8 py-2 mt-3 rounded-full font-medium hover:bg-violet-600 transition duration-300"
            >
              Log in
            </button>

            {/* Sign up options below the form in a single row */}
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-violet-400 text-white px-4 py-2 rounded-md font-medium hover:bg-violet-600 transition duration-300"
              >
                Log in with dAaaS
              </button>
              <button
                type="submit"
                className="bg-violet-400 text-white px-4 py-2 rounded-md font-medium hover:bg-violet-600 transition duration-300"
              >
                Log in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
