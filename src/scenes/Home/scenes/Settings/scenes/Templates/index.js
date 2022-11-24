import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';

import { getGeneralWorkflows } from 'services/workflows/selector';
import { getPageWorkflows } from 'services/workflows/workflowsActions';
import { transformStepsToLocal } from 'services/workflows/transformers';
import { deleteTemplate, addTemplate, getTemplates } from './services/actions';
import { EditTemplateModal } from '../../../../WorkFlows/components';

import './styles.css';

class Templates extends React.Component {
    state = {
        showTemplateModal: false,
        template: null,
        workflow: null
    };
    componentDidMount() {
        this.props.actions.getTemplates(this.props.match.params.id);
        this.props.actions.getPageWorkflows(this.props.match.params.id);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.loading) {
            Swal({
                title: 'Please wait...',
                text: 'Processing...',
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
            } else if (
                this.props.templates.length === nextProps.templates.length
            ) {
                if (!this.state.showTemplateModal) {
                    toastr.success(
                        'Your new Engagement will be created shortly'
                    );
                }
            }
        }
    }

    _importTemplate = () => {
        if (this.refs.importRef && this.refs.importRef.value.length > 0) {
            this.props.actions.addTemplate(
                this.props.match.params.id,
                this.refs.importRef.value
            );
        }
    };

    _deleteTemplate = templateId => {
        Swal({
            title: 'Are you sure you want to delete this template?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, please.',
            cancelButtonText: 'No, Don’t Do This',
            confirmButtonColor: '#f02727',
            cancelButtonColor: '#274BF0'
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteTemplate(
                    this.props.match.params.id,
                    templateId
                );
            }
        });
    };

    _editTemplate = template => {
        const { allWorkflows } = this.props;
        let workflow = allWorkflows.find(w => w.uid === template.workflowUid);
        console.log('template', template);
        if (template && workflow) {
            // workflow.steps = transformStepsToLocal(workflow.steps);
            console.log('workflow', workflow);
            this.setState({
                showTemplateModal: true,
                workflow,
                template
            });
        }
    };

    _shareTemplate = template => {
        const share_url = window.location.origin + '/template/' + template;
        navigator.clipboard.writeText(share_url);
        toastr.success(
            'The share url copied to clipboard!'
        );
    }

    closeTemplateModal = () => {
        // console.log('close modal');
        this.setState({
            showTemplateModal: false
        });
        this.props.actions.getTemplates(this.props.match.params.id);
    };

    render() {
        const { showTemplateModal, workflow, template } = this.state;
        const pageId = this.props.match.params.id;
        return (
            <div className="d-flex align-items-center templates-page-container">
                {showTemplateModal && (
                    <EditTemplateModal
                        open={showTemplateModal}
                        close={this.closeTemplateModal}
                        workflowUid={workflow.uid}
                        data={template}
                        id={pageId}
                    />
                )}
                <div className="d-flex align-items-start template-container">
                    <div className="d-flex flex-column justify-content-center template-list-container">
                        <p> My Templates </p>{' '}
                        <div className="table">
                            <div className="row template-header">
                                <div className="col col-3"> NAME </div>{' '}
                                <div className="col col-3"> TYPE </div>{' '}
                                <div className="col col-2"> DOWNLOADS </div>{' '}
                                <div className="col col-2"> SHARE CODE </div>{' '}
                                <div className="col col-2"> EDIT / DELETE </div>{' '}
                            </div>{' '}
                            <div className="template-list">
                                {' '}
                                {this.props.templates.map((template, index) => {
                                    return (
                                        <div
                                            className="row template-row"
                                            key={index}
                                        >
                                            <div className="col col-3">
                                                {' '}
                                                {template.name}{' '}
                                            </div>{' '}
                                            <div className="col col-3">
                                                {' '}
                                                {template.type}{' '}
                                            </div>{' '}
                                            <div className="col col-2">
                                                {' '}
                                                {template.downloads}{' '}
                                            </div>{' '}
                                            <div className="col col-2">
                                                {' '}
                                                {template.shareCode}{' '}
                                            </div>{' '}
                                            <div className="col col-2">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <button
                                                        className="btn btn-link p-0"
                                                        onClick={() =>
                                                            this._shareTemplate(
                                                                template.uid
                                                            )
                                                        }
                                                    >
                                                        <i className="fa fa-link" />
                                                    </button>{' '}
                                                    <button
                                                        className="btn btn-link p-0"
                                                        onClick={() =>
                                                            this._deleteTemplate(
                                                                template.uid
                                                            )
                                                        }
                                                    >
                                                        <i className="fa fa-trash" />
                                                    </button>{' '}
                                                    <button
                                                        className="btn btn-link p-0"
                                                        onClick={() =>
                                                            this._editTemplate(
                                                                template
                                                            )
                                                        }
                                                    >
                                                        <i className="fa fa-edit" />
                                                    </button>{' '}
                                                </div>{' '}
                                            </div>{' '}
                                        </div>
                                    );
                                })}{' '}
                            </div>{' '}
                        </div>{' '}
                    </div>{' '}
                    <div className="d-flex flex-column justify-content-center template-import-container">
                        <p> Import Template </p>{' '}
                            <div className="d-flex flex-column justify-content-center align-items-center template-import-content">
                                <input
                                    type="text"
                                    ref="importRef"
                                    placeholder="Enter code here"
                                    className="form-control template-import-input"
                                />
                                <button
                                    className="btn btn-primary btn-submit"
                                    onClick={this._importTemplate}
                                >
                                    Submit{' '}
                                </button>{' '}
                            </div>{' '}
                    </div>{' '}
                </div>{' '}
            </div>
        );
    }
}

Templates.propTypes = {
    templates: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    workflows: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    templates: state.default.settings.templates.templates,
    loading: state.default.settings.templates.loading,
    error: state.default.settings.templates.error,
    allWorkflows: state.default.workflows.workflows,
    workflows: getGeneralWorkflows(state)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            deleteTemplate,
            addTemplate,
            getTemplates,
            getPageWorkflows
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Templates)
);
