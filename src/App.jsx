import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignIn.jsx";
import MainPage from "./pages/main.jsx";
import ProtectedRoute from "./utils/protectedRoutes.jsx";
import RestaurantOrderPage from "./pages/RestaurantOrderPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="homepage" element={<MainPage />} />
          <Route path="orders">
              <Route path="id" element={<RestaurantOrderPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
