import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

//steps to create react app using vite
// npm create vite@latest
// npm i
// npm i eslint vite-plugin-eslint eslint-config-react-app --save
// create .eslintrc.json file

//steps to use tailwind css
//tailwind docs => installation => Framework guide => process

// Prettier for tailwind
// search tailwind prettier extension => open github link => process
