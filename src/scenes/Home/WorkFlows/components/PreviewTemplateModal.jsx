import React, { Component } from 'react';
import { Button, Modal, Checkbox, Form, Dropdown } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { StripeProvider, Elements } from 'react-stripe-elements';

import { Block } from '../../Layout';
import ViewOuterDragBoard from './ViewOuterDragBoard';
import { addTemplate } from '../../scenes/Settings/scenes/Templates/services/actions';
import { transformStepsToLocal } from 'services/workflows/transformers';
import { getPageTemplate, buyPageTemplate } from 'services/workflows/workflowsActions';
import StripeCardModal from './StripeCardModal';
import ViewAddedCards from './ViewAddedCards';
import { getUserCards } from 'services/auth/authActions';
import { HtmlModal } from '../../Triggers/components';

class PreviewTemplateModal extends Component {
    //#region life cycle method
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            category: null,
            price: props.templateData.price || 0,
            category: props.templateData.category || "",
            isPublic: false,
            purchasing: false,
            addingTemplate: false,
            template: null,
            src: null,
            showAddedCards: false,
            newSource: false,
            isOpenShareUrlPopUp: false
        };
    }

    componentWillMount = () => {
        const { templateData: { uid } } = this.props;
        const pageId = this.props.match.params.id;
        this.props.actions.getUserCards();
        this.props.actions.getPageTemplate(pageId, uid);
    }

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { loading, error, close, template, workflowLoading, workflowError, templateCode } = nextProps;
        const { purchasing, addingTemplate } = this.state;
        const pageId = this.props.match.params.id;
        if (workflowLoading && !purchasing) {
            Swal({
                name: 'Please wait...',
                text: 'We are loading preview...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (workflowLoading && purchasing) {
            Swal({
                name: 'Please wait...',
                text: 'Purchasing template in progress...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!workflowLoading) {
            Swal.close();
            if (workflowError) {
                Swal.fire({
                    type: 'error',
                    name: 'Oops...',
                    text: workflowError || 'Something went wrong! Please try again.'
                });
            } else {
                if (purchasing) {
                    this.setState({
                        purchasing: false,
                        addingTemplate: true
                    }, () => this.props.actions.addTemplate(pageId, templateCode));
                } else if (template) {
                    template.steps = transformStepsToLocal(template.steps);
                    this.setState({
                        template
                    })
                }
            }
        }

        if (loading && addingTemplate) {
            Swal({
                name: 'Please wait...',
                text: 'Purchasing template in progress...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!loading && addingTemplate) {
            Swal.close();
            this.setState({ addingTemplate: false });
            if (error) {
                Swal.fire({
                    type: 'error',
                    name: 'Oops...',
                    text: workflowError || 'Something went wrong! Please try again.'
                });
            } else {
                Swal.fire({
                    type: 'success',
                    name: 'Success!',
                    text:
                        'Template has been purchased and added to your templates. it will appear in your settings/templates tab.',
                    // showConfirmButton: false,
                    // timer: 1500
                });
                close();
            }
        }
    };
    //#endregion

    //#region functionality
    close = () => this.props.close();
    //#endregion

    handleSource = (src) => {
        this.setState({
            src,
            showCardModal: false,
            newSource: true
        }, () => {
            this.completePurchase();
        });
    }

    handleOldSource = (src) => {
        this.setState({
            src,
            showAddedCards: false,
            newSource: false
        }, () => {
            this.completePurchase();
        });
    }

    handlePurchaseTemplate = () => {
        const { stripeSources } = this.props;
        if (stripeSources && stripeSources.length > 0) {
            const self = this;
            Swal({
                title: 'Alert',
                text: 'Do you want to use other card for this transaction?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Use New',
                cancelButtonText: 'Use Same',
                confirmButtonColor: '#274bf0'
            }).then(result => {
                if (result.value) {
                    self.setState({
                        showCardModal: true
                    })
                } else {
                    // self.completePurchase();
                    self.setState({
                        showAddedCards: true
                    })
                }
            });
        } else {
            this.setState({
                showCardModal: true
            })
        }
    }

    completePurchase = () => {
        const { templateData: { uid } } = this.props;
        const pageId = this.props.match.params.id;
        const self = this;
        self.setState({
            purchasing: true
        }, () => {
            const { newSource } = this.state;
            const data = {
                src: self.state.src,
                newSource
            };
            self.props.actions.buyPageTemplate(pageId, uid, data);
        });
        // Swal({
        //     title: 'Are you sure?',
        //     text: 'Please verify that you want to purchase this template',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Confirm',
        //     cancelButtonText: 'Cancel',
        //     confirmButtonColor: '#274bf0'
        // }).then(result => {
        //     if (result.value) {
        //         self.setState({
        //             purchasing: true
        //         }, () => {
        //             self.props.actions.buyPageTemplate(pageId, uid, self.state.src);
        //         });
        //     }
        // });
    }

    closeShareUrlModal = () => {
        this.setState({ isOpenShareUrlPopUp: false });
    }

    openShareUrlPopup = () => {
        this.setState({ isOpenShareUrlPopUp: true });
    }

    render() {
        const pageId = this.props.id;

        const { open, loading } = this.props;
        const { price, category, template, showCardModal, showAddedCards, isOpenShareUrlPopUp } = this.state;
        console.log('template', template);
        const share_url = window.location.origin + '/template/' + this.props.templateData.uid;

        return (
            <React.Fragment>
                <ViewAddedCards open={showAddedCards} source={this.handleOldSource} close={() => this.setState({ showAddedCards: false })}  />
                <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
                    <Elements>
                        <StripeCardModal open={showCardModal} close={() => this.setState({ showCardModal: false })} source={this.handleSource} />
                    </Elements>
                </StripeProvider>
                <HtmlModal
                    html={share_url}
                    open={isOpenShareUrlPopUp}
                    close={this.closeShareUrlModal}
                />
                <Modal
                    size="fullscreen"
                    className="custom-popup mac-height"
                    open={open}
                    onClose={() => false}
                >
                    <Modal.Header>
                        Preview Template
                    <i
                            aria-hidden="true"
                            className="close small icon close-icon"
                            onClick={this.close}
                        ></i>
                    </Modal.Header>
                    <Modal.Content>
                        <Block className="create-temp-outer">
                            <Block className="create-temp-left">
                                {template &&
                                    <Form>
                                        <Form.Field className="mb-4">
                                            <label>Title:</label> {template.name}
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Category: </label> {category}
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Details: </label> {template.description}
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Price: </label> ${price}
                                        </Form.Field>
                                        <Button
                                            className="mt-3"
                                            type="submit"
                                            loading={loading}
                                            onClick={this.handlePurchaseTemplate}
                                        >
                                            Purchase This Template
                                        </Button>
                                        <Button
                                            className="mt-3"
                                            onClick={this.openShareUrlPopup}
                                        >
                                            Share This Template.
                                        </Button>
                                    </Form>
                                }
                            </Block>
                            <Block className="create-temp-right">
                                {template &&
                                    <ViewOuterDragBoard workflow={template} />
                                }
                            </Block>
                        </Block>
                    </Modal.Content>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageTemplate,
            buyPageTemplate,
            addTemplate,
            getUserCards
        },
        dispatch
    )
});

export default withRouter(
    connect(
        state => ({
            loading: state.default.settings.templates.loading,
            error: state.default.settings.templates.error,
            template: state.default.workflows.template,
            workflowLoading: state.default.workflows.loading,
            workflowError: state.default.workflows.error,
            templateCode: state.default.workflows.templateCode,
            stripeSources: state.default.auth.stripeSources
        }),
        mapDispatchToProps
    )(PreviewTemplateModal)
);
