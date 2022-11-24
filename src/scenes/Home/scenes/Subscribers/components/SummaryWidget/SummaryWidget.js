import React from 'react';
import { bindActionCreators } from 'redux';
import CreatableSelect from 'react-select/lib/Creatable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';

import { getTagsState } from 'services/tags/selector';
import { getActiveSubscriber } from 'services/subscribers/selector';
import { updateSubscriberInfo } from 'services/subscribers/subscribersActions';
import { addTag } from 'services/tags/actions';

import Constants from 'config/Constants';
import calendarImg from 'assets/images/icon-calendar.png';
import mini_welcome_msg_icon from 'assets/images/mini_welcome_msg_icon.svg';

class SummaryWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: this.props.subscriber.tags || [],
      email: this.props.subscriber.email || '',
      phone: this.props.subscriber.phone || '',
      location: this.props.subscriber.location || '',
      debounceTimer: null
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      email: nextProps.subscriber.email || '',
      phone: nextProps.subscriber.phone || '',
      location: nextProps.subscriber.location || ''
    });

    if (this.props.subscriber.tags !== nextProps.subscriber.tags) {
      this.setState({ tags: nextProps.subscriber.tags });
    }

    if (nextProps.addingTag) {
      Swal({
        title: 'Please wait...',
        text: 'We are adding a new tag to the page...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.addingTag) {
      Swal.close();
      if (nextProps.addingTagError) {
        Swal(nextProps.addingTagError);
      } else {
        const newTags = this.state.tags.map(tag => {
          const pageTag = nextProps.pageTags.find(
            pageTag => pageTag.value === tag.value
          );
          return pageTag || tag;
        });
        this.setState({ tags: newTags });
        this.props.actions.updateSubscriberInfo(
          this.props.match.params.id,
          this.props.subscriber.uid,
          {
            tags: newTags
          }
        );
      }
    }
  }

  _changeCustomData = event => {
    this.props.actions.updateSubscriberInfo(
      this.props.match.params.id,
      this.props.subscriber.uid,
      {
        [event.target.name]: event.target.value
      }
    );
  };

  countDebounce = e => {
    e.persist();
    let { debounceTimer } = this.state;

    clearTimeout(debounceTimer);
    this.setState({ [e.target.name]: e.target.value });

    debounceTimer = setTimeout(() => {
      this._changeCustomData(e);
    }, 500);
    this.setState({ debounceTimer });
  };

  render() {
    if (this.props.loading) {
      return <div />;
    }

    const countOfLast30DaysCampaigns =
      (this.props.subscriber.campaigns &&
        this.props.subscriber.campaigns.filter(campaign => {
          return moment().diff(moment(campaign.createdAtUtc), 'days') <= 30;
        }).length) ||
      0;

    return (
      <div className="card w-100 summary-container">
        <div className="card-body scrollable d-flex flex-column justify-content-between p-0">
          <div style={{ paddingBottom: 20 }}>
            <div className="integration-container">
              <h4>Subscriber Custom Data</h4>
              <div className="d-flex flex-column mt-4">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">EMAIL</span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.countDebounce}
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">PHONE</span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.countDebounce}
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">LOCATION</span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={this.state.location}
                    onChange={this.countDebounce}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex flex-column message-info-container">
              <div className="d-flex justify-content-between message-info-header">
                <h4>Total Messages</h4>
                <div className="d-flex">
                  <div className="d-flex flex-column">
                    <label>LAST ENGAGEMENT</label>
                    <span>
                      {moment(this.props.subscriber.lastEngagementUtc).format(
                        'DD/MM/YYYY'
                      )}
                    </span>
                  </div>
                  <img src={calendarImg} alt="" />
                </div>
              </div>
              <div className="d-flex justify-content-between message-info">
                <div className="d-flex flex-column">
                  <span>{this.props.subscriber.messagesSent || 0}</span>
                  <label>MESSAGE SENT</label>
                </div>
                <div className="d-flex flex-column">
                  <span>{this.props.subscriber.messagesRead || 0}</span>
                  <label>MESSAGES READ</label>
                </div>
                <div className="d-flex flex-column">
                  <span>{this.props.subscriber.totalClicks || 0}</span>
                  <label>TOTAL CLICKS</label>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column tags-container">
              <div className="d-flex justify-content-between align-items-center tags-header">
                <h4>User Tags</h4>
              </div>
              <CreatableSelect
                isMulti
                onChange={tags => {
                  this.setState({ tags });

                  this.props.actions.updateSubscriberInfo(
                    this.props.match.params.id,
                    this.props.subscriber.uid,
                    { tags }
                  );
                }}
                options={this.props.pageTags}
                placeholder="Search for a existing tag or create a new one"
                isClearable={false}
                getOptionLabel={option =>
                  'uid' in option ? option.value : option.label
                }
                getOptionValue={option =>
                  (option.uid && option.uid.toString()) || option.value
                }
                onCreateOption={value => {
                  this.props.actions.addTag(this.props.match.params.id, value);
                  const newTags = this.state.tags.concat([
                    { uid: value, value }
                  ]);
                  this.setState({
                    tags: newTags
                  });
                }}
                value={this.state.tags}
                isValidNewOption={label => {
                  if (!label) return false;

                  let returnValue = true;

                  this.props.pageTags.forEach(option => {
                    if (label.toLowerCase() === option.value.toLowerCase())
                      returnValue = false;
                  });

                  return returnValue;
                }}
              />
            </div>
          </div>
          <div className="d-flex flex-column campaigns-container">
            <h4>Campaigns Subscribed</h4>
            <div className="d-flex justify-content-between align-items-center campaigns-info">
              <div className="d-flex flex-column campaigns-count">
                <span>{this.props.subscriber.campaigns.length}</span>
                <label>TOTAL SUBSCRIBED</label>
              </div>
              <div className="d-flex align-items-center recent-campaigns">
                <span className="d-flex justify-content-center align-items-center">
                  <i className="fa fa-arrow-up" />
                  {countOfLast30DaysCampaigns}
                </span>
                <label>LAST 30 DAYS</label>
              </div>
            </div>
            <div className="campaigns-wrapper">
              {this.props.subscriber.campaigns.map((campaign, index) => (
                <div
                  className="d-flex justify-content-between align-items-center campaign"
                  key={index}
                >
                  <span>{campaign.campaignName}</span>
                  <img
                    src={
                      Constants.workflowIcons[campaign.workflowType] ||
                      mini_welcome_msg_icon
                    }
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SummaryWidget.propTypes = {
  subscriber: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  pageTags: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  addingTag: PropTypes.bool.isRequired,
  addingTagError: PropTypes.any
};

const mapStateToProps = state => ({
  subscriber: getActiveSubscriber(state),
  pageTags: getTagsState(state).tags,
  loading: state.default.subscribers.loading,
  error: state.default.subscribers.error,
  addingTag: state.default.settings.tags.loading,
  addingTagError: state.default.settings.tags.error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      updateSubscriberInfo,
      addTag
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SummaryWidget)
);
