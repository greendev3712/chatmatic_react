import React from 'react';
import { bindActionCreators } from 'redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';

import { getBillingInfo } from './services/actions';

import Subscription from './scenes/Subscription';
import BillingInfo from './scenes/BillingInfo';

import './styles.css';

class Billing extends React.Component {
  componentDidMount() {
    this.props.actions.getBillingInfo(this.props.match.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.loading) {
      Swal({
        title: 'Please wait...',
        text: 'Processing...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.loading) {
      Swal.close();

      if (nextProps.error) {
        toastr.error(nextProps.error);
      } else if (nextProps.billingInfo && nextProps.billingInfo.email) {
        this.props.history.push(
          `/page/${this.props.match.params.id}/settings/billing/billing-info`
        );
      }
    }
  }

  render() {
    return (
      <Switch>
        <Redirect
          exact
          path={`${this.props.match.path}`}
          to={`${this.props.location.pathname}/subscription`}
        />
        <Route
          path={`${this.props.match.path}/subscription`}
          exact
          render={props => <Subscription {...props} />}
        />
        <Route
          path={`${this.props.match.path}/billing-info`}
          render={props => <BillingInfo {...props} />}
        />
      </Switch>
    );
  }
}

Billing.propTypes = {
  billingInfo: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  billingInfo: state.default.settings.billing.billingInfo,
  loading: state.default.settings.billing.loading,
  error: state.default.settings.billing.error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getBillingInfo
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Billing);
