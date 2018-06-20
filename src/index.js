import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import amber from "@material-ui/core/colors/amber";
import teal from "@material-ui/core/colors/teal";

import registerServiceWorker from "./registerServiceWorker";

import Application from "./components/application/Application";

import store from "./data/store";

import "./index.css";

const theme = createMuiTheme({
  palette: {
    primary: amber,
    secondary: teal
  }
});

const App = () => (
  <Provider color="red">
    <MuiThemeProvider theme={theme}>
      <Application store={store} />
    </MuiThemeProvider>
  </Provider>
);

const isoDate = new Date().toISOString();

store.loadDiary(isoDate);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
