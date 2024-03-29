import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNav from "./components/Nav/tabNav";
import { Provider } from "react-redux";
import { store } from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <TabNav />
      </NavigationContainer>
    </Provider>
  );
}
