import Approute from "./Approutes/Approute"
import { UserProvider } from "./context/userContext"
import { useState } from "react";


function App() {


  return (
    <>
    <UserProvider>
    <Approute/>
    </UserProvider>
    


    </>
  )
}

export default App
