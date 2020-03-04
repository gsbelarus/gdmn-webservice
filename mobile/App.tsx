import React from "react";
import MyApp from './app/index'
import { MyContextProvider } from "./app/store";

const App = () => {
  return (
    <MyContextProvider>
      <MyApp />
    </MyContextProvider>
  )
}

export default App;
