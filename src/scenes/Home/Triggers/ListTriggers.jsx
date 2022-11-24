import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {
  Dropdown,
  Statistic,
  Icon,
  // Label,
  Table,
  // Button,
  Popup,
  Menu
} from 'semantic-ui-react';
import Swal from 'sweetalert2';

import { Block, Pagination } from '../Layout';
import { Area } from '../components/Charts';
import {
  getPageCampaigns,
  deleteCampaign
} from 'services/campaigns/campaignsActions';
import { getSubscribersHistory } from 'services/subscribers/subscribersActions';
import { triggerTypes } from 'constants/AppConstants';
import { numberWithCommas } from 'services/utils';
import { getPageFromUrl } from 'services/pages/selector';
import { getButtonHtml, getChatWidgetHtml } from './services/CreateHtml';
import { getCampaignAdd } from './services/selector';
import { getPageWorkflowJson } from 'services/workflows/workflowsApi';
import {
  HtmlModal
} from './components';

const daysOptions = [
  { key: 7, value: 7, text: '7 Days' },
  { key: 14, value: 14, text: '14 Days' },
  { key: 30, value: 30, text: '30 Days' }
];
class ListTriggers extends React.Component {
  //#region life cycle
  state = {
    pageTriggers: [],
    days: 7,
    isOpenHtmlPopUp: false,
    triggerHtml: null,
    htmlType: 'html',
    openMenuUid: null
  };

  componentDidMount = () => {
    this.props.actions.getPageCampaigns(this.props.match.params.id);
    this.handleChartDays(7);
  };
  //#endregion

  //#region functionality
  handleChartDays = days => {
    this.setState({ days });
    this.props.actions.getSubscribersHistory(
      this.props.match.params.id,
      days
    );
  };

  handleCopyCode = trigger => {
    this.setState({ openMenuUid: null });
    const pageInfo = this.props.pageInfo;
    const pageId = this.props.match.params.id;
    if (trigger.type === 'buttons') {
      console.log('campaignAdd:', this.props.campaignAdd);
      const options = {
        refParameter: `campaign::${this.props.campaignAdd
          .publicId || ''}`,
        fbId: this.props.pageInfo ? this.props.pageInfo.fbId : null,
        ...trigger.options
      }
      const triggerHtml = getButtonHtml(options);
      this.setState({
        triggerHtml,
        isOpenHtmlPopUp: true,
        htmlType: 'html'
      })
    } else if (trigger.type === 'chat_widget') {
      console.log('campaignAdd:', this.props.campaignAdd);
      const options = {
        refParameter: `campaign::${this.props.campaignAdd
          .publicId || ''}`,
        fbId: this.props.pageInfo ? this.props.pageInfo.fbId : null,
        ...trigger.options
      }
      const triggerHtml = getChatWidgetHtml(options);
      this.setState({
        triggerHtml,
        isOpenHtmlPopUp: true,
        htmlType: 'html'
      })
    } else if (trigger.type === 'm_dot_me') {
      const refLink = `https://m.me/${pageInfo.fbId}?ref=${trigger.options.customRef || trigger.options.publicId}`;
      this.setState({
        triggerHtml: refLink,
        isOpenHtmlPopUp: true,
        htmlType: 'html'
      });
    } else if (trigger.type === 'json') {
      try {
        Swal({
          title: 'Please wait...',
          text: 'We are loading JSON...',
          onOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });
        getPageWorkflowJson(pageId, trigger.uid).then(res => {
          Swal.close();
          const data = res.data;
          this.setState({
            triggerHtml: JSON.stringify(data['json_step'], null, 2),
            isOpenHtmlPopUp: true,
            htmlType: 'json'
          });

        });
      } catch (error) {
        Swal.close();
        if (error) {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Please try again.'
          });
        }
        // console.log('error', error);
      }
    }
  }

  handleOpenMenu = triggerUid => {
    this.setState({
      openMenuUid: triggerUid
    })
  }

  handleCloseMenu = () => {
    this.setState({
      openMenuUid: null
    })
  }
  //#endregion

  //#region delete trigger
  handleDeleteTrigger = triggerId => {
    this.setState({ openMenuUid: null }, () => {
      Swal({
        title: 'Are you sure?',
        text: 'Please verify that you want to delete this trigger',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete this trigger',
        cancelButtonText: 'No, I want to keep it',
        confirmButtonColor: '#f02727'
      }).then(result => {
        if (result.value) {
          this.props.actions.deleteCampaign(
            this.props.match.params.id,
            triggerId
          );
        }
      });
    });
  };
  //#endregion

  //#region render
  renderTriggers = triggers => {
    const { openMenuUid } = this.state;
    if (triggers && triggers.length > 0) {
      return triggers.map((t, i) => (
        <Table.Row key={i}>
          <Table.Cell className="actionTD">
            <Popup
              className="table-popup-menu-outer"
              content={
                <Menu vertical className="table-popup-menu">
                  <Menu.Item
                    // text="Edit"
                    // icon="pencil"
                    as={Link}
                    to={`/page/${this.props.match.params.id}/triggers/${t.uid}/edit`}
                  >
                    <Icon name="pencil" />
                                        Edit
                                    </Menu.Item>
                  {t.type === 'm_dot_me' &&
                    <Menu.Item
                      // icon="copy"
                      // text="Copy Link URL"
                      onClick={() => this.handleCopyCode(t)}
                    >
                      <Icon name="copy" />
                                            Copy Link URL
                                        </Menu.Item>
                  }
                  {t.type === 'buttons' &&
                    <Menu.Item
                      // icon="copy"
                      // text="Copy Button HTML"
                      onClick={() => this.handleCopyCode(t)}
                    >
                      <Icon name="copy" />
                                            Copy Button HTML
                                        </Menu.Item>
                  }
                  {t.type === 'chat_widget' &&
                    <Menu.Item
                      // icon="copy"
                      // text="Copy JSON"
                      onClick={() => this.handleCopyCode(t)}
                    >
                      <Icon name="copy" />
                                            Copy Chat Widget HTML
                                        </Menu.Item>
                  }
                  {t.type === 'json' &&
                    <Menu.Item
                      // icon="copy"
                      // text="Copy JSON"
                      onClick={() => this.handleCopyCode(t)}
                    >
                      <Icon name="copy" />
                                            Copy JSON
                                        </Menu.Item>
                  }
                  <Menu.Item
                    // icon="trash"
                    // text="Delete"
                    as="button"
                    onClick={() =>
                      this.handleDeleteTrigger(t.uid)
                    }
                  >
                    <Icon name="trash" />
                                        Delete
                                    </Menu.Item>
                </Menu>
              }
              // key={}
              // header={}
              position="bottom left"
              on='click'
              open={openMenuUid === t.uid}
              onOpen={() => this.handleOpenMenu(t.uid)}
              onClose={this.handleCloseMenu}
              trigger={<Icon name="ellipsis horizontal" />}
            />
          </Table.Cell>
          <Table.Cell className="links">{t.triggerName}</Table.Cell>
          <Table.Cell>{t.messagesDelivered}</Table.Cell>
          <Table.Cell>{t.messagesRead}</Table.Cell>
          <Table.Cell>{t.messagesClicked}</Table.Cell>
          <Table.Cell>{t.conversions}</Table.Cell>
          <Table.Cell>{t.type ? triggerTypes[t.type].text : ''}</Table.Cell>
        </Table.Row>
      ));
    }
    return null;
  };
  //#endregion

  render() {
    const {
      triggers,
      loading,
      subscribersHistory,
      daysLoading
    } = this.props;
    const { pageTriggers, days, isOpenHtmlPopUp, triggerHtml, htmlType } = this.state;
    // console.log('iinthe function')
    if (loading && (!triggers || (triggers && triggers.length === 0))) {
      Swal({
        title: 'Please wait...',
        text: 'We are fetching trigger...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else {
      Swal.close();
    }

    const chatData = {};
    let totalSubs = 0;
    if (subscribersHistory && subscribersHistory.length > 0) {
      // console.log('subscribersHistory', subscribersHistory)
      totalSubs = subscribersHistory[subscribersHistory.length - 1].total;
      subscribersHistory.map(s => {
        chatData[s.date] = s.total;
        return true;
      });
    }

    return (
      <Block className="main-container trigger-container mt-0">
        <HtmlModal
          html={triggerHtml}
          open={isOpenHtmlPopUp}
          close={() => {
            this.setState({ isOpenHtmlPopUp: false, triggerHtml: null });
          }}
          htmlType={htmlType}
        />
        <Block className="inner-box-main">
          <h2 className="title-head float-left mt-3 mb-4 p-0">
            Triggers
                    </h2>
          <Block className="dropDormListtTop">
            <Dropdown
              loading={daysLoading}
              value={days}
              options={daysOptions}
              onChange={(e, { value }) =>
                this.handleChartDays(value)
              }
            // selection
            />
          </Block>
          <Block className="listt-new-outer">
            <Block className="listt-add-btn">
              <Link
                to={`/page/${this.props.match.params.id}/triggers/add`}
              >
                <Block className="listt-add-btn-in">
                  <span>
                    <i
                      aria-hidden="true"
                      className="add icon"
                    ></i>
                  </span>
                  <p>Add New</p>
                </Block>
              </Link>
            </Block>
            <Block className="graphTopCol p-0">
              <Block className="graphInnerContainer">
                <Block className="graphBlock">
                  <Block className="labels">
                    {/* <p className="date">
                                            Last Edited 04/03/2018
                                        </p>
                                        <Label>M.Me Links</Label>
                                        <Link
                                            to={`/page/${this.props.match.params.id}/triggers/add`}
                                        >
                                            <Button className="ui button primary border-btn">
                                                <i
                                                    aria-hidden="true"
                                                    className="add icon"
                                                ></i>
                                                Add New
                                            </Button>
                                        </Link> */}
                  </Block>
                  <Statistic.Group
                    inverted
                    className="circle-trigger-outer"
                  >
                    {/* <Icon name="circle outline" /> */}
                    <Statistic>
                      <Statistic.Value>
                        {numberWithCommas(totalSubs)}
                      </Statistic.Value>
                      <Statistic.Label>
                        Total Subscribers
                                            </Statistic.Label>
                      {/*<Statistic.Label>
                                                211 <span>Today</span>
                                            </Statistic.Label>*/}
                    </Statistic>
                  </Statistic.Group>
                </Block>
                <Block className="graph-container">
                  {chatData && <Area data={chatData} />}
                </Block>
              </Block>
            </Block>
          </Block>
          <Block className="custom-table trigger-tbl">
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    width={1}
                    className="actionThead"
                  >
                    Actions
                                    </Table.HeaderCell>
                  <Table.HeaderCell className="links">
                    Trigger Name
                                    </Table.HeaderCell>
                  <Table.HeaderCell>
                    Delivered
                                    </Table.HeaderCell>
                  <Table.HeaderCell>Read</Table.HeaderCell>
                  <Table.HeaderCell>Clicked</Table.HeaderCell>
                  <Table.HeaderCell>
                    Conversions
                                    </Table.HeaderCell>
                  <Table.HeaderCell>
                    Widget Type
                                    </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.renderTriggers(pageTriggers)}
              </Table.Body>
            </Table>
          </Block>

          <Block className="paginationCol">
            {triggers && triggers.length > 0 && (
              <Pagination
                pageLimit={10}
                onPageChange={pageTriggers =>
                  this.setState({ pageTriggers })
                }
                data={triggers}
              />
            )}
          </Block>
        </Block>
      </Block>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    pageId: ownProps.match.params.id,
    triggers: state.default.campaigns.campaigns,
    loading: state.default.campaigns.loading,
    daysLoading: state.default.subscribers.loading,
    subscribersHistory: state.default.subscribers.subscribersHistory,
    pageInfo: getPageFromUrl(state, ownProps),
    campaignAdd: getCampaignAdd(state)
  };
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getPageCampaigns,
      getSubscribersHistory,
      deleteCampaign
    },
    dispatch
  )
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListTriggers)
);