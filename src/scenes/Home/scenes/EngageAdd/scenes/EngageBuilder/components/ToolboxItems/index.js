import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import {
    getEngageAddState,
    getCurrentStep
} from '../../../../services/selector';
import { updateEngageInfo } from '../../../../services/actions';

import './styles.css';
import { parseToArray } from '../../../../../../../../services/utils';
import Constants from '../../../../../../../../config/Constants';
import { screenOrientation } from '../../../../../../../../constants/AppConstants';

class ToolboxItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toolboxItemHover: null
        };
    }

    isUserInputUsed = (items = []) => {
        let isUsed = false;
        parseToArray(items).forEach(item => {
            if (item.type === Constants.toolboxItems.userInputItem.type) {
                return (isUsed = true);
            }
        });
        return isUsed;
    };

    _addToolboxItem = item => {
        let order = 0;
        const steps = this.props.steps;
        const { currentStep } = this.props;
        if (currentStep) {
            if (currentStep && currentStep.items) {
                currentStep.items.forEach(item => {
                    if (order <= item.order) {
                        order = item.order + 1;
                    }
                });
            }
        }

        console.log('add new item order', order, this.props.currentStep);
        let newItem = {};

        switch (item.type) {
            case 'carousel':
                newItem = {
                    order,
                    type: item.type,
                    items: [
                        {
                            uid: uuid(),
                            image: '',
                            headline: '',
                            description: '',
                            actionBtns: []
                        }
                    ],
                    orientation: screenOrientation.portrait
                };
                break;
            case 'card':
                newItem = {
                    order,
                    type: item.type,
                    image: null,
                    headline: null,
                    description: null,
                    imageLink: null,
                    actionBtns: [],
                    orientation: screenOrientation.portrait
                };
                break;
            case 'video':
                newItem = {
                    order,
                    type: item.type,
                    video: null,
                    actionBtns: []
                };
                break;
            case 'image':
                newItem = {
                    order,
                    type: item.type,
                    image: null
                };
                break;
            case 'audio':
                newItem = {
                    order,
                    type: item.type,
                    audio: null
                };
                break;
            case 'text':
                newItem = {
                    order,
                    type: item.type,
                    textMessage: null,
                    actionBtns: []
                };
                break;
            case 'delay':
                newItem = {
                    order,
                    type: item.type,
                    delayTime: 4,
                    showTyping: false
                };
                break;
            case 'free_text_input':
                newItem = {
                    order,
                    customFieldUid: null,
                    nextStepUid: null,
                    type: item.type,
                    textMessage: null
                };
                break;
            //no default
        }

        newItem.uid = uuid();
        if (!this.props.activeStep) {
            const stepUid = uuid();
            const steps = [
                {
                    order,
                    name: '',
                    stepUid: stepUid,
                    items: [newItem],
                    quickReplies: []
                }
            ];
            this.props.actions.updateEngageInfo({ steps, activeStep: stepUid });
        } else {
            const steps = this.props.steps.map((step, index) => {
                if (step.stepUid != this.props.activeStep) return step;
                if (
                    step.items.findIndex(x => x.type == 'free_text_input') > -1
                ) {
                    const index = step.items.findIndex(
                        x => x.type == 'free_text_input'
                    );
                    step.items.splice(index, 0, newItem);
                    return {
                        ...step,
                        items: step.items
                    };
                }
                return { ...step, items: step.items.concat([newItem]) };
            });
            this.props.actions.updateEngageInfo({ steps });
        }
    };

    render() {
        const { newWorkflowType, steps, currentStep } = this.props;
        const userInputUsed = this.isUserInputUsed(
            currentStep && currentStep.items
        );
        let isfirstToolBoxDisabled = false;
        if (
            currentStep &&
            steps[0].stepUid === currentStep.stepUid &&
            currentStep.items.length > 0 &&
            (
                newWorkflowType === 'privateReply'
            )
        ) {
            isfirstToolBoxDisabled = true;
        }
        // console.log('isfirstToolBoxDisabled', isfirstToolBoxDisabled);
        return (
            <div className="toolbox-items-container">
                <p className="m-0 small">ToolBox</p>
                <div className={`d-flex flex-wrap ${isfirstToolBoxDisabled ? 'disabled-block' : ''}`}>
                    {Object.keys(Constants.toolboxItems).map((item, index) => {
                        let allowToAdd = true;
                        if (
                            Constants.toolboxItems[item].type ===
                            Constants.toolboxItems.userInputItem.type
                        ) {
                            if (userInputUsed) allowToAdd = false;
                        }

                        if (
                            [
                                Constants.toolboxItems.userInputItem.type,
                                Constants.toolboxItems.delayItem.type
                            ].includes(Constants.toolboxItems[item].type) &&
                            currentStep &&
                            steps[0].stepUid === currentStep.stepUid &&
                            (
                                newWorkflowType === 'privateReply' ||
                                newWorkflowType === 'JSON'
                            )
                        ) {
                            allowToAdd = false;
                        }
                        return (
                            <div
                                className={classnames(
                                    `d-flex flex-column align-items-center toolbox-item ${allowToAdd ? '' : 'disable'
                                    }`,
                                    {
                                        hover:
                                            this.state.toolboxItemHover === item
                                    }
                                )}
                                key={index}
                                onClick={() =>
                                    allowToAdd &&
                                    this._addToolboxItem(
                                        Constants.toolboxItems[item]
                                    )
                                }
                                onMouseEnter={() =>
                                    allowToAdd &&
                                    this.setState({ toolboxItemHover: item })
                                }
                                onMouseLeave={() =>
                                    allowToAdd &&
                                    this.setState({ toolboxItemHover: null })
                                }
                            >
                                <img
                                    src={Constants.toolboxItems[item].image}
                                    alt=""
                                />
                                <span>
                                    {Constants.toolboxItems[item].label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

ToolboxItems.propTypes = {
    pageId: PropTypes.string.isRequired,
    steps: PropTypes.array.isRequired,
    activeStep: PropTypes.any.isRequired,
    actions: PropTypes.object.isRequired
};


const urlParams = new URLSearchParams(window.location.search);
const mapStateToProps = state => ({
    steps: getEngageAddState(state).steps,
    activeStep: getEngageAddState(state).activeStep,
    currentStep: getCurrentStep(state),
    newWorkflowType: urlParams.get('type')
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateEngageInfo
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolboxItems);
