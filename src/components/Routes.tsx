import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/login";
import Signup from "../pages/Signup/signup";
import Home from "../pages/Home/Home";
import PasswordManagement from "../pages/PasswordManagement/PasswordManagement";
import Tickets from "../pages/Ticket/Ticket";
import Chat from "../pages/Chat/Chat";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const AppRoutes = () => {
  const authenticated = useSelector<RootState>(
    (state) => state.auth.authenticated
  ) as boolean;
  return (
    <Routes>
      <Route
        path="/login"
        element={authenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/"
        element={authenticated ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/signup"
        element={authenticated ? <Navigate to="/" /> : <Signup />}
      />
      <Route
        path="/password"
        element={
          authenticated ? <PasswordManagement /> : <Navigate to="/login" />
        }
      />
      <Route path="*" element={<h1>404 page not found</h1>} />
      <Route
        path="/chat"
        element={authenticated ? <Chat /> : <Navigate to="/login" />}
      />
      <Route
        path="/tickets"
        element={authenticated ? <Tickets /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default AppRoutes;
