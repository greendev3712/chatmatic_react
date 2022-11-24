import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import {
  deleteCustomField,
  getCustomFields,
  getCustomFieldSubscribers
} from 'services/customfields/actions';
import { deleteTag, getTags, getTagSubscribers } from 'services/tags/actions';
import { getCustomFieldsState } from 'services/customfields/selector';
import { getTagsState } from 'services/tags/selector';
import { Button } from 'components';
import { orderBy } from 'lodash';
import './styles.css';
import NewTagModal from './components/NewTagModal';
import NewCustomFieldModal from './components/NewCustomFieldModal';
import SubscribersModal from './components/SubscribersModal'

class CustomFieldTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddNewTagOpen: false,
      isAddNewCustomFieldOpen: false,
      newAddErrorMessage: '',
      selectedCustomField: null,
      userInputFormat: 'text',
      subscibersType: null,
      showSubscibersModal: false,
      subscribers: []
    };
  }

  componentWillMount() {
    const { actions, match, pageTags } = this.props;

    actions.getTags(match.params.id);
    actions.getCustomFields(match.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { subscibersType } = this.state;
    const { loadingTags, errorTags, addingCustomField, addingCustomFieldError, tagsSubscribers, fieldsSubscribers } = nextProps;

    if (subscibersType) {
      if (loadingTags || addingCustomField) {
        Swal({
          title: 'Please wait...',
          text: 'We are loading subscribers data...',
          onOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });
      } else {
        Swal.close();
        if (subscibersType === 'CUSTOM_FIELDS' && addingCustomFieldError) {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: addingCustomFieldError || 'Something went wrong! Please try again.'
          });
        } else if (subscibersType === 'TAGS' && errorTags) {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: errorTags || 'Something went wrong! Please try again.'
          });
        } else {
          this.setState({
            subscribers: subscibersType === 'CUSTOM_FIELDS' ? fieldsSubscribers : tagsSubscribers,
            showSubscibersModal: true
          })
        }
      }
      return true;
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
      this.setState({ isAddNewTagOpen: false });
      if (nextProps.addingTagError) {
        Swal(nextProps.addingTagError);
      }
    }
    if (nextProps.addingCustomField) {
      Swal({
        title: 'Please wait...',
        text: 'We are adding the new custom field...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.addingCustomField) {
      Swal.close();
      this.setState({ isAddNewCustomFieldOpen: false });
      if (nextProps.addingCustomFieldError) {
        Swal(nextProps.addingCustomFieldError);
      }
    }
  }

  _deleteCustomField = uid => {
    const { actions } = this.props;

    Swal({
      title:
        'Are you sure you want to delete this User Attribute field? This will remove it from all subscribers',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, please.',
      cancelButtonText: 'No, Don’t Do This',
      confirmButtonColor: '#f02727',
      cancelButtonColor: '#274BF0'
    }).then(result => {
      if (result.value) {
        actions.deleteCustomField(this.props.match.params.id, uid);
      }
    });
  };

  _deleteTag = uid => {
    const { actions } = this.props;

    Swal({
      title: 'Are you sure you want to delete this tag?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, please.',
      cancelButtonText: 'No, Don’t Do This',
      confirmButtonColor: '#f02727',
      cancelButtonColor: '#274BF0'
    }).then(result => {
      if (result.value) {
        actions.deleteTag(this.props.match.params.id, uid);
      }
    });
  };

  _toggleIsAddNewCustomFieldOpen = () => {
    this.setState({
      isAddNewCustomFieldOpen: !this.state.isAddNewCustomFieldOpen,
      newAddErrorMessage: '',
      selectedCustomField: this.state.isAddNewCustomFieldOpen
        ? null
        : this.state.selectedCustomField
    });
  };

  _toggleIsAddNewTagOpen = () => {
    this.setState({
      isAddNewTagOpen: !this.state.isAddNewTagOpen,
      newAddErrorMessage: ''
    });
  };

  _handleSubscribers = (type, uId) => {
    const pageId = this.props.match.params.id;
    if (type === 'CUSTOM_FIELDS') {
      this.setState({
        subscibersType: type
      }, () => this.props.actions.getCustomFieldSubscribers(pageId, uId))
    } else {
      this.setState({
        subscibersType: type
      }, () => this.props.actions.getTagSubscribers(pageId, uId))
    }

  }

  handleCloseSubscribersModal = () => {
    this.setState({
      subscribers: [],
      showSubscibersModal: false,
      subscibersType: null        
    })
  }

  render() {
    const { customFields, match, pageTags } = this.props;
    const {
      isAddNewCustomFieldOpen,
      isAddNewTagOpen,
      selectedCustomField,
      showSubscibersModal,
      subscribers
    } = this.state;

    return (
      <div className="d-flex align-items-start templates-page-container customfieldtags-page-container">
        {showSubscibersModal &&
          <SubscribersModal
            open={showSubscibersModal}
            subscribers={subscribers}
            close={this.handleCloseSubscribersModal}
          />
        }
        <div className="d-flex align-items-start template-container">
          <div className="d-flex flex-column justify-content-start template-list-container mr-3">
            <div className="align-middle">
              <h4 className="d-inline mr-3">Custom Fields</h4>
              <Button
                className="mb-2 ui button primary border-btn btn-sm"
                color="primary"
                onClick={this._toggleIsAddNewCustomFieldOpen}
              >
                Add New +
              </Button>
              {isAddNewCustomFieldOpen && (
                <NewCustomFieldModal
                  customField={selectedCustomField}
                  isOpen={isAddNewCustomFieldOpen}
                  pageId={match.params.id}
                  toggle={this._toggleIsAddNewCustomFieldOpen}
                />
              )}
            </div>
            <div className="table table-striped">
              <div className="row template-header">
                <div className="col">NAME</div>
                <div className="col delete">TYPE</div>
                <div className="col delete text-center">EDIT / DELETE</div>
              </div>
              <div className="template-list">
                {orderBy(
                  customFields,
                  [field => field.fieldName.toLowerCase()],
                  'asc'
                ).map((field, index) => (
                  <div className="row template-row" key={index}>
                    <div className="col ">{field.fieldName}</div>
                    <div className="col delete">{field.validationType}</div>
                    <div className="col delete">
                      <div className="d-flex justify-content-center align-items-center">
                        <button
                          className="btn btn-link p-0 mr-3"
                          onClick={() => {
                            this.setState(
                              { selectedCustomField: field },
                              () => {
                                this._toggleIsAddNewCustomFieldOpen(field.uid);
                              }
                            );
                          }}
                        >
                          <i className="fa fa-pencil" />
                        </button>
                        <button
                          className="btn btn-link p-0"
                          onClick={() => this._deleteCustomField(field.uid)}
                        >
                          <i className="fa fa-trash" />
                        </button>
                        <button
                          className="btn btn-link p-0"
                          onClick={() => this._handleSubscribers('CUSTOM_FIELDS', field.uid)}
                        >
                          <i className="fa fa-eye" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-start template-list-container">
            <div className="align-middle">
              <h4 className="d-inline mr-3">Tags</h4>
              <Button
                className="mb-2 ui button primary border-btn btn-sm"
                color="primary"
                onClick={this._toggleIsAddNewTagOpen}
              >
                Add New +
              </Button>

              {isAddNewTagOpen && (
                <NewTagModal
                  isOpen={isAddNewTagOpen}
                  pageId={match.params.id}
                  toggle={this._toggleIsAddNewTagOpen}
                />
              )}
            </div>
            <div className="table table-striped">
              <div className="row template-header">
                <div className="col">NAME</div>
                <div className="col delete text-center">DELETE</div>
              </div>
              <div className="template-list">
                {orderBy(pageTags, [tag => tag.value.toLowerCase()], 'asc').map(
                  (tag, index) => (
                    <div className="row template-row" key={index}>
                      <div className="col ">{tag.value}</div>
                      <div className="col delete">
                        <div className="d-flex justify-content-center align-items-center">
                          <button
                            className="btn btn-link p-0"
                            onClick={() => this._deleteTag(tag.uid)}
                          >
                            <i className="fa fa-trash" />
                          </button>
                          <button
                            className="btn btn-link p-0"
                            onClick={() => this._handleSubscribers('TAGS', tag.uid)}
                          >
                            <i className="fa fa-eye" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CustomFieldTags.propTypes = {
  addingCustomField: PropTypes.bool.isRequired,
  addingCustomFieldError: PropTypes.any,
  customFields: PropTypes.array.isRequired,
  pageTags: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  addingCustomField: getCustomFieldsState(state).loading,
  addingCustomFieldError: getCustomFieldsState(state).error,
  addingTag: getTagsState(state).loading,
  addingTagError: getTagsState(state).error,
  customFields: getCustomFieldsState(state).customFields,
  pageTags: getTagsState(state).tags,
  loadingTags: getTagsState(state).loading,
  errorTags: getTagsState(state).error,
  fieldsSubscribers: getCustomFieldsState(state).subscribers,
  tagsSubscribers: getTagsState(state).subscribers
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      deleteCustomField,
      deleteTag,
      getCustomFields,
      getTags,
      getCustomFieldSubscribers,
      getTagSubscribers
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomFieldTags);
