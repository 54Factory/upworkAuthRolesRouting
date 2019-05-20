import React from "react";
import { Provider } from "react-redux";
import { store, history } from "./redux/store";
import { ThemeProvider } from "styled-components";
import PublicRoutes from "./router";
import themes from "./settings/themes";

import { themeConfig } from "./settings";
import AppHolder from "./AppStyle";
import Boot from "./redux/boot";

const App = () => {
  return (
    <ThemeProvider theme={themes[themeConfig.theme]}>
      <AppHolder>
        <Provider store={store}>
          <PublicRoutes history={history} />
        </Provider>
      </AppHolder>
    </ThemeProvider>
  );
}

// start app
Boot()
  .then(() => App())
  .catch(error => console.error(error));

export default App;
