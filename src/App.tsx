import Crop from "./components/Crop"
import OpenLayersMap from "./components/OpenLayersMap"
function App() {
  return (
    <>
      <div
        className="flex flex-col items-center justify-center w-screen h-screen space-y-3"
      >
        <Crop />
        <OpenLayersMap />
      </div>
    </>
  )
}

export default App
