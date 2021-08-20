import React from "react";
import { Route, Switch } from "react-router-dom";

// Import miscellaneous routes and other requirements
import NotFoundPage from "../pages/not-found-page";
import Test from "../pages/test";

// Import static pages
import HomePage from "../pages/home-page";
import MapPage from "../pages/MapPage";
import TestPage from "../pages/test-page";
import Forum from "../pages/forum";
import PrivacyPolicy from "../pages/privacy-policy";
import ContactPage from "../pages/contact-page";
import ExpertsListingPage from "../pages/experts-listing-page";
import ViewExpert from "../pages/view-expert";
import EditExpert from "../pages/editable-expert";
import UserSessionPage from "../components/dashboard/user-session-page";
import ExpertSessionPage from "../components/dashboard/expert-session-page";
import TokboxPage from "../components/dashboard/tokbox-page";
import ComponentSamplesPage from "../pages/component-samples";
import HowItWorks from "../pages/how-it-works";
import CommunityNews from "../pages/CommunityNews";
import ExpertSignupPage from "../components/auth/expert-signup";

// Import authentication related pages
import Register from "../components/auth/register";
import Login from "../components/auth/login";
import LoginSocial from "../components/auth/login-social";
import Logout from "../components/auth/logout";
import ForgotPassword from "../components/auth/forgot_password";
import ResetPassword from "../components/auth/reset_password";
import BillingSettings from "../components/billing/settings";

// admin 

import ViewProfile from "../components/dashboard/profile/view-profile";
import AccountInformation from "../components/dashboard/account-information";
import UserProfileUpdation from "../components/dashboard/UserProfileUpdation";

/* Import billing pages */
import InitialCheckout from "../components/billing/initial-checkout";

/* Import admin pages */
import AdminDashboard from "../components/admin/dashboard";

/* Import higher order components */
import RequireAuth from "../components/auth/require_auth";
import MysessionList from "../components/dashboard/mysession-list";
import Recordings from "../pages/experts-recordings";
import DashboardRoute from "./dashboard";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/map" component={MapPage} />
      <Route path="/community-news/:value" component={CommunityNews} />
      <Route path="/testpage" component={TestPage} />
      <Route path="/forum" component={Forum} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/list/:category" component={ExpertsListingPage} />
      <Route path="/expert-signup/:token" component={ExpertSignupPage} />
      <Route path="/contact-us" component={ContactPage} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/login-social" component={LoginSocial} />
      <Route path="/logout" component={Logout} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:resetToken" component={ResetPassword} />
      <Route path="/tokbox/:slug" component={TokboxPage} />
      <Route path="/tokbox/join/:slug" component={TokboxPage} />
      <Route path="/mysession-list" component={MysessionList} />
      <Route path="/component-samples" component={RequireAuth(ComponentSamplesPage)} />
      <Route path="/checkout/:plan" component={RequireAuth(InitialCheckout)} />
      <Route path="/billing/settings" component={RequireAuth(BillingSettings)} />
      <Route path="/profile" component={RequireAuth(ViewProfile)} />
      <Route path="/update-profile" component={RequireAuth(UserProfileUpdation)} />
      <Route path="/expert/:category/:slug" component={ViewExpert} />
      <Route path="/edit/expert/:category/:slug" component={EditExpert} />
      <Route path="/session/:slug" component={RequireAuth(UserSessionPage)} />
      <Route path="/mysession/:slug" component={RequireAuth(ExpertSessionPage)} />
      <Route path="/recordings" component={RequireAuth(Recordings)} />
      <Route path="/admin" component={RequireAuth(AdminDashboard)} />
      <Route path="/account-info" component={RequireAuth(AccountInformation)} />
      <Route path="/dashboard" component={DashboardRoute} />
      <Route path="/test" component={Test} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
