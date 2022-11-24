import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uuid from 'uuid/v1';
import { toastr } from 'react-redux-toastr';
import { Popup } from 'semantic-ui-react';

import { Block, Svg } from '../../Layout';
// import { addItemToWorkFlow } from 'services/modules/workflow';
import Constants from '../../../../config/Constants';
import { addStepInfo } from '../../scenes/EngageAdd/services/actions';
import { getPageFromUrl } from 'services/pages/selector';

const builderTypes = Constants.builderTypes;

class SequenceMenu extends Component {
    addNewStep = ({ type, label }) => {
        const { id: elementId } = this.props;
        let top = 0,
            left = 0;
        try {
            let btnTop = 0;
            let id = elementId;
            if (elementId.includes('btn')) {
                const idArr = elementId.split('_');
                id = idArr[idArr.length - 1];
                btnTop = document.getElementById(elementId).offsetTop;
            }
            const parent = document.getElementById(id);
            top = parent.offsetTop + 50 + btnTop;
            const parentLeft = parent.offsetLeft;
            const parentWidth = parent.offsetWidth;
            left = parentLeft + parentWidth + 200;
        } catch (err) {}

        if (type === 'sms' && (this.props.page && !this.props.page.smsAccount)) {
            toastr.error(
                'Error',
                `Please select an SMS billing plan to use this feature from settings.`
            );
            return false;
        } else {
            if (type) {
                const stepId = uuid();
                this.props.actions.addStepInfo(stepId, type, label, top, left);
                this.props.onStepAdded(stepId);
            }
        }
        this.props.closeMenu();
    };

    render() {
        //#region Enable/Disable Builder Types
        const config = {};
        Object.keys(builderTypes).map(key => {
            if (this.props.isCardActionStep)
                config[builderTypes[key].type] =
                    builderTypes[key].type === builderTypes.delayConfig.type
                        ? true
                        : false;
            else config[builderTypes[key].type] = true;
        });
        //#endregion
        return (
            <Block className="menuBox">
                <Block id="menu-items-block" className="menu hide">
                    <Popup
                        trigger={
                            <button
                                onClick={e =>
                                    config[builderTypes.messageConfig.type] &&
                                    this.addNewStep(builderTypes.messageConfig)
                                }
                                className={`menu-item link ${!config[
                                    builderTypes.messageConfig.type
                                ] && 'disable'}`}
                            >
                                <Svg
                                    name={builderTypes.messageConfig.iconName}
                                />
                            </button>
                        }
                        content={builderTypes.messageConfig.label}
                        position="left center"
                        className="seqBtn-pop"
                    />
                    <Popup
                        trigger={
                            <button
                                onClick={e =>
                                    config[builderTypes.smsConfig.type] &&
                                    this.addNewStep(builderTypes.smsConfig)
                                }
                                className={`menu-item link ${!config[
                                    builderTypes.smsConfig.type
                                ] && 'disable'}`}
                            >
                                <Svg name={builderTypes.smsConfig.iconName} />
                            </button>
                        }
                        content={builderTypes.smsConfig.label}
                        position="left center"
                        className="seqBtn-pop"
                    />
                    <Popup
                        trigger={
                            <button
                                onClick={e =>
                                    config[builderTypes.conditionConfig.type] &&
                                    this.addNewStep(
                                        builderTypes.conditionConfig
                                    )
                                }
                                className={`menu-item link ${!config[
                                    builderTypes.conditionConfig.type
                                ] && 'disable'}`}
                            >
                                <Svg
                                    name={builderTypes.conditionConfig.iconName}
                                />
                            </button>
                        }
                        content={builderTypes.conditionConfig.label}
                        position="left center"
                        className="seqBtn-pop"
                    />
                    <Popup
                        trigger={
                            <button
                                onClick={e =>
                                    config[
                                        builderTypes.randomizerConfig.type
                                    ] &&
                                    this.addNewStep(
                                        builderTypes.randomizerConfig
                                    )
                                }
                                className={`menu-item link ${!config[
                                    builderTypes.randomizerConfig.type
                                ] && 'disable'}`}
                            >
                                <Svg
                                    name={
                                        builderTypes.randomizerConfig.iconName
                                    }
                                />
                            </button>
                        }
                        content={builderTypes.randomizerConfig.label}
                        position="left center"
                        className="seqBtn-pop"
                    />
                    <Popup
                        trigger={
                            <button
                                onClick={e =>
                                    config[builderTypes.delayConfig.type] &&
                                    this.addNewStep(builderTypes.delayConfig)
                                }
                                className={`menu-item link ${!config[
                                    builderTypes.delayConfig.type
                                ] && 'disable'}`}
                            >
                                <Svg name={builderTypes.delayConfig.iconName} />
                            </button>
                        }
                        content={builderTypes.delayConfig.label}
                        position="left center"
                        className="seqBtn-pop"
                    />
                </Block>
            </Block>
        );
    }
}

SequenceMenu.propTypes = {};
const mapStateToProps = (state, props) => ({
    page: getPageFromUrl(state, props)
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            addStepInfo
        },
        dispatch
    )
});
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SequenceMenu)
);

// Legacy
// export default connect(state => ({
//     // workflow: state.workflows.workflow,
//     // workflowItem: state.workflows.workflowItem,
//     // lastUpdatedAt: Date.now()
// }))(SequenceMenu);
