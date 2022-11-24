import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Radio, Form, Input, Button } from 'semantic-ui-react';
import uuid from 'uuid/v4';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';
import $, { isArray } from 'jquery';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

import { Block, Svg } from '../Layout';
// import { sequenceGraph } from 'assets/img';

import { getPageWorkflows } from 'services/workflows/workflowsActions';
import { getTagsState } from 'services/tags/selector';
import { getTags } from 'services/tags/actions';
import { getPageCampaigns } from 'services/campaigns/campaignsActions';
import { addBroadcast } from 'services/broadcasts/broadcastsActions';

const conditionTypes = {
    // user_gender: {
    //     key: 'user_gender',
    //     value: 'Gender',
    //     defaultOption: 'user_gender',
    //     defaultValue: null
    // },
    user_subscribed: {
        key: 'user_subscribed',
        value: 'Subscribed',
        defaultOption: 'user_subscribed_after_date',
        defaultValue: null
    },
    user: {
        key: 'user',
        value: 'User',
        defaultOption: 'user_subscribed_to_campaign',
        defaultValue: []
    },
    tag: {
        key: 'tag',
        value: 'Tag',
        defaultOption: 'user_tagged_as',
        defaultValue: []
    }
};

const conditionTypeOptions = {
    user_gender: {
        user_gender: 'is'
    },
    user_subscribed: {
        user_subscribed_after_date: 'after Date',
        user_subscribed_before_date: 'before Date'
    },
    user: {
        user_subscribed_to_campaign: 'subscribed to',
        user_not_subscribed_to_campaign: 'not subscribed to'
    },
    tag: {
        user_tagged_as: 'has tag',
        user_not_tagged_as: "hasn't"
    }
};

class AddBroadcast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // workflowUid: 748,
            workflowUid: props.workflowUid,
            broadcastType: 'marketing',
            broadcastSubType: 'CONFIRMED_EVENT_UPDATE',
            scheduleType: 'immediately',
            timed: null,
            broadcastName: '',
            intention: '',
            showSelectConditions: false, // for condition
            conditionType: null, // for condition
            activeMenu: null,
            conditions: [],
            isSaveComplete: false
        };
    }

    //#region life cycle
    componentDidMount = () => {
        this.props.actions.getPageWorkflows(this.props.match.params.id);
        this.props.actions.getPageCampaigns(this.props.match.params.id);
        this.props.actions.getTags(this.props.match.params.id);
        this.addListner();
    };

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { isSaveComplete } = this.state;
        if (nextProps.loading) {
            this.setState({
                isSaveComplete: true
            });
            Swal({
                title: 'Please wait...',
                text: 'We are publishing broadcast...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!nextProps.loading && isSaveComplete) {
            Swal.close();
            if (nextProps.error) {
                this.setState({
                    isSaveComplete: false
                });
            } else {
                this.props.history.push({
                    pathname: `/page/${this.props.match.params.id}/broadcasts`
                });
            }
        }
    };
    //#endregion

    //#region functionality
    addListner = () => {
        $(document).mouseup(e => {
            const id =
                $(e.target)
                    .closest('.conditions-block')
                    .attr('id') || null;
            // console.log(id);
            if (!id) {
                this.setState({
                    showSelectConditions: false,
                    activeCondition: null
                });
            }
        });
    };

    openTypesMenu = uid => () => {
        this.setState({
            activeCondition: uid,
            activeMenu: 'types',
            showSelectConditions: true
        });
    };

    openOptionsMenu = uid => () => {
        this.setState({
            activeCondition: uid,
            activeMenu: 'options',
            showSelectConditions: false
        });
    };

    onSelectWorkflow = ({ uid }) => {
        // console.log('workflow', w);
        this.setState({
            workflowUid: uid
        });
    };

    handleName = broadcastName => {
        this.setState({
            broadcastName
        });
    };

    handleBroadcastType = broadcastType => {
        this.setState({
            broadcastType
        });
    };

    handleBroadcastSubType = broadcastSubType => {
        this.setState({
            broadcastSubType
        });
    };

    handleCondition = (type, oldUid) => e => {
        this.setState(({ conditions }) => {
            const uid = uuid();

            const con = {
                uid,
                type,
                option: conditionTypes[type].defaultOption,
                value: conditionTypes[type].defaultValue
            };

            if (oldUid) {
                const ind = conditions.findIndex(c => c.uid === oldUid);
                if (ind !== -1) {
                    if (conditions[ind].type !== type) {
                        con.uid = oldUid;
                        conditions[ind] = con;
                    }
                }
            } else {
                conditions.push(con);
            }

            return {
                conditions,
                showSelectConditions: false,
                activeCondition: uid,
                activeMenu: 'options'
            };
        });
    };

    handleSchedule = scheduleType => {
        this.setState({
            scheduleType
        });
    };

    updateConditionValue = (uid, value, type) => {
        const { conditions } = this.state;
        const ind = conditions.findIndex(c => c.uid === uid);
        if (ind === -1) {
            return false;
        }
        switch (type) {
            // case conditionTypes.user_gender.key:
            //     conditions[ind].value = value;
            //     this.setState({ activeCondition: null });
            //     break;
            case conditionTypes.user_subscribed.key:
                conditions[ind].value = value;
                this.setState({ activeCondition: null });
                break;
            case conditionTypes.user.key:
                if (conditions[ind].value) {
                    const oldValues = conditions[ind].value.map(v => v.uid);
                    if (oldValues.includes(value.uid)) {
                        conditions[ind].value = conditions[ind].value.filter(
                            v => v.uid !== value.uid
                        );
                    } else {
                        conditions[ind].value.push(value);
                    }
                } else {
                    conditions[ind].value = [value];
                }
                break;
            case conditionTypes.tag.key:
                if (conditions[ind].value) {
                    const oldValues = conditions[ind].value.map(v => v.uid);
                    if (oldValues.includes(value.uid)) {
                        conditions[ind].value = conditions[ind].value.filter(
                            v => v.uid !== value.uid
                        );
                    } else {
                        conditions[ind].value.push(value);
                    }
                } else {
                    conditions[ind].value = [value];
                }
                break;
            default:
                return null;
        }

        this.setState({
            conditions
        });
    };

    updateConditionOption = (uid, option) => {
        this.setState(({ conditions }) => {
            const ind = conditions.findIndex(c => c.uid === uid);
            if (ind !== -1) {
                conditions[ind].option = option;
            }

            return {
                conditions
            };
        });
    };

    toggleSelectConditionTypes = e => {
        e.stopPropagation();
        this.setState(({ showSelectConditions, activeMenu }) => {
            if (activeMenu) {
                return {
                    activeMenu: null,
                    showSelectConditions: true
                };
            } else {
                return {
                    showSelectConditions: !showSelectConditions,
                    activeMenu: null
                };
            }
        });
    };
    //#endregion

    //#region Save Broadcast
    getTransformedConditions = () => {
        const { conditions } = this.state;
        const conditonsJson = [];
        conditions.map(c => {
            switch (c.type) {
                // case conditionTypes.user_gender.key:
                //     conditonsJson.push({condition: c.option, variable: c.value});
                //     // conditonsJson[c.option] = c.value;
                //     break;
                case conditionTypes.user_subscribed.key:
                    conditonsJson.push({condition: c.option, variable: c.value ? new Date(c.value) : null});
                    // conditonsJson[c.option] = c.value
                    //     ? new Date(c.value)
                    //     : null;
                    break;
                case conditionTypes.user.key:
                    conditonsJson.push({condition: c.option, variable: c.value.map(v => v.uid)});
                    // conditonsJson[c.option] = c.value.map(v => v.uid);
                    break;
                case conditionTypes.tag.key:
                    conditonsJson.push({condition: c.option, variable: c.value.map(v => v.uid)});
                    // conditonsJson[c.option] = c.value.map(v => v.uid);
                    break;
                default:
                    return null;
            }
        });
        // console.log('con', JSON.stringify(Object.keys(conditonsJson).length > 0 ? [conditonsJson] : []));
        return conditonsJson;
    };

    createBroadcast = () => {
        const {
            workflowUid,
            broadcastType,
            broadcastSubType,
            scheduleType,
            timed,
            intention
        } = this.state;
        const { workflows } = this.props;
        const triggerName = workflows.find(w => w.uid == workflowUid).name;

        let facebookMessagingType = 'UPDATE';
        let facebookMessagingTag = null;

        if (broadcastType === 'non-promotional') {
            facebookMessagingType = 'MESSAGE_TAG';
            facebookMessagingTag = broadcastSubType;
        }

        let fireAtUtc = null;
        let optimized = 0;
        if (scheduleType === 'timed') {
            fireAtUtc = timed;
        } else if (scheduleType === 'optimize') {
            optimized = 1;
        }

        return {
            type: 'broadcast',
            triggerName,
            workflowUid,
            options: {
                broadcastType,
                intention,
                facebookMessagingType,
                facebookMessagingTag,
                fireAtUtc,
                optimized,
                conditionsJson: this.getTransformedConditions()
            }
        };
    };

    checkBroadcastValidations = broadcast => {
        const { conditions, scheduleType, timed, intention } = this.state;
        let isValid = true;
        if (scheduleType === 'timed' && !timed) {
            toastr.warning('select valid schedule date and time');
            isValid = false;
        }

        if (
            !intention ||
            (intention && !intention.trim()) ||
            (intention && intention.length < 16)
        ) {
            toastr.warning(
                'please provide message details and it must be more than 15 words.'
            );
            isValid = false;
        }
        conditions.map(c => {
            if (isValid && !c.value) {
                toastr.warning('Select valid value for condition');
                isValid = false;
            }
        });
        return isValid;
    };

    handleSave = () => {
        const broadcast = this.createBroadcast();
        // console.log('broadcast', broadcast, JSON.stringify(broadcast));
        // return false;
        const isValidBroadcast = this.checkBroadcastValidations(broadcast);
        if (isValidBroadcast) {
            this.props.actions.addBroadcast(
                this.props.match.params.id,
                broadcast
            );
        }
    };
    //#endregion Save Broadcast

    //#region render
    renderConditionTypes = uid => {
        const { showSelectConditions } = this.state;
        if (showSelectConditions) {
            return (
                <Block className="con-drop-main">
                    {Object.keys(conditionTypes).map(key => (
                        <span
                            key={key}
                            onClick={this.handleCondition(key, uid)}
                        >
                            {conditionTypes[key].value}
                        </span>
                    ))}
                </Block>
            );
        }
        return null;
    };

    renderConditionPopup = condition => {
        return (
            <Block
                className="genderPopup"
                id="con-op_367e5821-850c-4ea4-bb4c-ced96df581f8"
            >
                <Block className="popleft">
                    <Block role="list" className="ui list">
                        {this.renderConditionOptions(condition)}
                    </Block>
                </Block>
                <Block className="popright">
                    {this.renderConditionOptionValues(condition)}
                </Block>
            </Block>
        );
    };

    renderConditionOptions = ({ type, uid, option }) => {
        return Object.keys(conditionTypeOptions[type]).map(op => (
            <Block key={op} role="listitem" className="item">
                <a
                    href="#"
                    className={`${op === option ? 'active' : ''}`}
                    onClick={() => this.updateConditionOption(uid, op)}
                >
                    {conditionTypeOptions[type][op]}
                </a>
            </Block>
        ));
    };

    renderConditionOptionValues = ({ type, uid, value }) => {
        switch (type) {
            // case conditionTypes.user_gender.key:
            //     return (
            //         <Block className="list">
            //             <a
            //                 href="#"
            //                 className={`${value === 'male' ? 'active' : ''}`}
            //                 onClick={() =>
            //                     this.updateConditionValue(uid, 'female', type)
            //                 }
            //             >
            //                 <span>male</span>
            //             </a>
            //             <a
            //                 href="#"
            //                 className={`${value === 'female' ? 'active' : ''}`}
            //                 onClick={() =>
            //                     this.updateConditionValue(uid, 'female', type)
            //                 }
            //             >
            //                 <span>female</span>
            //             </a>
            //         </Block>
            //     );
            case conditionTypes.user_subscribed.key:
                const selectedDate = value ? new Date(value) : new Date();
                return (
                    <ReactDatePicker
                        selected={selectedDate}
                        onChange={date =>
                            this.updateConditionValue(
                                uid,
                                date.toDateString(),
                                type
                            )
                        }
                    />
                );
            case conditionTypes.user.key:
                const { workflowTriggers } = this.props;
                const selectedTriggers = value.map(v => v.uid);
                return (
                    <Block className="list">
                        {workflowTriggers &&
                            workflowTriggers.map(t => (
                                <a
                                    key={t.uid}
                                    href="#"
                                    className={`${
                                        selectedTriggers.includes(t.uid)
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        this.updateConditionValue(
                                            uid,
                                            { uid: t.uid, name: t.triggerName },
                                            type
                                        )
                                    }
                                >
                                    <span>{t.triggerName}</span>
                                </a>
                            ))}
                    </Block>
                );
            case conditionTypes.tag.key:
                const { tags } = this.props;
                const selectedTags = value.map(v => v.uid);
                return (
                    <Block className="list">
                        {tags &&
                            tags.map(t => (
                                <a
                                    key={t.uid}
                                    href="#"
                                    className={`${
                                        selectedTags.includes(t.uid)
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        this.updateConditionValue(
                                            uid,
                                            { uid: t.uid, name: t.value },
                                            type
                                        )
                                    }
                                >
                                    <span>{t.value}</span>
                                </a>
                            ))}
                    </Block>
                );
            default:
                return null;
        }
    };

    renderConditions = () => {
        const { conditions, activeCondition, activeMenu } = this.state;
        // console.log('conditions', conditions);

        return conditions.map(c => (
            <Block key={c.uid}>
                <Block className="genderBlock render-conditions">
                    <span
                        className="poplink link"
                        onClick={this.openTypesMenu(c.uid)}
                    >
                        {conditionTypes[c.type].value}
                    </span>
                    <span
                        className="poplink link error-txt"
                        onClick={this.openOptionsMenu(c.uid)}
                    >
                        {conditionTypeOptions[c.type][c.option]}&nbsp;
                    </span>
                    {c.type === conditionTypes.user_subscribed.type ? (
                        <span
                            className="poplink link error-txt"
                            onClick={this.openOptionsMenu(c.uid)}
                        >
                            <button className="ui tiny circular button">
                                <span className={`${c.value ? '' : 'null'}`}>
                                    {c.value &&
                                    isArray(c.value) &&
                                    c.value.length > 0
                                        ? c.value.map((v, i) => {
                                              if (i === 0) {
                                                  return v.name;
                                              }
                                              return `, ${v.name}`;
                                          })
                                        : c.value}
                                </span>
                            </button>
                        </span>
                    ) : (
                        <span
                            className="poplink link error-txt"
                            onClick={this.openOptionsMenu(c.uid)}
                        >
                            <button className="ui tiny circular button">
                                <span className={`${c.value ? '' : 'null'}`}>
                                    {c.value &&
                                    isArray(c.value) &&
                                    c.value.length > 0
                                        ? c.value.map((v, i) => {
                                              if (i === 0) {
                                                  return v.name;
                                              }
                                              return `, ${v.name}`;
                                          })
                                        : c.value}
                                </span>
                            </button>
                        </span>
                    )}
                </Block>
                {c.uid === activeCondition &&
                    activeMenu === 'options' &&
                    this.renderConditionPopup(c)}
                {c.uid === activeCondition &&
                    activeMenu === 'types' &&
                    this.renderConditionTypes(c.uid)}
            </Block>
        ));
    };
    //#endregion

    render() {
        // const { workflows } = this.props;
        const {
            // workflowUid,
            broadcastType,
            broadcastSubType,
            // broadcastName,
            scheduleType,
            activeMenu,
            intention,
            timed
        } = this.state;
        return (
            <Block className="inner-box-main addbroad-outer-main mt-0">
                <Block className="addbroad-outer">
                    <Block className="addbroad-heading mb-4 float-left w-100">
                        <h2 className="title-head float-left mt-3 p-0">
                            Broadcast Details
                        </h2>
                        <button className="ui button primary float-right border-btn">
                            {' '}
                            <i
                                aria-hidden="true"
                                className="angle left icon"
                            ></i>
                            Back{' '}
                        </button>
                    </Block>
                    <Block>
                        <Form>
                            <Block className="addbroad-outer-block">
                                <Block className="addbroad-outer-block-heading">
                                    <h2 className="title-head">
                                        {' '}
                                        Contact Type{' '}
                                    </h2>
                                </Block>
                                <Block className="addbroad-outer-block-in">
                                    <Form.Field>
                                        <label>
                                            <input
                                                type="radio"
                                                checked={
                                                    broadcastType ===
                                                    'marketing'
                                                }
                                                onChange={() =>
                                                    this.handleBroadcastType(
                                                        'marketing'
                                                    )
                                                }
                                            />
                                            <span className="font-bold">
                                                {' '}
                                                Marketing{' '}
                                            </span>
                                            <span style={{ color: '#969696' }}>
                                                (This is a message intended to
                                                promote a product of some kind,
                                                and is only allowed to be sent
                                                for 24 hours after someone last
                                                was active with your page)
                                            </span>
                                        </label>
                                    </Form.Field>
                                    {/* <Form.Field>
                                        <label>
                                            <input
                                                type="radio"
                                                checked={
                                                    broadcastType ===
                                                    'notification'
                                                }
                                                onChange={() =>
                                                    this.handleBroadcastType(
                                                        'notification'
                                                    )
                                                }
                                            />
                                            <span className="font-bold">
                                                {' '}
                                                Notification{' '}
                                            </span>
                                            <span style={{ color: '#969696' }}>
                                                (This is a message that can
                                                contain updates and
                                                notifications that you would
                                                like your subscribers to
                                                receive. Make sure your
                                                subscribers explicitly
                                                subscribed for these
                                                notifications, and do not use
                                                this as a way to announce
                                                contests/ sales/ deals. This
                                                message will be sent to everyone
                                                you select below regardless of
                                                how long its been since they
                                                subscribed)
                                            </span>
                                        </label>
                                    </Form.Field> */}
                                    <Form.Field>
                                        <label>
                                            <input
                                                type="radio"
                                                checked={
                                                    broadcastType ===
                                                    'non-promotional'
                                                }
                                                onChange={() =>
                                                    this.handleBroadcastType(
                                                        'non-promotional'
                                                    )
                                                }
                                            />
                                            <span className="font-bold">
                                                {' '}
                                                Non Promotional{' '}
                                            </span>
                                            <span style={{ color: '#969696' }}>
                                                Non Promotional Content that
                                                falls under specific categories
                                                can be sent via this option
                                            </span>
                                        </label>
                                    </Form.Field>
                                    {broadcastType === 'non-promotional' && (
                                        <Block className="addbroad-inner-col1">
                                            <Form.Field>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        checked={
                                                            broadcastSubType ===
                                                            'CONFIRMED_EVENT_UPDATE'
                                                        }
                                                        onChange={() =>
                                                            this.handleBroadcastSubType(
                                                                'CONFIRMED_EVENT_UPDATE'
                                                            )
                                                        }
                                                    />
                                                    <span className="font-bold">
                                                        {' '}
                                                        CONFIRMED_EVENT_UPDATE{' '}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: '#969696'
                                                        }}
                                                    >
                                                        Send the user reminders
                                                        or updates for an event
                                                        they have registered for
                                                        (e.g., RSVPed purchased
                                                        tickets). This tag may
                                                        be used for upcoming
                                                        events and events in
                                                        progress.
                                                    </span>
                                                </label>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        checked={
                                                            broadcastSubType ===
                                                            'POST_PURCHASE_UPDATE'
                                                        }
                                                        onChange={() =>
                                                            this.handleBroadcastSubType(
                                                                'POST_PURCHASE_UPDATE'
                                                            )
                                                        }
                                                    />
                                                    <span className="font-bold">
                                                        {' '}
                                                        POST_PURCHASE_UPDATE{' '}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: '#969696'
                                                        }}
                                                    >
                                                        Notify the user of an
                                                        update on a recent
                                                        purchase.
                                                    </span>
                                                </label>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        checked={
                                                            broadcastSubType ===
                                                            'ACCOUNT_UPDATE'
                                                        }
                                                        onChange={() =>
                                                            this.handleBroadcastSubType(
                                                                'ACCOUNT_UPDATE'
                                                            )
                                                        }
                                                    />
                                                    <span className="font-bold">
                                                        {' '}
                                                        ACCOUNT_UPDATE{' '}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: '#969696'
                                                        }}
                                                    >
                                                        Notify the user of a non-recurring change to their application or account
                                                    </span>
                                                </label>
                                            </Form.Field>
                                        </Block>
                                    )}
                                </Block>
                            </Block>

                            <Block className="addbroad-outer-block mt-4">
                                <Block className="addbroad-outer-block-heading">
                                    <h2 className="title-head">
                                        {' '}
                                        Message Details{' '}
                                    </h2>
                                </Block>

                                <Block className="addbroad-outer-block-in">
                                    <Block className="w-100 uiinput-w-100">
                                        <Input
                                            focus
                                            placeholder="Describe"
                                            value={intention}
                                            onChange={(e, { value }) =>
                                                this.setState({
                                                    intention: value
                                                })
                                            }
                                        />
                                    </Block>
                                </Block>
                            </Block>

                            <Block className="addbroad-outer-block condition-outer mt-4">
                                <Block className="addbroad-outer-block-heading">
                                    <h2 className="title-head"> Schedule </h2>
                                </Block>

                                <Block className="addbroad-outer-block-in">
                                    <Block className="add-block-v-fields">
                                        <Form.Field>
                                            <Radio
                                                label="Immediately"
                                                checked={
                                                    scheduleType ===
                                                    'immediately'
                                                }
                                                onChange={() =>
                                                    this.handleSchedule(
                                                        'immediately'
                                                    )
                                                }
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Radio
                                                label="Timed"
                                                checked={
                                                    scheduleType === 'timed'
                                                }
                                                onChange={() =>
                                                    this.handleSchedule('timed')
                                                }
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Radio
                                                label="Optimization Timing"
                                                checked={
                                                    scheduleType === 'optimize'
                                                }
                                                onChange={() =>
                                                    this.handleSchedule(
                                                        'optimize'
                                                    )
                                                }
                                            />
                                        </Form.Field>
                                    </Block>
                                    <Block>
                                        {scheduleType === 'immediately' && (
                                            <span>
                                                This will send your broadcast
                                                immediately and as quickly as we
                                                can
                                            </span>
                                        )}
                                        {scheduleType === 'optimize' && (
                                            <span>
                                                Open Optimization timing will
                                                distribute your message to your
                                                subscribers at the time they are
                                                most likely to engage. We will
                                                send your broadcast in batches
                                                based on each individual
                                                subscribers most recent
                                                activity, increasing the chances
                                                that the time they receive the
                                                message is the best time for
                                                them
                                            </span>
                                        )}
                                        {scheduleType === 'timed' && (
                                            <Block>
                                                <ReactDatePicker
                                                    selected={
                                                        timed
                                                            ? moment(
                                                                  moment
                                                                      .utc(
                                                                          timed
                                                                      )
                                                                      .toDate()
                                                              )
                                                                  .local()
                                                                  .toDate()
                                                            : null
                                                    }
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dropdownMode={'select'}
                                                    onChange={timed =>
                                                        this.setState({ timed })
                                                    }
                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                    className="condition-datepicker"
                                                    placeholderText="Select Date And Time"
                                                    // minTime={new Date(2000, 1, 1, 8, 30)}
                                                    // maxMax={new Date(2000, 1, 1, 17, 30)}
                                                />
                                            </Block>
                                        )}
                                    </Block>
                                </Block>
                            </Block>

                            <Block className="addbroad-outer-block condition-outer mt-4">
                                <Block className="addbroad-outer-block-heading">
                                    <h2 className="title-head"> Condition </h2>
                                </Block>

                                <Block className="addbroad-outer-block-in">
                                    <Block className="w-100 uiinput-w-100 d-inline-block">
                                        <Block
                                            className="conditions-block"
                                            id="conditions-block"
                                        >
                                            {this.renderConditions()}
                                            <Block className="conditionBlock">
                                                <button
                                                    className="ui big basic fluid button pos-relative"
                                                    onClick={
                                                        this
                                                            .toggleSelectConditionTypes
                                                    }
                                                >
                                                    + Condition
                                                </button>
                                                {!activeMenu &&
                                                    this.renderConditionTypes()}
                                            </Block>
                                        </Block>

                                        <Block />
                                    </Block>
                                </Block>
                            </Block>
                            <Block className="addbroad-outer-block-btn mt-4 float-left w-100">
                                <Button
                                    onClick={this.handleSave}
                                    className="float-left"
                                    primary
                                    loading={this.props.loading}
                                >
                                    {' '}
                                    Save & Broadcast{' '}
                                </Button>
                            </Block>
                        </Form>
                    </Block>
                </Block>
            </Block>
        );
    }
}

const mapStateToProps = (state, props) => ({
    workflows: state.default.workflows.workflows,
    tags: getTagsState(state).tags,
    workflowTriggers: state.default.campaigns.campaigns,
    workflowUid: state.default.scenes.engageAdd.uid,
    loading: state.default.broadcasts.loading,
    error: state.default.broadcasts.error
    // loading: state.default.workflows.loading,
    // error: state.default.workflows.error,
    // loadingTemplate: state.default.settings.templates.loading,
    // errorTemplate: state.default.settings.templates.error
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageWorkflows,
            getTags,
            getPageCampaigns,
            addBroadcast
            // deletePageWorkflow,
            // updateEngageInfo,
            // deleteEngageInfo
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBroadcast);
