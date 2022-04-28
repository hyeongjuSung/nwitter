import { useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase"

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(authService.currentUser);
  setInterval(() => console.log(authService.currentUser), 2000);
  
  return (
    <>
      <AppRouter iaLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
