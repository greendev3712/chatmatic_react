import React, { Component } from 'react';
import { Button, Modal, Checkbox, Form, Dropdown } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import { withRouter } from 'react-router-dom'; import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { template } from 'lodash';

import { Block } from '../../Layout';
import ViewOuterDragBoard from './ViewOuterDragBoard';
import { updateTemplate } from '../../scenes/Settings/scenes/Templates/services/actions';
import { transformStepsToLocal } from 'services/workflows/transformers';
import {
    getPageWorkflow
} from 'services/workflows/workflowsActions';

class EditTemplateModal extends Component {
    //#region life cycle method
    constructor(props) {
        super(props);
        this.state = {
            src: null
        };
    }
    //#endregion

    handleSource = src => {
        this.props.source(src);
    }

    render() {
        const { open, stripeSources } = this.props;

        return (
            <Modal
                size="tiny"
                className="custom-popup"
                open={open}
                onClose={() => false}
            >
                <Modal.Header>
                    Your Cards
                    <i
                        aria-hidden="true"
                        className="close small icon close-icon"
                        onClick={this.props.close}
                    ></i>
                </Modal.Header>
                <Modal.Content>
                    <Block className="user-added-cards">
                        {stripeSources && stripeSources.length > 0 && stripeSources.map(s => (
                            <Block onClick={() => this.handleSource(s.sourceId)} className="card">
                                <Block>xxxx xxxx xxxx {s.last4}</Block>
                                <Block className="card-info">
                                    <Block className="card-year">{s.expMonth} / {s.expYear}</Block>
                                    <Block className="card-brand">{s.brand}</Block>
                                    <Block className="clearfix"></Block>
                                </Block>
                            </Block>
                        ))
                        }
                    </Block>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateTemplate,
            getPageWorkflow
        },
        dispatch
    )
});

export default withRouter(
    connect(
        state => ({
            stripeSources: state.default.auth.stripeSources
        }),
        mapDispatchToProps
    )(EditTemplateModal)
);
