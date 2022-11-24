import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import { toggleConnect, getAllPages } from 'services/pages/pagesActions';
import { deleteAdmin, addAdmin, getAdmins } from './services/actions';
import { loginSucceed, getAuthInfo } from 'services/auth/authActions';

/** import components */
import User from './components/User/User';

import './styles.css';

class General extends React.Component {
  state = {
    disablePageBot: false
  }

  componentDidMount() {
    this.props.actions.getAdmins(this.props.match.params.id);
    this.props.actions.getAllPages();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pageLoading) {
      Swal({
        title: 'Please wait...',
        text: 'We are disconnecting this page...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.pageLoading) {
      Swal.close();
      if (this.state.disablePageBot) {
        this.props.history.push('/dashboard');
      }

      if (
        this.props.pages !== nextProps.pages &&
        nextProps.toggleConnectSucceed
      ) {
        toastr.success(nextProps.successText);
        this.props.history.push('/dashboard');
      }
    }

    if (nextProps.adminLoading) {
      Swal({
        title: 'Please wait...',
        text: 'Loading Admins...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.adminLoading) {
      Swal.close();

      if (nextProps.adminError) {
        toastr.error(nextProps.adminError);
      }
    }
  }

  _disablePageBot = () => {
    Swal({
      title: 'Are you sure you want to disable this bot?',
      text: 'All of your automations will be turned off',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Disconnect',
      cancelButtonText: 'No, Don’t Do This',
      confirmButtonColor: '#f02727',
      cancelButtonColor: '#274BF0'
    }).then(result => {
      if (result.value) {
        this.props.actions.toggleConnect(this.props.match.params.id);
        this.setState({ disablePageBot: true });
      }
    });
  };

  _inviteAdmin = () => {
    if (this.refs.emailRef) {
      if (!this.refs.emailRef.validity.valid) {
        toastr.warning('Please input a valid email address.');
      } else {
        this.props.actions.addAdmin(
          this.props.match.params.id,
          this.refs.emailRef.value
        );
        this.refs.emailRef.value = '';
      }
    }
  };

  responseFacebook = response => {
    if (!!response && response.accessToken) {
      this.props.actions.loginSucceed(response);
      this.props.actions.getAuthInfo('/');
    }
  };

  render() {
    return (
      <div className="d-flex flex-column general-container">
        <div className="d-flex flex-column page-header">
          <div className="d-flex align-items-center page-title">
            <h4 className="mb-0">Page Admins</h4>
          </div>
          <div className="d-flex">
            <div className="input-group mb-4">
              <div className="input-group-prepend">
                <span className="input-group-text" id="user-addon">
                  <i className="fa fa-user-o" />
                </span>
              </div>
              <input
                type="email"
                ref={'emailRef'}
                className="form-control"
                aria-describedby="user-addon"
                placeholder="Invite someone to work on this page"
              />
            </div>
            <div className="text-center ml-4">
              <button
                className="btn btn-primary px-5 m-auto"
                onClick={this._inviteAdmin}
              >
                Invite
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column page-content">
          <div className="user-list">
            {this.props.admins.map((admin, index) => (
              <User
                key={index}
                admin={admin}
                onDelete={adminId =>
                  this.props.actions.deleteAdmin(
                    this.props.match.params.id,
                    adminId
                  )
                }
              />
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between page-footer">
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            authType="rerequest"
            callback={this.responseFacebook}
            render={renderProps => (
              <button
                onClick={renderProps.onClick}
                className="btn btn-refresh bg-white text-primary font-weight-normal"
              >
                Refresh Permissions
              </button>
            )}
          />
          <button
            className="btn btn-link btn-disable-bot font-weight-normal p-0"
            onClick={this._disablePageBot}
          >
            Disable Page Bot
          </button>
        </div>
      </div>
    );
  }
}

General.propTypes = {
  actions: PropTypes.object.isRequired,
  admins: PropTypes.array.isRequired,
  adminLoading: PropTypes.bool.isRequired,
  adminError: PropTypes.any,
  pageLoading: PropTypes.bool.isRequired,
  pageError: PropTypes.any,
  toggleConnectSucceed: PropTypes.bool.isRequired,
  successText: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  admins: state.default.settings.admins.admins,
  adminLoading: state.default.settings.admins.loading,
  adminError: state.default.settings.admins.error,
  pageLoading: state.default.pages.loading,
  pageError: state.default.pages.error,
  toggleConnectSucceed: state.default.pages.toggleConnectSucceed,
  successText: state.default.pages.successText
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      toggleConnect,
      deleteAdmin,
      addAdmin,
      getAdmins,
      loginSucceed,
      getAuthInfo,
      getAllPages
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(General)
);
