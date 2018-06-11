import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";

import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

import Application from "./components/application/Application";

import store from "./data/store";

const App = () => (
  <Provider color="red">
    <Application store={store} />
  </Provider>
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
