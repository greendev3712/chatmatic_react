import React, { Component } from 'react';
import { Radio, Form, Input, Grid } from 'semantic-ui-react';

import { Block } from '../Layout';

export default class AddBroadcast extends Component {
    render() {
        return (
            <Block className="inner-box-main addbroad-outer-main mt-0">
                <h2 className="title-head mb-4">Add Broadcast</h2>

                <Block className="addbroad-outer">
                    <Block>
                        <Form>
                            <Form.Field>
                                <Block className="w-100 uiinput-w-100 mb-4">
                                    <Input focus placeholder="Enter Name" />
                                </Block>
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    label="Marketing (This is a message intended to promote a product of some kind, and is only allowed to be sent for 24 hours after someone last was active with your page)."
                                    name="radioGroup"
                                    value="this"
                                />
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    label="Notification (This is a message that can contain updates and notifications that you would like your subscribers to receive. Make sure your subscribers explicitly subscribed for these notifications, and do not use this as a way to announce contests/ sales/ deals. This message will be sent to everyone you select below regardless of how long its been since they subscribed)."
                                    name="radioGroup"
                                    value="that"
                                />
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    label="Non Promotional Non Promotional Content that falls under specific categories can be sent via this option"
                                    name="radioGroup"
                                    value="this"
                                />
                            </Form.Field>
                            <Block className="addbroad-inner-col1">
                                <Form.Field>
                                    <Radio
                                        label="CONFIRMED_EVENT_UPDATE Send the user reminders or updates for an event they have registered for (e.g., RSVPed purchased tickets). This tag may be used for upcoming events and events in progress."
                                        name="radioGroup"
                                        value="this"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Radio
                                        label="POST_PURCHASE_UPDATE Notify the user of an update on a recent purchase."
                                        name="radioGroup"
                                        value="this"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Radio
                                        label="ACCOUNT_UPDATE Notify the user of a non-recurring change to their application or account"
                                        name="radioGroup"
                                        value="this"
                                    />
                                </Form.Field>
                            </Block>
                            <Block className="w-100 uiinput-w-100">
                                <h2 className="title-head mb-3 mt-5 p-0">
                                    {' '}
                                    Message Details{' '}
                                </h2>
                                <Input focus placeholder="Describe" />
                            </Block>
                            <Block className="add-block-v-fields">
                                <h2 className="title-head mb-3 mt-5 p-0">
                                    {' '}
                                    When Should we send your message?{' '}
                                </h2>
                                <Form.Field>
                                    <Radio
                                        label="Immediately"
                                        name="radioGroup"
                                        value="this"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Radio
                                        label="Timed"
                                        name="radioGroup"
                                        value="this"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Radio
                                        label="Optimization Timing"
                                        name="radioGroup"
                                        value="this"
                                    />
                                </Form.Field>
                            </Block>
                            <Block className="w-100 uiinput-w-100 d-inline-block">
                                <div className="conditionBlock">
                                    <button className="ui big basic fluid button pos-relative">
                                        + Condition
                                    </button>
                                </div>
                                <h2 className="title-head mb-3 mt-4 p-0">
                                    {' '}
                                    Condition{' '}
                                </h2>
                                <button className="ui button primary float-left">
                                    {' '}
                                    Condition{' '}
                                </button>
                                <button className="ui button primary float-right">
                                    {' '}
                                    Save{' '}
                                </button>
                            </Block>
                        </Form>
                    </Block>
                </Block>

                <Block className="add-broad-right-main">
                    <Grid columns={2} className="grid-inner-block">
                        <Grid.Column>
                            <Block className="sequence-inner add-new-workflow">
                                {/*<h6 className="sq-titlesm">
                                    New Work Flow
                                </h6>*/}
                                <Block className="add-plus-icon-outer">
                                    {/*<Block className="add-plus-icon-inner">
                                        <Svg name="plus" />
                                    </Block>*/}
                                </Block>
                                <h3 className="sq-title mb-0">
                                    Add New Work Flow
                                </h3>
                                {/* <Image
                                    src={sequenceGraph}
                                    size="huge"
                                    className="graph"
                                /> */}
                            </Block>
                        </Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid>
                </Block>
            </Block>
        );
    }
}
