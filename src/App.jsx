
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import ProtectedRoute from "./utils/protectedRoutes.jsx";
import "./App.css";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/test" replace />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="test" element={<MainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
