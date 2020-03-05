import React from "react";
import { Loading } from './app/pages';
import { StoreProvider } from "./app/store";

const App = () => {
  return (
    <StoreProvider>
      <Loading />
    </StoreProvider>
  )
}

export default App;
