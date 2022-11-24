import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';
import IntegrationAdd from './scenes/IntegrationAdd';

import { deleteIntegration } from './services/actions';
import { getIntegrations, getIntegrationTypes } from './services/actions';

import './styles.css';
import webhookIcon from 'assets/images/icon-webhook.png';

class Integrations extends React.Component {
  state = {
    showIntegrationAdd: false,
    activeIntegrationId: null
  };

  componentDidMount() {
    this.props.actions.getIntegrations(this.props.match.params.id);
    this.props.actions.getIntegrationTypes(this.props.match.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.loading) {
      Swal({
        title: 'Please wait...',
        text: 'Loading Integrations...',
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
      }
    }
  }

  _deleteIntegration = integrationId => {
    Swal({
      title: 'Are you sure you wanna do that?',
      text:
        'That will remove this integration and all the cool stuff it can do',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove this integration',
      cancelButtonText: 'No, I want to keep it',
      confirmButtonColor: '#f02727'
    }).then(result => {
      if (result.value) {
        this.props.actions.deleteIntegration(
          this.props.match.params.id,
          integrationId
        );
      }
    });
  };

  render() {
    if (this.state.showIntegrationAdd) {
      return (
        <IntegrationAdd
          integrationId={this.state.activeIntegrationId}
          onBack={() =>
            this.setState({
              activeIntegrationId: null,
              showIntegrationAdd: false
            })
          }
        />
      );
    }

    return (
      <div
        className="d-flex flex-column integrations-container"
        data-aos="fade"
      >
        <div className="d-flex justify-content-between align-items-center mb-3 w-100">
          <h4 className="m-0">Integrations</h4>
          <button
            className="btn btn-sm btn-primary rounded"
            onClick={() =>
              this.setState({
                showIntegrationAdd: true,
                activeIntegrationId: null
              })
            }
          >
            Add New +
          </button>
        </div>

        <div className="d-flex flex-column integrations-list">
          {this.props.integrations.map((item, index) => {
            const integrationType = this.props.integrationTypes.find(
              integrationType => integrationType.uid === item.integrationTypeUid
            );

            if (!integrationType) return <div key={index} />;

            return (
              <div
                key={index}
                className="row align-items-center integration-item-container"
              >
                <div className="col-8 d-flex">
                  <img src={webhookIcon} alt="" width={35} height={35} />
                  <div className="d-flex flex-column justify-content-center ml-3">
                    <h4 className="m-0">{item.name}</h4>
                    <small>{item.parameters.webhookUrl}</small>
                  </div>
                </div>
                <div className="col-2 d-flex flex-column justify-content-center">
                  <h4 className="m-0">{item.triggered}</h4>
                  <small>SUBSCRIBERS</small>
                </div>
                <div className="col-2 d-flex align-items-center justify-content-end">
                  {/*<div className="d-flex flex-column mr-5">*/}
                  {/*<small style={{ fontSize: 8, paddingLeft: 12 }}>*/}
                  {/*TOTAL SALES*/}
                  {/*</small>*/}
                  {/*<h4 className="d-flex m-0">*/}
                  {/*<span style={{ fontSize: 20, color: '#32325d' }}>$</span>*/}
                  {/*487.89*/}
                  {/*</h4>*/}
                  {/*<div className="d-flex">*/}
                  {/*<i*/}
                  {/*className="fa fa-arrow-up"*/}
                  {/*style={{ fontSize: 13, color: '#27d9f0' }}*/}
                  {/*/>*/}
                  {/*<span*/}
                  {/*style={{*/}
                  {/*fontSize: 10,*/}
                  {/*color: '#32325d',*/}
                  {/*padding: '0 5px'*/}
                  {/*}}*/}
                  {/*>*/}
                  {/*$127.25*/}
                  {/*</span>*/}
                  {/*<span style={{ fontSize: 10, color: '#B1B9CC' }}>*/}
                  {/*SALES TODAY*/}
                  {/*</span>*/}
                  {/*</div>*/}
                  {/*</div>*/}
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav>
                      <i className="fa fa-ellipsis-h mr-3" />
                    </DropdownToggle>

                    <DropdownMenu right style={{ minWidth: 40 }}>
                      <DropdownItem
                        onClick={() =>
                          this.setState({
                            showIntegrationAdd: true,
                            activeIntegrationId: item.uid
                          })
                        }
                      >
                        Edit
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <button
                    className="btn btn-link p-0 btn-remove"
                    onClick={() => this._deleteIntegration(item.uid)}
                  >
                    <i className="fa fa-close" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Integrations.propTypes = {
  integrations: PropTypes.array.isRequired,
  integrationTypes: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  integrations: state.default.settings.integrations.integrations,
  integrationTypes: state.default.settings.integrations.integrationTypes,
  loading: state.default.settings.integrations.loading,
  error: state.default.settings.integrations.error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      deleteIntegration,
      getIntegrations,
      getIntegrationTypes
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Integrations)
);
