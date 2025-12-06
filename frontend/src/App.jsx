import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { loginUser, logout } from "./store/userSlice";
import { backendAPI } from "./utils/backendAPI";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();

  useEffect(() => {
    if (user) {
      handleLogin();
    }
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
    } catch (error) {
      console.log("Error: ", error);
    }
    logout();
  }

  return (
    <>
      {!user && <button onClick={loginWithRedirect}>login</button>}
      {user && <h2>Hello! {user.email}</h2>}
      {user && <button onClick={handleLogout}>Logout</button>}
      {user && <img src={user.picture}></img>}
    </>
  );
}

export default App;
