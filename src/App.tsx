import Login from "./components/Login"
import store from "./stores/stores"
/* 
003E1F deep forest
14342B evergreen
60935D sage green
FB3640 strawberry
EDB458 honey bronze
E8871E amber earth
F7EDE2 linen
*/
function App() {
  console.log(store.getState())
  return (
    <div style={{backgroundColor:"#f8f1e3", width:"100vw", height:"100vh"}}>
        <Login />
    </div>
  )
}

export default App
