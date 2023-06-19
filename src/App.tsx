import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LayoutCustom from "./scenes/Layout/index";
import Login from "./scenes/Login";
import Homepage from "./scenes/Homepage";
import Checkout from "./scenes/Checkout";
import Register from "./scenes/Register";
// User
import Personal from "./scenes/User/Personal Profile";
import Transaction from "./scenes/User/Transaction History";
import Payment from "./scenes/User/Payment";
import Support from "./scenes/User/Support";
import BookHistory from "./scenes/User/BookHistory";
import BookWishList from "./scenes/User/BookWishList";

// Club
import ClubList from "./scenes/Club/ClubList";
import ClubBook from "./scenes/Club/ClubBook";
import ClubStaff from "./scenes/Club/ClubStaff";

import "./App.scss";
import { useBeforeRender } from "./component/Error";
import BookDetail from "./scenes/BookDetail";
import MyBook from "./scenes/User/MyBook";
import { getAccessToken } from "./http-common";


const App = () => {
  useBeforeRender(() => {
    window.addEventListener("error", (e) => {
      if (e) {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div"
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr)
          resizeObserverErr.className = "hide-resize-observer";
        if (resizeObserverErrDiv)
          resizeObserverErrDiv.className = "hide-resize-observer";
      }
    });
  }, []);

  const pagePermissionAdmin = () => {
    if (getAccessToken()) {
      return <>
        <Route path="/clubstaff" Component={ClubStaff} />
        <Route path="/clubbook" Component={ClubBook} />
        <Route path="/bookclub" Component={ClubBook} />
        <Route path="/personalprofile" Component={Personal} />
        <Route path="/payment" Component={Payment} />
        <Route path="/transactionhistory" Component={Transaction} />
        <Route path="/My-book" Component={MyBook} />
        <Route path="/book-history" Component={BookHistory} />
        <Route path="/book-wishlist" Component={BookWishList} />
      </>
    }

    return <></>
  }


  return (
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
          {pagePermissionAdmin()}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
