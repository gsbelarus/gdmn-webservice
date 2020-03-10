import React from "react";
import { Loading } from './src/pages';
import { StoreProvider } from "./src/store";

const App = () => {
  return (
    <StoreProvider>
      <Loading />
    </StoreProvider>
  )
}

export default App;
