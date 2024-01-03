import { Rotas } from "./routes/Rotas";
import { AuthContextProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <Rotas />
    </AuthContextProvider>
  );
}

export default App;
