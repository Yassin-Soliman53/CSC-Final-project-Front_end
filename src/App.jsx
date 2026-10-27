import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignIn.jsx";
import MainPage from "./pages/main.jsx";
import ProtectedRoute from "./utils/protectedRoutes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="homepage" element={<MainPage />} />
          <Route path=":resturant" element/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
