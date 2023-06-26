import "./App.scss";

import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";

import { useBeforeRender } from "./component/Error";
const Error404 = loadable(() => import("@/component/Error404"));
const Error403 = loadable(() => import("@/component/Error403"));

const BookDetail = loadable(() => import("@/scenes/BookDetail"));
const Checkout = loadable(() => import("@/scenes/Checkout"));
const ClubBook = loadable(() => import("@/scenes/Club/ClubBook"));
const ClubList = loadable(() => import("@/scenes/Club/ClubList"));
const ClubStaff = loadable(() => import("@/scenes/Club/ClubStaff"));
const Homepage = loadable(() => import("@/scenes/Homepage"));
const LayoutCustom = loadable(() => import("@/scenes/Layout/index"));
const Login = loadable(() => import("@/scenes/Login"));
const Register = loadable(() => import("@/scenes/Register"));
const BookHistory = loadable(() => import("@/scenes/User/BookHistory"));
const BookWishList = loadable(() => import("@/scenes/User/BookWishList"));
const MyBook = loadable(() => import("@/scenes/User/MyBook"));
const Payment = loadable(() => import("@/scenes/User/Payment"));
const Personal = loadable(() => import("@/scenes/User/Personal Profile"));
const Support = loadable(() => import("@/scenes/User/Support"));
const Transaction = loadable(() => import("@/scenes/User/Transaction History"));

const App = () => {
  const token = localStorage.getItem("access_token");

  useBeforeRender(() => {
    window.addEventListener("error", (e) => {
      if (e) {
        const resizeObserverErrDiv = document.getElementById("webpack-dev-server-client-overlay-div");
        const resizeObserverErr = document.getElementById("webpack-dev-server-client-overlay");
        if (resizeObserverErr) resizeObserverErr.className = "hide-resize-observer";
        if (resizeObserverErrDiv) resizeObserverErrDiv.className = "hide-resize-observer";
      }
    });
  }, []);

  return (
    <div id="root">
      <Router>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route element={<LayoutCustom />}>
            <Route path="/" Component={Homepage} />
            <Route path="/checkout" Component={Checkout} />
            <Route path="/support" Component={Support} />
            <Route path="/book-detail/:id" Component={BookDetail} />
            <Route path="/clublist" Component={ClubList} />
            {token ? (
              <>
                <Route path="/clubstaff" Component={ClubStaff} />
                <Route path="/clubbook" Component={ClubBook} />
                <Route path="/bookclub" Component={ClubBook} />
                <Route path="/my-profile" Component={Personal} />
                <Route path="/payment" Component={Payment} />
                <Route path="/transactionhistory" Component={Transaction} />
                <Route path="/my-book" Component={MyBook} />
                <Route path="/book-history" Component={BookHistory} />
                <Route path="/book-wishlist" Component={BookWishList} />
              </>
            ) : (
              <Route path="/" element={<Error403 />} />
            )}
          </Route>
          <Route element={<Error404 />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
