import { Route, Routes } from "react-router-dom";

import Login from "../pages/Login/login";
import Signup from "../pages/Signup/signup";
import Home from "../pages/Home/Home";
import PasswordManagement from "../pages/PasswordManagement/PasswordManagement";
import Tickets from "../pages/Ticket/Ticket";
import Chat from "../pages/Chat/Chat";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/password" element={<PasswordManagement />} />
      <Route path="*" element={<h1>404 page not found</h1>} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/tickets" element={<Tickets />} />

    </Routes>
  );
};

export default AppRoutes;
