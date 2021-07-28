import { Route, Switch } from "react-router-dom";

// Import dashboard pages
import Dashboard from "../components/dashboard/dashboard";
import Inbox from "../components/dashboard/messaging/inbox";
import UsersList from "../components/dashboard/profile/users-list";
import UsersProfileView from "../components/dashboard/profile/UsersProfileView";
import ConfirmPaymentConfiguration from "../components/dashboard/confirmpaymentconfiguration";
import ConfirmPaymentConfigurationDone from "../components/dashboard/confirmpaymentconfigurationdone";
import CreateExpert from "../components/dashboard/create-expert";
import Conversation from "../components/dashboard/messaging/conversation";
import ComposeMessage from "../components/dashboard/messaging/compose-message";
import AdminSessionList from "../components/dashboard/admin-session-list";
import JustExample from "../components/dashboard/JustExample";
/* import other components */
import RequireAuth from "../components/auth/require_auth";
import SessionReviews from "../components/dashboard/session-reviews";
import MyReviews from "../components/dashboard/my-reviews";

const DashboardRoute = ({match}) => {
    return(
        <Switch>
            <Route exact path={match.path} component={RequireAuth(Dashboard)} />
            <Route exact path={`${match.path}/inbox`}  component={RequireAuth(Inbox)}/>
            <Route exact path={`${match.path}/userslist`}  component={RequireAuth(UsersList)}/>
            <Route exact path={`${match.path}/userslist/:id`}  component={RequireAuth(UsersProfileView)}/>
            <Route exact path={`${match.path}/create-expert`}  component={RequireAuth(CreateExpert)}/>
            <Route exact path={`${match.path}/conversation/new`}  component={RequireAuth(ComposeMessage)}/>
            <Route exact path={`${match.path}/conversation/view/:conversationId`}  component={RequireAuth(Conversation)}/>
            <Route exact path={`${match.path}/sessionsList`}  component={RequireAuth(AdminSessionList)}/>
            <Route exact path={`${match.path}/my-reviews`}  component={RequireAuth(MyReviews)}/>
            <Route exact path={`${match.path}/session-reviews`}  component={RequireAuth(SessionReviews)}/>
            <Route exact path={`${match.path}/confirm-payments`}  component={RequireAuth(ConfirmPaymentConfiguration)}/>
            <Route exact path={`${match.path}/confirm-payments-done`}  component={RequireAuth(ConfirmPaymentConfigurationDone)}/>
            <Route exact path={`${match.path}/example-tobebgnoredlater`}  component={RequireAuth(JustExample)}/>
        </Switch>
    );
};

export default DashboardRoute;