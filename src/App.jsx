import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import SignInPage from "./pages/SignIn.jsx";
import ProtectedRoute from "./utils/protectedRoutes.jsx";
import MainPage from "./pages/main.pages.jsx";

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
