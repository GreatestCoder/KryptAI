import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { authStore } from "./lib/stores/authStore";
import { useEffect } from "react";
import {Loader} from "lucide-react";


export default function App() {
  const { checkAuth, user, isCheckingAuth } = authStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ user });

  if (isCheckingAuth && !user)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}