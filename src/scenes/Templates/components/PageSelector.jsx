import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Icon } from 'semantic-ui-react';
import { Block } from '../../Home/Layout';
import { getPages } from 'services/pages/pagesActions';

class PageSelector extends React.Component {
  componentDidMount() {
    this.props.actions.getPages();
  }

  render() {
    const { open, closeModal, selectPage } = this.props;
    const pages = this.props.pages.filter(p => p.isConnected);

    return (
      <Modal size="tiny" open={open} closeIcon onClose={closeModal}>
        <Modal.Header>
          Select a page to purchase for
        </Modal.Header>
        <Modal.Content>
        {pages &&
        pages.length > 0 &&
        pages.map(p => (
            <Block
                onClick={() => selectPage(p.uid)}
                key={p.uid}
                className="side-listing"
            >
                <Block className="img-circle">
                    <img
                        src={`https://graph.facebook.com/${p.fbId}/picture?type=small`}
                        alt="user"
                    />
                </Block>
                <Block className="list-text">
                    <h3>{p.fbName}</h3>
                    <Block className="list-bottom">
                        <Block className="username">
                            <Icon name="users" />{' '}
                            {p.subscribers}
                            <span>
                                {' '}
                                +
                                {
                                    p.recentSubscribers
                                }
                            </span>
                        </Block>
                        <Block className="calander">
                            <Icon name="calendar alternate" />{' '}
                            {p.sequences}{' '}
                            {/* <span>+17</span> */}
                        </Block>
                    </Block>
                </Block>
            </Block>
        ))}
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  pages: state.default.pages.pages
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getPages
      // updateEngageInfo,
      // updateItemInfo,
      // addStepInfo,
      // updateStepInfo,
      // addEngage,
      // getTags,
      // getPageWorkflowTriggers
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(PageSelector);