import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import LazyLoad from 'react-lazy-load';

import { Block } from '../../../../Layout';
import { Grid, Button, Image } from 'semantic-ui-react';
import { getPage } from 'services/pages/pagesActions';

import subscriberImg from 'assets/images/subscriber.png';

class NewDetails extends Component {
  componentDidMount = () => {
    this.props.actions.getPage(this.props.match.params.id);
  }

  _handleLiveChat = subscriberId => () => {
    // console.log('subscriberId', subscriberId);
    this.props.history.push(`/page/${this.props.match.params.id}/subscribers?subscriberUid=${subscriberId}&openChat=1`)
  }

  render() {
    const { subscribers, workflows, automations } = this.props;
    return (
      <Block className="home-main-outer">
        <Grid divided='vertically' className="m-0">

          <Grid.Row columns={3} className="m-0">
            <Grid.Column className="pl-0">
              <Block className="custom-table homePtable">
                <h2 className="title-head mb-4"> Recent subscribers </h2>
                <table>
                  <thead>
                    <tr>
                      <th colSpan="2"> Subscribers Name </th>
                      <th> Action </th>
                    </tr>
                  </thead>
                </table>
                <Block className="home-tbl-scroll home-tbl-scroll3">
                  <table>
                    <tbody>
                      {subscribers && subscribers.map((s, i) => (
                        <tr key={i} >
                          <td>
                            <Block className="d-inline-align">
                              <LazyLoad height={35} width={51} offset={700}>
                                <Image
                                  src={s.profilePicUrl || subscriberImg}
                                  alt=""
                                  className="mr-3 subscriber-photo"
                                  circular
                                />
                              </LazyLoad>
                            </Block>
                            <Block className="d-inline-align">
                              {s.firstName} {s.lastName}
                            </Block>
                          </td>
                          <td className="text-center"> <Button primary onClick={this._handleLiveChat(s.uid)}>Live Chat</Button> </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Block>
              </Block>
            </Grid.Column>
            <Grid.Column>
              <Block className="custom-table homePtable homePcpadd">
                <h2 className="title-head mb-4"> Recent workflows </h2>
                <table>
                  <thead>
                    <tr>
                      <th> Workflow Name </th>
                      <th className="text-center"> Total Subscribers </th>
                    </tr>
                  </thead>
                </table>
                <Block className="home-tbl-scroll">
                  <table>
                    <tbody>
                      {workflows && workflows.map((w, index) => (
                        <tr key={index}>
                          <td> {w.name} </td>
                          <td className="text-center"> {w.totalSubscribers} </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Block>
              </Block>
            </Grid.Column>
            <Grid.Column className="pr-0">
              <Block className="custom-table homePtable homePcpadd">
                <h2 className="title-head mb-4">Recent Automations</h2>
                <table>
                  <thead>
                    <tr>
                      <th> Automation Name </th>
                      <th className="text-center"> Total Subscribers </th>
                    </tr>
                  </thead>
                </table>
                <Block className="home-tbl-scroll">
                  <table>
                    <tbody>
                    {automations && automations.map((a, index) => (
                      <tr key={index}>
                        <td> {a.name} </td>
                        <td className="text-center"> {a.totalFired} </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </Block>
              </Block>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Block>
    )
  }
}

const mapStateToProps = state => ({
  subscribers: state.default.pages.subscribers,
  workflows: state.default.pages.workflows,
  automations: state.default.pages.automations
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getPage
    },
    dispatch
  )
});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewDetails)
);