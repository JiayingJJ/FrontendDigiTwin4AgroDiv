import OpenLayersMap from "./components/OpenLayersMap"
import { ChakraProvider } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import Crop from "./components/Crop"
import Login from "./components/Login"
import store from "./stores/stores"

function App() {
  console.log(store.getState())
  return (
    <ChakraProvider>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100vw"
        height="100vh"
        gap={3}
        style={{
          background: "#F8F4E3"
        }}
      >
        <Login/>
        <OpenLayersMap />
        <Crop/>
      </Flex>
    </ChakraProvider>
  )
}

export default App
