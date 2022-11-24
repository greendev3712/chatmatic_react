import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Image, List, Button, Popup, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { Grid } from 'semantic-ui-react';

import { Block, Svg, Pagination } from '../Layout';
import { sequenceGraph } from 'assets/img';
import { getActiveWorkflows } from 'services/workflows/selector';
import {
    getPageWorkflows as getPageWorkflowsAction,
    deletePageWorkflow
} from 'services/workflows/workflowsActions';
import {
    updateEngageInfo,
    deleteEngageInfo
} from '../scenes/EngageAdd/services/actions';
import { createTemplate } from '../scenes/Settings/scenes/Templates/services/actions';
import { CreateTemplateModal, ImageCropModal } from './components';
// import EngageItem from '../scenes/Engages/components/EngageItem';

// import './styles.css';

class Engages extends React.Component {
    state = {
        workflow: null,
        isEditTrue: false,
        pageWorkflows: [],
        showTemplateModal: false,
        showImageCropModal: false,
        workflow: null
    };

    componentDidMount() {
        this.props.actions.getPageWorkflowsAction(this.props.match.params.id);
        this.props.actions.deleteEngageInfo();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { error } = this.props;
        
        if (nextProps.loading && nextProps.workflows.length === 0) {
            Swal({
                title: 'Please wait...',
                text: 'Loading a listing of your engagements...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loadingTemplate && nextProps.error) {
            toastr.error('Error', nextProps.error);
        }

        if (nextProps.loadingTemplate) {
            Swal({
                title: 'Please wait...',
                text: 'Creating template...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loadingTemplate) {
            if (nextProps.errorTemplate) {
                toastr.error(nextProps.errorTemplate);
            } else {
                toastr.success('Success', 'Template Created');
            }
        }
        if (nextProps.error && !error) {
            Swal({
                title: 'Error',
                text: nextProps.error,
                type: 'error',
                showCancelButton: true,
                cancelButtonText: 'Close'
            });
        }
        if (
            !nextProps.loading &&
            !nextProps.loadingTemplate &&
            !nextProps.error
        ) {
            Swal.close();
        }
    }

    _deletePageWorkflow = workflow => {
        Swal({
            title: 'Are you sure?',
            text: 'Please verify that you want to delete this workflow',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete this workflow',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                this.props.actions.deletePageWorkflow(
                    this.props.match.params.id,
                    workflow.uid
                );
            }
        });
    };

    _edit = workflow => {
        console.log(workflow);
        this.props.actions.updateEngageInfo({
            name: workflow.name,
            workflowType: workflow.workflowType,
            activeStep: workflow.steps[0].stepUid,
            steps: workflow.steps,
            uid: workflow.uid,
            keywords: workflow.keywords || '',
            keywordsOption: workflow.keywordsOption || ''
        });
        this.setState({
            workflow,
            isEditTrue: true
        });
    };

    //#region create template
    handleCreateTemplate = workflow => {
        // workflow.steps = transformStepsToLocal(workflow.steps);
        this.setState({
            showTemplateModal: true,
            workflow
        });
    };

    closeTemplateModal = () => {
        // console.log('close modal');
        this.setState({
            showTemplateModal: false,
            workflow: null
        });
    };
    //#endregion 

    //#region upload workflow image
    handleCropImageModal = (workflow) => {
        this.setState({
            showImageCropModal: true,
            workflow
        });
    };

    closeImageCropModal = (isUploaded = false) => {
        // console.log('close modal');
        this.setState({
            showImageCropModal: false,
            workflow: null
        });
        if (isUploaded) {
            this.props.actions.getPageWorkflowsAction(this.props.match.params.id);
            this.props.actions.deleteEngageInfo();
        }
    };
    //#endregion

    render() {
        const pageId = this.props.match.params.id;
        const { workflows } = this.props;
        console.log('workflows', workflows);
        const {
            workflow: editWorkflow,
            isEditTrue,
            pageWorkflows,
            showTemplateModal,
            showImageCropModal,
            workflow
        } = this.state;
        let workflowsJsx;
        if (pageWorkflows && workflows && workflows.length > 0) {
            workflowsJsx = pageWorkflows.map(workflow => (
                <Block className="sequence item" key={workflow.uid}>
                    <Block className="sequence-inner">
                        {/* <h6 className="sq-titlesm">
                            Last edited <span>04/03</span>
                        </h6> */}
                        <h2 className="title-head sq-title mb-3 p-0">
                            {workflow.name}
                        </h2>
                        <Block className="img-block">
                            <span>
                            <Icon
                                name='edit outline'
                                size='small'
                                onClick={() => this.handleCropImageModal(workflow)}
                            />
                            </span>
                            <Image
                                src={workflow.pictureUrl || sequenceGraph}
                                size="huge"
                                className="graph"
                            />
                        </Block>
                        <Block className="edit-listing">
                            <List horizontal>
                                <List.Item
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/page/${workflow.pageUid}/workflows/${workflow.uid}/edit`
                                        });
                                    }}
                                >
                                    <Popup
                                        on={['hover']}
                                        content="Edit"
                                        position="top center"
                                        inverted
                                        trigger={
                                            <Button>
                                                <Icon
                                                    className="m-0"
                                                    name="edit"
                                                    size="large"
                                                />
                                            </Button>
                                        }
                                    />
                                </List.Item>
                                <List.Item
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/page/${workflow.pageUid}/workflows/${workflow.uid}/stats`
                                        });
                                    }}
                                >
                                    <Popup
                                        on={['hover']}
                                        content="Stats"
                                        position="top center"
                                        inverted
                                        trigger={
                                            <Button className="eye">
                                                <Icon
                                                    className="m-0"
                                                    name="eye"
                                                    size="large"
                                                />
                                            </Button>
                                        }
                                    />
                                </List.Item>
                                <List.Item>
                                    <Popup
                                        on={['hover']}
                                        content="Create Template"
                                        position="top center"
                                        inverted
                                        trigger={
                                            <Button
                                                onClick={() =>
                                                    this.handleCreateTemplate(
                                                        workflow
                                                    )
                                                }
                                            >
                                                <Icon
                                                    className="m-0"
                                                    name="block layout"
                                                    size="large"
                                                />
                                            </Button>
                                        }
                                    />
                                </List.Item>
                                <List.Item
                                    onClick={() =>
                                        this._deletePageWorkflow(workflow)
                                    }
                                >
                                    <Popup
                                        on={['hover']}
                                        content="Delete"
                                        position="top center"
                                        inverted
                                        trigger={
                                            <Button>
                                                <Icon
                                                    className="m-0"
                                                    name="trash"
                                                    size="large"
                                                />
                                            </Button>
                                        }
                                    />
                                </List.Item>
                            </List>
                        </Block>
                    </Block>
                </Block>
            ));
        }

        return (
            <Block className="main-container workflow-container workflow-outer m-0 mt-4">
                {showTemplateModal && (
                    <CreateTemplateModal
                        open={showTemplateModal}
                        close={this.closeTemplateModal}
                        workflowUid={workflow.uid}
                        id={pageId}
                    />
                )}
                {showImageCropModal &&
                    <ImageCropModal
                        open={showImageCropModal}
                        close={this.closeImageCropModal}
                        workflow={workflow}
                        id={pageId}
                    />
                }
                <Block className="outer-custom-main list-workflow">
                    <Grid divided="vertically" className="m-0">
                        <Grid.Row columns={2} className="m-0 pb-0 pt-0">
                            <Grid.Column className="m-0 mt-3">
                                <h2 className="title-head">Work Flows</h2>
                            </Grid.Column>
                            <Grid.Column className="text-right m-0">
                                {/* <Button
                                    className="ui button primary border-btn mr-3"
                                    onClick={this.handleCropImageModal}
                                >
                                    Crop
                                </Button> */}
                            </Grid.Column>
                            {/* <Grid.Column className="text-right m-0">
                                <Link
                                    to={`/page/${pageId}/workflows/select-template`}
                                >
                                    <Button className="ui button primary border-btn mr-3">
                                        <i
                                            aria-hidden="true"
                                            className="add icon"
                                        ></i>{' '}
                                        Create New
                                    </Button>
                                </Link>
                            </Grid.Column> */}
                        </Grid.Row>
                    </Grid>

                    <Block className="inner-box-main most-recent-padd">
                        <Block className="sequence-boxes row">
                            <Block className="sequence item">
                                <div className="listt-add-btn">
                                    <Link
                                        to={`/page/${pageId}/workflows/select-template`}
                                    >
                                        <div className="listt-add-btn-in">
                                            <span>
                                                <i
                                                    aria-hidden="true"
                                                    className="add icon"
                                                ></i>
                                            </span>
                                            <p>Create New</p>
                                        </div>
                                    </Link>
                                </div>
                            </Block>
                            {workflowsJsx}
                        </Block>
                        <Block className="paginationCol">
                            {workflows && workflows.length > 0 && (
                                <Pagination
                                    pageLimit={8}
                                    onPageChange={pageWorkflows =>
                                        this.setState({ pageWorkflows })
                                    }
                                    data={workflows}
                                />
                            )}
                        </Block>
                    </Block>
                </Block>
            </Block>
        );
    }
}

Engages.propTypes = {
    workflows: PropTypes.arrayOf(
        PropTypes.shape({
            uid: PropTypes.number.isRequired,
            pageUid: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            // workflowType: PropTypes.string.isRequired,
            keywords: PropTypes.array,
            keywords_option: PropTypes.string,
            messagesClickedCount: PropTypes.number,
            messagesClickedRatio: PropTypes.number,
            messagesDelivered: PropTypes.number,
            messagesReadCount: PropTypes.number,
            messagesReadRatio: PropTypes.number,
            createdAtUtc: PropTypes.string,
            // archived: PropTypes.bool.isRequired,
            // steps: PropTypes.array.isRequired
        })
    ),
    actions: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    loadingTemplate: PropTypes.bool.isRequired,
    errorTemplate: PropTypes.any
};

const mapStateToProps = (state, props) => ({
    workflows: getActiveWorkflows(state, props),
    loading: state.default.workflows.loading,
    error: state.default.workflows.error,
    loadingTemplate: state.default.settings.templates.loading,
    errorTemplate: state.default.settings.templates.error
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageWorkflowsAction,
            deletePageWorkflow,
            updateEngageInfo,
            deleteEngageInfo,
            createTemplate
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(Engages);
