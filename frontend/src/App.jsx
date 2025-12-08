import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { loginUser, logout } from "./store/userSlice";
import { backendAPI } from "./utils/backendAPI";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const {
    user,
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserPicture, setCurrentUserPicture] = useState("");
  useEffect(() => {
    if (user) {
      handleLogin();
      return;
    }
    setCurrentUserEmail(localStorage.getItem("userEmail") || "");
    setCurrentUserPicture(localStorage.getItem("userPicture") || "");
  }, [user]);

  async function handleLogin() {
    try {
      let response = await fetch(`${backendAPI}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: user.email, picture: user.picture }),
      });
      let data = await response.json();
      if (!response.ok) {
        console.log("Something went wrong during login", data.message);
        return;
      }
      console.log("User logged in successfully");
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userPicture", user.picture);
      setCurrentUserEmail(user.email);
      setCurrentUserPicture(user.picture);
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async function handleLogout() {
    try {
      let response = await fetch(`${backendAPI}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      let data = await response.json();
      if (!response.ok) {
        console.log("Something went wrong during logout", data.message);
        return;
      }
      console.log("User logged out successfully");
      localStorage.setItem("userEmail", "");
      localStorage.setItem("userPicture", "");
    } catch (error) {
      console.log("Error: ", error);
    }
    logout();
  }

  return (
    <>
      {!currentUserEmail && <button onClick={loginWithRedirect}>login</button>}
      {currentUserEmail && <h2>Hello! {currentUserEmail}</h2>}
      {currentUserEmail && <button onClick={handleLogout}>Logout</button>}
      {currentUserEmail && <img src={currentUserPicture}></img>}
    </>
  );
}

export default App;
