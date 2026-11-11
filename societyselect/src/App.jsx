import { useEffect, useState } from "react";
import "./App.css";
import LandingPage from "./LandingPage";
import Welcome from "./Components/welcome.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";

function App() {
  const getRoute = () => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (path === "/login" || hash === "#login") return "login";
    if (path === "/forgot" || hash === "#forgot") return "forgot";

    return "landing";
  };

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleLocationChange = () => setRoute(getRoute());

    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  if (route === "login") return <Welcome />;
  if (route === "forgot") return <ForgotPassword />;

  return <LandingPage />;
}

export default App;