import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import SignInPage from "./pages/SignIn.jsx";
import { AuthProvider } from "./providers/AuthProvider.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/CSC-Final-project-Front_end">
        <Routes>
          <Route index element={<Navigate to="signIn" />} />
          <Route path="/signIn" element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
