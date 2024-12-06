import { Route, Routes } from "react-router-dom";

import Login from "../pages/login";

// import PasswordResetAgent from "../pages/passwordResetAgent/PasswordResetAgent";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="*" element={<h1>404 page not found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
