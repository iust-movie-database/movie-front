import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/auth-context";
import { AppRouter } from "./router";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}