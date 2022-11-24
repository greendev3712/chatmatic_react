import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader } from 'components';
/** Import components */
import {
  Navbar,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';

import { logout } from 'services/auth/authActions';

/** Import assets */
import logo from 'assets/images/logo.png';
import { profileImg as defaultImage } from 'assets/images/subscriber.png';
import './topNav.css';

class TopNav extends React.Component {
  state = {
    showApiKeyModal: false
  };

  toggleShowApiKeyModal = () => {
    this.setState({ showApiKeyModal: !this.state.showApiKeyModal });
  };

  render() {
    const { showApiKeyModal } = this.state;

    if (!this.props.currentUser) {
      return <Redirect to="/login" />;
    }

    const profileImg =
      this.props.currentUser.facebookProfileImage || defaultImage;
    const currentUserId = this.props.currentUser.userId;

    return (
      <div className="top-nav">
        <Navbar light expand className="shadow-sm bg-white p-0 h-100">
          <NavbarBrand tag={Link} to="/dashboard">
            <img src={logo} alt="ChatMatic" className="top-nav-logo" />
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <li className="nav-item mr-2">
              <a
                href="http://members.chatmatic.com/support"
                className="nav-link p-2"
                target="_blank"
              >
                Support
              </a>
            </li>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                <img
                  src={profileImg}
                  alt=""
                  width={35}
                  height={35}
                  style={{ objectFit: 'cover' }}
                />
              </DropdownToggle>

              <DropdownMenu right>
                <DropdownItem>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to={"/profile/" + currentUserId}>Profile</Link>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    this.setState({ showApiKeyModal: true });
                  }}
                >
                  API Key
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={this.props.actions.logout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Navbar>
        <Modal isOpen={showApiKeyModal} toggle={this.toggleShowApiKeyModal}>
          <ModalHeader toggle={this.toggleShowApiKeyModal}>API Key</ModalHeader>
          <ModalBody>
            <div>Your API Key:</div>
            <div className="mb-3">{this.props.extApiToken}</div>
            <div>
              <a
                className="text-underline"
                href="https://kartrausers.s3.amazonaws.com/travisstephenson/5591355_1567705491851chatmatic_guide_to_using_zapier...pdf"
                target="_blank"
              >
                Our Zapier Walkthrough Documentation
              </a>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

TopNav.propTypes = {
  currentUser: PropTypes.any,
  actions: PropTypes.object.isRequired,
  extApiToken: PropTypes.string
};

const mapStateToProps = state => ({
  currentUser: state.default.auth.currentUser,
  extApiToken: state.default.pages.extApiToken,
  userId: state.default.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      logout
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopNav)
);
