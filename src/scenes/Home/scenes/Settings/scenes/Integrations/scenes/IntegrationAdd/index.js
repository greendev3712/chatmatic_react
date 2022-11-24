import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import { addIntegration, updateIntegration } from '../../services/actions';

import webhookIcon from 'assets/images/icon-webhook.png';
// import shopifyIcon from 'assets/images/icon-shopify.png';
// import youtubeIcon from 'assets/images/icon-youtube.png';
// import infusionIcon from 'assets/images/icon-infusionsoft.png';
// import wordpressIcon from 'assets/images/icon-wordpress.png';
// import facebookIcon from 'assets/images/icon-facebook.png';
import closeCircleIcon from 'assets/images/icon-close-circle-o.png';
import activeCloseCircleIcon from 'assets/images/icon-active-close-circle-o.png';
import checkCircleIcon from 'assets/images/icon-check-circle-o.png';
import activeCheckCircleIcon from 'assets/images/icon-active-check-circle-o.png';

import './styles.css';
import Swal from 'sweetalert2';

class IntegrationAdd extends React.Component {
  constructor(props) {
    super(props);

    const currentIntegration = this.props.integrations.find(
      integration => integration.uid === props.integrationId
    );

    this.state = {
      integrationTypeUid: props.integrationTypes.length
        ? currentIntegration
          ? currentIntegration.integrationTypeUid
          : props.integrationTypes[0].uid
        : null,
      integrationId: this.props.integrationId,
      active: currentIntegration ? currentIntegration.active : false,
      domainWhiteList: [],
      isBack: false
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.loading) {
      Swal({
        title: 'Please wait...',
        text: 'Saving the integration.',
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
        toastr.error('Error', nextProps.error);
        this.setState({ isBack: false });
      } else if (this.state.isBack) {
        this.props.onBack();
      } else {
        if (!this.state.integrationId) {
          this.setState({ integrationId: nextProps.newIntegrationId });
        }
        const integrationId =
          this.state.integrationId || nextProps.newIntegrationId;
        const currentIntegration = nextProps.integrations.find(
          integration => integration.uid === integrationId
        );
        if (currentIntegration.active !== this.state.active) {
          this.setState({ active: currentIntegration.active });
        }
      }
    }
  }

  _removeDomain = domainIndex => {
    const domainWhiteList = this.state.domainWhiteList.filter(
      (domain, index) => index !== domainIndex
    );

    this.setState({ domainWhiteList });
  };

  _addDomain = () => {
    if (this.domainRef.value) {
      this.setState({
        domainWhiteList: this.state.domainWhiteList.concat([
          this.domainRef.value
        ])
      });
      this.domainRef.value = '';
    }
  };

  renderIntegrationForm = () => {
    const currentIntegration = this.props.integrations.find(
      integration => integration.uid === this.state.integrationId
    );
    const integrationType = this.props.integrationTypes.find(
      type => type.uid === this.state.integrationTypeUid
    );

    const integrationTypeName = integrationType && integrationType.name;

    switch (integrationTypeName) {
      case 'shopify':
        return (
          <div className="d-flex flex-column shopify-form-container">
            <span>Enter Store Subdomain</span>
            <div className="d-flex align-items-center">
              <label className="mr-2">https://</label>
              <input type="text" className="form-control" />
              <label className="ml-2">.myshopify.com</label>
            </div>
          </div>
        );
      case 'infusionsoft':
        return (
          <form className="infusionsoft-form-container">
            <div className="form-group">
              <label htmlFor="username" className="m-0">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="m-0">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="token" className="m-0">
                Token ID
              </label>
              <input
                type="text"
                className="form-control"
                id="token"
                placeholder="Token ID"
              />
            </div>
          </form>
        );
      case 'Youtube':
        return (
          <form className="youtube-form-container">
            <div className="form-group">
              <label htmlFor="urlInput" className="m-0">
                URL
              </label>
              <input
                type="url"
                className="form-control"
                id="urlInput"
                placeholder="URL"
              />
            </div>
            <div className="form-group">
              <label htmlFor="userInput" className="m-0">
                User
              </label>
              <input
                type="text"
                className="form-control"
                id="userInput"
                placeholder="User"
              />
            </div>
            <div className="form-group">
              <label htmlFor="userInput" className="m-0">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="userInput"
                placeholder="Password"
              />
            </div>
          </form>
        );
      case 'Webhook':
        return (
          <form className="webhook-form-container">
            <div className="form-group">
              <label htmlFor="webhookName" className="m-0">
                Webhook Name
              </label>
              <input
                type="text"
                className="form-control"
                id="webhookName"
                ref="webhookNameRef"
                placeholder="Webhook Name"
                defaultValue={currentIntegration ? currentIntegration.name : ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="webhookUrl" className="m-0">
                Webhook URL
              </label>
              <input
                type="text"
                className="form-control"
                id="webhookUrl"
                ref="webhookUrlRef"
                placeholder="Webhook Url"
                defaultValue={
                  currentIntegration
                    ? currentIntegration.parameters.webhookUrl
                    : ''
                }
              />
            </div>
          </form>
        );
      //no default
    }
  };

  _submitIntegration = () => {
    const integrationTypeName = this.props.integrationTypes.find(
      type => type.uid === this.state.integrationTypeUid
    ).name;

    if (integrationTypeName === 'Webhook') {
      if (
        !this.refs.webhookNameRef ||
        !this.refs.webhookUrlRef ||
        !this.refs.webhookNameRef.value ||
        !this.refs.webhookUrlRef.value
      ) {
        toastr.warning('Please type all the required fields');
      } else {
        const pageId = this.props.match.params.id;
        const reqParams = {
          name: this.refs.webhookNameRef.value,
          active: true,
          parameters: {
            webhookUrl: this.refs.webhookUrlRef.value
          }
        };

        if (this.state.integrationId) {
          this.props.actions.updateIntegration(
            pageId,
            this.state.integrationId,
            reqParams
          );
        } else {
          this.props.actions.addIntegration(pageId, {
            ...reqParams,
            integrationTypeUid: this.state.integrationTypeUid
          });
        }
      }
    }
  };

  _removeIntegration = () => {
    this.props.actions.updateIntegration(
      this.props.match.params.id,
      this.state.integrationId,
      {
        active: false
      }
    );
  };

  _saveIntegration = () => {
    this._submitIntegration();
    this.setState({ isBack: true });
  };

  render() {
    const integrationType = this.props.integrationTypes.find(
      type => type.uid === this.state.integrationTypeUid
    );

    const integrationTypeName = integrationType && integrationType.name;
    const _renderTypeIcon = typeName => {
      let typeIcon = webhookIcon;

      return <img src={webhookIcon} alt="" width={35} height={35} />;
    };

    return (
      <div className="d-flex flex-column integration-add-scene">
        <div className="row m-0 top-container">
          <div className="col col-sm-8 p-0 integration-list-container">
            <div className="d-flex align-content-start h-100 flex-wrap bg-white integration-list">
              {this.props.integrationTypes.map((item, index) => (
                <div
                  className="d-flex justify-content-center align-items-center btn btn-link integration-item"
                  onClick={() =>
                    this.setState({ integrationTypeUid: item.uid })
                  }
                  key={index}
                >
                  {_renderTypeIcon(item.name)}
                </div>
              ))}
            </div>
          </div>
          <div className="col col-sm-4 bg-white p-0 domain-whitelist-container">
            <div className="d-flex flex-column h-100">
              <div className="d-flex justify-content-center align-items-center domain-whitelist-header">
                <p className="m-0">Domain Whitelist</p>
              </div>
              <div
                className="d-flex flex-column"
                style={{ flex: 1, overflow: 'auto' }}
              >
                <div className="domain-input-container">
                  <label htmlFor="domain-url" className="m-0">
                    Input
                  </label>
                  <div className="input-group">
                    <input
                      ref={ref => (this.domainRef = ref)}
                      type="text"
                      className="form-control"
                      placeholder="Input"
                      id="domain-url"
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-light input-group-text"
                        onClick={this._addDomain}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className={classnames({
                    'domain-list': this.state.domainWhiteList.length
                  })}
                >
                  {this.state.domainWhiteList.map((domain, index) => (
                    <div
                      className="d-flex justify-content-between domain-item"
                      key={index}
                    >
                      <label>{domain}</label>
                      <button
                        className="btn btn-link mb-2"
                        onClick={() => this._removeDomain(index)}
                      >
                        <i className="fa fa-close" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex bottom-container">
          <div className="d-flex flex-column integration-procedure-container">
            <p>Integration Procedure</p>
            <p>{_.startCase(integrationTypeName)}</p>
            {this.renderIntegrationForm()}
            <button
              onClick={this._submitIntegration}
              className="btn btn-primary font-weight-normal text-white"
            >
              Submit
            </button>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-between connect-status-container">
            <p className="align-self-start">Connect Status</p>
            <div className="d-flex flex-column w-100 connect-status">
              <span
                className={classnames('text-center status-not-connected', {
                  active: !this.state.active
                })}
              >
                <img
                  src={
                    this.state.active ? closeCircleIcon : activeCloseCircleIcon
                  }
                  alt=""
                  className="mr-4"
                />
                Not Connected
              </span>
              <div className="position-relative status-border-container">
                <div className="w-100 status-border" />
                <span className="position-absolute bg-white p-4">OR</span>
              </div>
              <span
                className={classnames('text-center status-connected', {
                  active: this.state.active
                })}
              >
                <img
                  src={
                    this.state.active ? activeCheckCircleIcon : checkCircleIcon
                  }
                  alt=""
                  className="mr-4"
                />
                Connected
              </span>
            </div>
            <div className="d-flex">
              <button
                className="btn btn-light btn-remove"
                onClick={this._removeIntegration}
                disabled={!this.state.integrationId}
              >
                Remove
              </button>
              <button
                className="btn btn-primary btn-save"
                onClick={this._saveIntegration}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

IntegrationAdd.propTypes = {
  integrationTypes: PropTypes.array.isRequired,
  integrations: PropTypes.array.isRequired,
  newIntegrationId: PropTypes.any,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  actions: PropTypes.object.isRequired,
  integrationId: PropTypes.any,
  onBack: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  integrations: state.default.settings.integrations.integrations,
  integrationTypes: state.default.settings.integrations.integrationTypes,
  newIntegrationId: state.default.settings.integrations.newIntegrationId,
  loading: state.default.settings.integrations.loading,
  error: state.default.settings.integrations.error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addIntegration,
      updateIntegration
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(IntegrationAdd)
);
