import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignIn.jsx";
import MainPage from "./pages/main.annouce.jsx";
import RestaurantOrderPage from "./pages/RestaurantOrderPage.jsx";
import PasswordResetPage from "./pages/PasswordReset.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route path="/resetPassword" element={<PasswordResetPage />} />
        <Route path="/homepage" element={<MainPage />} />
        <Route path="/orders/:id" element={<RestaurantOrderPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
