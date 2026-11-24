import { useEffect } from "react";

import AppRouter from "@/routes/AppRouter";
import { useAuthStore } from "@/features/auth";
import ThemeProvider from "./shared/components/ThemeProvider";
import { Toast } from "./shared/components";

function App() {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <ThemeProvider>
      <AppRouter />
      <Toast/>
    </ThemeProvider>);
}

export default App;