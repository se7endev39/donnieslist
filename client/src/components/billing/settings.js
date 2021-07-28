import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import * as actions from '../../actions/billing';
import moment from "moment";
import CheckoutForm from "./checkout-form";

const BillingSettings = (props) => {
  const default_props = {
    cancelConfirm: false,
    changeSubscription: false,
    updateBilling: false,
    newPlan: "",
  };

  const [state, setState] = useState(default_props);
  const { customer } = useSelector((state) => state.customer.customer);

  useEffect(() => {
    props.fetchCustomer();
  }, [props]);

  const handlePlanChange = (value) => {
    setState({ ...state, newPlan: value });
  };

  const changePlanSubmit = () => {
    props.updateSubscription(state.newPlan);
  };

  const renderAlert = () => {
    if (props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {props.errorMessage}
        </div>
      );
    } else if (props.message) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {props.message}
        </div>
      );
    }
  };

  const renderPlan = () => {
    if (customer.subscriptions) {
      const mostRecentSubscription = customer.subscriptions.total_count - 1;
      const mostRecentSource = customer.sources.total_count - 1;
      const subscribedPlan =
        customer.subscriptions.data[mostRecentSubscription].plan.id;
      const lastFour = customer.sources.data[mostRecentSource].last4;
      const pmtAmt = (
        customer.subscriptions.data[mostRecentSubscription].plan.amount / 100
      ).toFixed(2);
      const pmtDate = moment
        .unix(
          customer.subscriptions.data[mostRecentSubscription].current_period_end
        )
        .format("dddd, MMMM Do YYYY")
        .toString();

      if (
        customer.subscriptions.data[mostRecentSubscription].cancel_at_period_end
      ) {
        return (
          <div className="active-subscription">
            Your {subscribedPlan} plan will expire on {pmtDate}. You will not be
            charged again.
          </div>
        );
      } else {
        return (
          <div className="active-subscription">
            You are subscribed to the {subscribedPlan} plan. Your credit card
            ending in {lastFour} will be charged ${pmtAmt} on {pmtDate}.
            {renderAccountActions()}
          </div>
        );
      }
    }

    return <div className="loading">Loading...</div>;
  };

  const renderAccountActions = () => {
    if (state.cancelConfirm) {
      // TODO: Event handler for yes to dispatch action to cancel sub + redirect to "sorry to see you go" page
      return (
        <div className="cancel-confirm">
          <p>Do you really want to cancel your membership to ImproveFit?</p>
          <div className="action-buttons">
            <button
              className="btn btn-danger"
              onClick={() => {
                props.cancelSubscription();
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                toggleCancelConfirm();
              }}
            >
              No
            </button>
          </div>
        </div>
      );
    } else if (state.changeSubscription) {
      return (
        <div className="action-buttons">
          <select
            className="form-control"
            name="newPlan"
            value={state.newPlan}
            onChange={(e) => {
              handlePlanChange(e.target.value);
            }}
          >
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
          </select>
          <button
            className="btn btn-primary"
            onClick={() => {
              changePlanSubmit();
            }}
          >
            Change
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              toggleChangeSubscription();
            }}
          >
            Cancel
          </button>
        </div>
      );
    } else if (state.updateBilling) {
      return (
        <div className="action-buttons">
          <CheckoutForm />
          <button
            className="btn btn-danger"
            onClick={() => {
              toggleUpdateBilling();
            }}
          >
            Cancel
          </button>
        </div>
      );
    } else {
      return (
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={(e) => {
              toggleChangeSubscription();
            }}
          >
            Change Subscription
          </button>
          <button
            className="btn btn-info"
            onClick={() => {
              toggleUpdateBilling();
            }}
          >
            Update Billing Information
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              toggleCancelConfirm();
            }}
          >
            Cancel Subscription
          </button>
        </div>
      );
    }
  };

  const toggleChangeSubscription = () => {
    if (state.changeSubscription) {
      setState({ ...state, changeSubscription: false });
    } else {
      setState({ ...state, changeSubscription: true });
    }
  };

  const toggleCancelConfirm = () => {
    if (state.cancelConfirm) {
      setState({ ...state, cancelConfirm: false });
    } else {
      setState({ ...state, cancelConfirm: true });
    }
  };

  const toggleUpdateBilling = () => {
    if (state.updateBilling) {
      setState({ ...state, updateBilling: false });
    } else {
      setState({ ...state, updateBilling: true });
    }
  };
  return (
    <div className="user-subscription">
      {renderAlert()}
      {renderPlan()}
    </div>
  );
};

export default BillingSettings;
