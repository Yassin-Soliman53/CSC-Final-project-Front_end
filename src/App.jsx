import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignIn.jsx";
import { useAuth } from "./providers/AuthProvider.jsx";

export default function App() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter basename="/CSC-Final-project-Front_end">
      <Routes>
        <Route
          path="/signIn"
          element={!isAuthenticated ? <SignInPage /> : "p"}
          index
        />
      </Routes>
    </BrowserRouter>
  );
}
