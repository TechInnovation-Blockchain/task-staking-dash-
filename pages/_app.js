import React, { useCallback, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import { Web3ReactProvider } from "@web3-react/core";
import { UserProvider } from "contexts/UserContext";
import PageChange from "components/PageChange/PageChange.js";
import { Web3Provider } from "@ethersproject/providers";
import { ToastContainer } from "react-toastify";
// plugins styles from node_modules
import "react-notification-alert/dist/animate.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "@fullcalendar/common/main.min.css";
import "@fullcalendar/daygrid/main.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "select2/dist/css/select2.min.css";
import "quill/dist/quill.core.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// plugins styles downloaded
import "assets/vendor/nucleo/css/nucleo.css";
// core styles
import "assets/scss/nextjs-argon-dashboard-pro.scss?v1.1.0";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider from "../theme";
import { ThemeContextProvider } from "../contexts/ThemeContext";
import {
  EthereumContextProvider,
  useBlockNumber,
} from "../contexts/EthereumContext";
import { useUser } from "../contexts/UserContext";
import '../assets/scss/global.scss';
Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

const Main = (props) => {
  // static async getInitialProps({ Component, router, ctx }) {
  //   let pageProps = {};

  //   if (Component.getInitialProps) {
  //     pageProps = await Component.getInitialProps(ctx);
  //   }

  //   return { pageProps };
  // }

  const getLibrary = (provider) => {
    const library = new Web3Provider(provider, "any");
    library.pollingInterval = 15000;
    return library;
  };

  const { Component, pageProps } = props;
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Autonio</title>
      </Head>
      <ThemeContextProvider>
        <ThemeProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <UserProvider>
              <EthereumContextProvider>
                <Layout>
                  <Component {...pageProps} />
                  <ToastContainer
                    position="top-right"
                    autoClose={8000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    draggable={false}
                    pauseOnVisibilityChange
                    closeOnClick
                    pauseOnHover
                  />
                </Layout>
              </EthereumContextProvider>
            </UserProvider>
          </Web3ReactProvider>
        </ThemeProvider>
      </ThemeContextProvider>
    </React.Fragment>
  );
};

export default Main;
