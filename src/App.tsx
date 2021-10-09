import { useState, useCallback, useEffect } from "react";
import { ChakraProvider, usePrevious } from "@chakra-ui/react";

import "./@commitUI/assets/css/index.css";
import "./App.css";
import Pages from "pages";
import useAuth from "hooks/useAuth";
import { getToken } from "utils/auth";

function App() {
  const { userLogin, adminLogin, logout } = useAuth();
  useEffect(() => {
    const fn = async () => {
      const token = await getToken();
      if (token) {
        try {
          if (token.authType === "USER") userLogin(token);
          else if (token.authType === "ADMIN") adminLogin(token);
          else throw new Error();
        } catch {
          await logout();
        }
      }
    };
    fn();
  }, [userLogin, adminLogin, logout]);

  return (
    <ChakraProvider>
      <Pages />
    </ChakraProvider>
  );
}

export default App;
