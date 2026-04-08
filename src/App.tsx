import Login from "./components/Login"
import store from "./stores/stores"

function App() {
  console.log(store.getState())
  return (
    <div>
        <Login />
    </div>
  )
}

export default App
