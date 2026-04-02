import OpenLayersMap from "./components/OpenLayersMap"
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <div
        className="flex flex-col items-center justify-center w-screen h-screen space-y-3"
        style={{
          background: "#F8F4E3"
        }}
      >
        <OpenLayersMap />
      </div>
    </ChakraProvider>
  )
}

export default App
