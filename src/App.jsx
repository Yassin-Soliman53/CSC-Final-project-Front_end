import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignIn.jsx";
import MainPage from "./pages/admin/main.admin.jsx";
import ProtectedRoute from "./utils/protectedRoutes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="homepage" element={<MainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
