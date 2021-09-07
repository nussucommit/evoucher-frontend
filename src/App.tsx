import { useState, useCallback } from "react"
import { ChakraProvider } from "@chakra-ui/react"

import "./@commitUI/assets/css/index.css"
import "./App.css"
import Pages from "pages"

function App() {
  return (
    <ChakraProvider>
      <Pages />
    </ChakraProvider>
  )
}

export default App
