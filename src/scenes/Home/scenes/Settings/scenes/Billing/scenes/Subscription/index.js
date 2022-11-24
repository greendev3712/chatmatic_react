import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getBillingInfo } from '../../services/actions';
import SmsPlans from '../SmsPlans';

import { Modal } from 'components';
import CheckoutModal from '../../components/CheckoutModal';

class Subscription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingCheckoutModal: false,
      plan: null
    };
  }

  componentDidMount() {
    this.props.actions.getBillingInfo(this.props.match.params.id);
  }

  render() {
    return (
      <div
        className="d-flex justify-content-center align-items-center payment-level-container"
        data-aos="fade"
      >
        <div>
          <p className="mb-0 ml-3 title-heading">Select A Plan</p>
          <div className="d-flex flex-md-row flex-column justify-content-center align-items-md-end align-items-center w-100 mt-0 card-container">

            <div className="d-flex flex-column card-content">
                <div className="d-flex justify-content-between mb-3 membership-info">
                  <span>$97/ MONTHLY</span>
                  <span>BASIC</span>
                </div>
                <span className="subscribers-count">
                  Up to 60,000 Subscribers
                </span>
                <button
                  ref="monthlyActivate"
                  className="btn btn-link"
                  onClick={() =>
                    this.setState({
                      isShowingCheckoutModal: true,
                      plan: 'monthly'
                    })
                  }
                >
                  Activate this Account Level
                </button>
              </div>
            
            <div className="d-flex flex-column card-content">
              <div className="d-flex justify-content-between mb-3 membership-info">
                <span>$997/ YEAR</span>
                <span>PREMIUM</span>
              </div>
              <span className="subscribers-count">
                Up to 60,000 Subscribers
              </span>
              <button
                ref="yearlyActivate"
                className="btn btn-link"
                onClick={() =>
                  this.setState({
                    isShowingCheckoutModal: true,
                    plan: 'yearly'
                  })
                }
              >
                Activate this Account Level
              </button>
            </div>


          </div>

          {/* <hr /> */}
            
          <SmsPlans />

        </div>
        <Modal isOpen={this.state.isShowingCheckoutModal}>
          <CheckoutModal
            plan={this.state.plan}
            close={() => this.setState({ isShowingCheckoutModal: false })}
          />
        </Modal>
      </div>
    );
  }
}

Subscription.propTypes = {
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
)(Subscription);
