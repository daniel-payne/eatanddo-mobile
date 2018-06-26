import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import amber from "@material-ui/core/colors/amber";
import teal from "@material-ui/core/colors/teal";

import getVersion from "./data/conectors/remote/getVersion";

import registerServiceWorker, { unregister } from "./registerServiceWorker";

import Application from "./components/application/Application";

import store from "./data/store";

import { BREAKFAST, LUNCH, DINNER, SNACKS } from "./data/models/Day";

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

const now = new Date();
const isoDate = now.toISOString();
const timeOfDay = now.getHours();

let mealtime = SNACKS;

if (timeOfDay < 12) {
  mealtime = BREAKFAST;
} else if (timeOfDay < 15) {
  mealtime = LUNCH;
} else if (timeOfDay > 18 && timeOfDay < 22) {
  mealtime = DINNER;
}

store.loadDiary(isoDate, mealtime);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

getVersion().then(data => {
  if (data.clientVersion !== process.env.REACT_APP_VERSION) {
    registerServiceWorker();
  } else {
    console.log(
      `UPDATING version ${process.env.REACT_APP_VERSION} to ${
        data.clientVersion
      }`
    );
    unregister();
  }
});
