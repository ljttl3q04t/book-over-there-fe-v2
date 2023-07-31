import "./App.scss";
import "./CustomAnt.scss";
import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
import { UserContext } from "@/context/UserContext";
import { useBeforeRender } from "./component/Error";
const Error404 = loadable(() => import("@/component/Error404"));
const Error403 = loadable(() => import("@/component/Error403"));

const BookDetail = loadable(() => import("@/scenes/BookDetail"));
const Checkout = loadable(() => import("@/scenes/Checkout"));
const ClubBook = loadable(() => import("@/scenes/Club/ClubBook"));
const ClubList = loadable(() => import("@/scenes/Club/ClubList"));
const ClubStaff = loadable(() => import("@/scenes/Club/ClubStaff"));
const ClubBookManagement = loadable(() => import("@/scenes/Club/ClubBookManagement"));
const Homepage = loadable(() => import("@/scenes/Homepage"));
const LayoutCustom = loadable(() => import("@/scenes/Layout/index"));
const Login = loadable(() => import("@/scenes/Login"));
const Register = loadable(() => import("@/scenes/Register"));
const MyBook = loadable(() => import("@/scenes/User/MyBook"));
const BookBorrow = loadable(() => import("@/scenes/User/BookBorrow"));
const Payment = loadable(() => import("@/scenes/User/Payment"));
const Personal = loadable(() => import("@/scenes/User/Personal Profile"));
const Support = loadable(() => import("@/scenes/User/Support"));
const Transaction = loadable(() => import("@/scenes/User/Transaction History"));
const ForgotPassword = loadable(() => import("@/scenes/ForgotPassword"));
const ClubOrder = loadable(() => import("@/scenes/Club/ClubOrder"));
const ClubMember = loadable(() => import("@/scenes/Club/ClubMember"));
const ClubOrderOnline = loadable(() => import("@/scenes/Club/ClubOrderOnline"));
const UserOrderHistory = loadable(() => import("@/scenes/User/OrderHistory"));

const App = () => {
  const token = localStorage.getItem("access_token");
  const { user } = useContext(UserContext);
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
          <Route path="/password-reset/confirm/:uid/:token" Component={ForgotPassword} />
          <Route element={<LayoutCustom />}>
            <Route path="/" Component={Homepage} />
            <Route path="/checkout" Component={Checkout} />
            <Route path="/support" Component={Support} />
            <Route path="/book-detail/:id" Component={BookDetail} />
            <Route path="/clublist" Component={ClubList} />
            {token ? (
              <>
                {user?.is_staff && <Route path="/clubstaff/member-order" Component={ClubStaff} />}
                {user?.is_staff && <Route path="/clubstaff/books" Component={ClubBookManagement} />}
                {user?.is_staff && <Route path="/clubstaff/orders" Component={ClubOrder} />}
                {user?.is_staff && <Route path="/clubstaff/members" Component={ClubMember} />}
                {user?.is_staff && <Route path="/clubstaff/online-orders" Component={ClubOrderOnline} />}
                <Route path="/clubbook" Component={ClubBook} />
                <Route path="/bookclub" Component={ClubBook} />
                <Route path="/my-profile" Component={Personal} />
                <Route path="/payment" Component={Payment} />
                <Route path="/transactionhistory" Component={Transaction} />
                <Route path="/my-book" Component={MyBook} />
                <Route path="/book-borrow" Component={BookBorrow} />
                <Route path="/book-history" Component={UserOrderHistory} />
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
