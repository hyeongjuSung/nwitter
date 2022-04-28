import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase"

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(authService.currentUser);
  useEffect(() => {
    authService.onAuthStateChanged((user) => console.log(user));
  }, []);

  return (
    <>
      <AppRouter iaLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
