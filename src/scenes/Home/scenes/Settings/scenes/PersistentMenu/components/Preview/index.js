import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { getPersistentMenuState } from '../../services/selector';
import { getPageFromUrl } from 'services/pages/selector';

import chatmaticGrayIcon from 'assets/images/settings/icon-gray-chatmatic.png';
import previewProfile from 'assets/images/settings/persistent-profile.png';
import verticalScrollbar from 'assets/images/settings/vertical-scrollbar.png';
import './styles.css';

class Preview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuIdSelected: null
    };
  }

  render() {
    const _renderPreviewMenus = () => {
      let menus = this.props.persistentMenus.menus;

      if (this.state.menuIdSelected) {
        const selectedMenu =
          this.props.persistentMenus.menus.find(
            menu => menu.uid === this.state.menuIdSelected
          ) || {};

        menus = selectedMenu.value || [];
      }

      return menus.map((menu, index) => (
        <div
          key={index}
          className={classnames('menu-list-item', {
            submenu: menu.type === 'submenu'
          })}
          onClick={() =>
            menu.type === 'submenu' &&
            this.setState({ menuIdSelected: menu.uid })
          }
        >
          {menu.name}
          {menu.type === 'submenu' && (
            <div className="position-absolute arrow-right">
              <i className="fa fa-angle-right mx-2" />
            </div>
          )}
        </div>
      ));
    };

    const _renderPreviewHeader = () => {
      if (!this.state.menuIdSelected || !this.props.pageInfo.menusActive) {
        return (
          <div className="position-relative menu-list-header">
            <span>Send a message...</span>
          </div>
        );
      } else {
        const selectedMenu =
          this.props.persistentMenus.menus.find(
            menu => menu.uid === this.state.menuIdSelected
          ) || {};
        return (
          <div
            className="position-relative menu-list-header submenu"
            onClick={() => this.setState({ menuIdSelected: null })}
          >
            <span>{selectedMenu.name || ''}</span>
            <div className="position-absolute arrow-left">
              <i className="fa fa-angle-left" />
            </div>
          </div>
        );
      }
    };

    return (
      <div className="d-flex justify-content-center menu-preview-container">
        <div className="d-flex flex-column justify-content-between">
          <div>
            <div className="position-relative d-flex justify-content-center align-items-center preview-header">
              <span>Preview</span>
              <img
                src={chatmaticGrayIcon}
                alt=""
                className="position-absolute img-logo"
                width={27}
                height={30}
              />
            </div>
            <img src={previewProfile} alt="" width={375} height={128} />
          </div>
          <div className="d-flex flex-column menu-list-container">
            <img src={verticalScrollbar} alt="" />
            {_renderPreviewHeader()}
            {this.props.pageInfo.menusActive && _renderPreviewMenus()}
          </div>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  persistentMenus: PropTypes.shape({
    menus: PropTypes.array.isRequired
  }).isRequired,
  pageInfo: PropTypes.object
};

const mapStateToProps = (state, props) => ({
  ...getPersistentMenuState(state),
  pageInfo: getPageFromUrl(state, props)
});

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Preview)
);
