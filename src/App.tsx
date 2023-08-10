import "./App.scss";
import "./CustomAnt.scss";
import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
import { UserContext } from "@/context/UserContext";
import { useBeforeRender } from "./component/Error";
import { Error404 } from "./component";

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
const Personal = loadable(() => import("@/scenes/User/Personal Profile"));
const Support = loadable(() => import("@/scenes/User/Support"));
const ForgotPassword = loadable(() => import("@/scenes/ForgotPassword"));
const ClubOrder = loadable(() => import("@/scenes/Club/ClubOrder"));
const ClubMember = loadable(() => import("@/scenes/Club/ClubMember"));
const ClubOrderOnline = loadable(() => import("@/scenes/Club/ClubOrderOnline"));
const UserOrderHistory = loadable(() => import("@/scenes/User/OrderHistory"));
const ClubReport = loadable(() => import("@/scenes/Club/ClubReport"));

const App = () => {
  const token = localStorage.getItem("access_token");
  const { currentClubId } = useContext(UserContext);
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
            {token && (
              <>
                {currentClubId && (
                  <>
                    <Route path="/clubstaff/report" Component={ClubReport} />
                    <Route path="/clubstaff/member-order" Component={ClubStaff} />
                    <Route path="/clubstaff/books" Component={ClubBookManagement} />
                    <Route path="/clubstaff/orders" Component={ClubOrder} />
                    <Route path="/clubstaff/members" Component={ClubMember} />
                    <Route path="/clubstaff/online-orders" Component={ClubOrderOnline} />
                  </>
                )}
                <Route path="/clubbook" Component={ClubBook} />
                <Route path="/bookclub" Component={ClubBook} />
                <Route path="/my-profile" Component={Personal} />
                <Route path="/book-history" Component={UserOrderHistory} />
              </>
            )}
            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
