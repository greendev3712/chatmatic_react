import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Header, Image, Table } from 'semantic-ui-react';
import 'hayer-react-image-crop/style.css';

// import { pageFileUpload, updateEngage } from '../../scenes/EngageAdd/services/actions';
import { getAllPages, toggleConnect, connectAll } from 'services/pages/pagesActions';
// import { Block } from '../../Layout';
import Swal from 'sweetalert2';
import { Block } from '../../Layout';

class AddNewPageModal extends Component {
  //#region lifecycle
  state = {
    connectStatus: null,
    isAllConnecting: false
  }

  componentDidMount = () => {
    this.setState({ loadPages: true }, () => {
      this.props.actions.getAllPages();
    });
  }

  UNSAFE_componentWillReceiveProps = ({ loading, error, close }) => {
    const { connectStatus, isAllConnecting } = this.state;
    if (error) {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: error || 'Something went wrong! Please try again.'
      });
    }

    if (loading && connectStatus === 'connecting') {
      // this.setState({ connectStatus: 'done' });
      Swal({
        title: 'Please wait...',
        text: `we are connecting${isAllConnecting ? ' all pages' : ''}...`,
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (!loading && connectStatus === 'connecting') {
      this.setState({ connectStatus: null, isAllConnecting: false });
      Swal.close();
      Swal.fire({
        type: 'success',
        title: 'Success!',
        text: `${isAllConnecting ? 'All pages are' : 'Page is'} successfully connected.`,
        showConfirmButton: true
      });
      if (isAllConnecting) {
        close();
      }
      // this.props.actions.getAllPages();
    }

    if (loading && connectStatus === null) {
      Swal({
        title: 'Please wait...',
        text: 'we are loading...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (!loading && connectStatus === null) {
      Swal.close()
      this.setState({ loadPages: false });
    }
  }
  //#endregion

  close = () => this.props.close();

  onToggleConnect = pageId => {
    this.setState({ connectStatus: 'connecting' }, () => {
      this.props.actions.toggleConnect(pageId);
    });
  }

  handleConnectAll = () => {
    this.setState({ connectStatus: 'connecting', isAllConnecting: true }, () => {
      this.props.actions.connectAll();
    });
  }

  render() {
    const { open, allPages } = this.props;
    const { loadPages } = this.state;

    const pages = allPages.filter(p => !p.isConnected)
    return (
      <Modal
        // size="fullscreen"
        className="custom-popup imgCropPopUp addPnewPop"
        open={open}
        onClose={() => false}
      >
        <Modal.Header>
          Add New Page
          <i
            aria-hidden="true"
            className="close small icon close-icon"
            onClick={this.close}
          ></i>
        </Modal.Header>
        <Modal.Content>

          <p>
            Connecting all pages costs you nothing. You only need to license a page when it reaches 250 subscribers so our suggestion is to connect ALL of your pages so they start collecting data. One day you may find that one of your pages has 250 subscribers and you'd like to license it, at which time you'll see that option below and on the page dashboard
          </p>
          {pages && pages.length > 0 &&
            <Block>
              <Button className="add-pg-btn add-pg-all-btn" onClick={this.handleConnectAll}>Connect All</Button>
            </Block>
          }

          {!loadPages && (!pages || (pages && pages.length === 0)) && <h4 className="text-center">No page found to connect</h4>}
          {pages && pages.length > 0 &&
            <Block className="add-pg-scroll"><Table className="add-pg-tb-outer">
              <Table.Body>
                {pages.map((p, ind) => (
                  <Table.Row key={ind}>
                    <Table.Cell>
                      <Header style={{ display: "block" }} as='h2'>
                        <Image
                          circular
                          size="small"
                          src={`https://graph.facebook.com/${p.fbId}/picture?type=large`}
                        />
                        {p.fbName}
                      </Header>
                    </Table.Cell>
                    <Table.Cell>
                      <Button onClick={() => this.onToggleConnect(p.uid)}> Connect </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
                }
              </Table.Body>
            </Table></Block>
          }
          {/*<Block className="add-pg-footer">
            <Button className="add-pg-btn" onClick={() => this.props.close()}>Close</Button>
        </Block>*/}
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = (state, props) => ({
  allPages: state.default.pages.allPages,
  error: state.default.pages.error,
  loading: state.default.pages.loading
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getAllPages,
      toggleConnect,
      connectAll
    },
    dispatch
  )
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddNewPageModal));
