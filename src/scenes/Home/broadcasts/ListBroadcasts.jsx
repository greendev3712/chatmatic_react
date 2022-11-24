import React, { Component } from 'react';
import { Table, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import { Block, Pagination } from '../Layout';

import {
    getPageBroadcasts,
    deleteBroadcast
} from 'services/broadcasts/broadcastsActions';

class ListBroadcast extends Component {
    state = {
        pageBroadcasts: []
    };

    componentDidMount = () => {
        this.props.actions.getPageBroadcasts(this.props.match.params.id);
    };

    //#region delete trigger
    handleDeleteBroadcast = triggerId => {
        Swal({
            title: 'Are you sure?',
            text: 'Please verify that you want to delete this broadcast',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete this broadcast',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteBroadcast(
                    this.props.match.params.id,
                    triggerId
                );
            }
        });
    };
    //#endregion

    renderBroadcasts = broadcasts => {
        return broadcasts.map(b => {
            const sent = b.messagesSent || 1;
            const delivedPer = ((b.messagesDelivered / sent) * 100).toFixed(2);
            const clickedPer = ((b.messagesClicked / sent) * 100).toFixed(2);
            const readPer = ((b.messagesRead / sent) * 100).toFixed(2);
            return (
                <Table.Row key={b.uid}>
                    <Table.Cell>
                        {/* <i
                            aria-hidden="true"
                            className="ellipsis horizontal icon"
                        ></i> */}
                        <Dropdown icon="ellipsis horizontal">
                            <Dropdown.Menu>
                                {/* <Dropdown.Item
                                    text="Edit"
                                    icon="pencil"
                                    as={Link}
                                    to={`/page/${this.props.match.params.id}/triggers/${t.uid}/edit`}
                                /> */}
                                {/* <Dropdown.Item
                                    text="Open..."
                                    description="ctrl + o"
                                /> */}
                                {/* <Dropdown.Item icon="copy" text="Copy Code" /> */}
                                <Dropdown.Item
                                    icon="trash"
                                    text="Delete"
                                    as="button"
                                    onClick={() =>
                                        this.handleDeleteBroadcast(b.uid)
                                    }
                                />
                                {/* <Dropdown.Item
                                    icon="trash"
                                    text="Create Template"
                                    as="button"
                                    // onClick={() =>
                                    //     this.handleDeleteTrigger(t.uid)
                                    // }
                                /> */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Table.Cell>
                    <Table.Cell>{b.broadcastName}</Table.Cell>
                    <Table.Cell>--</Table.Cell>
                    <Table.Cell>{b.messagesSent}</Table.Cell>
                    <Table.Cell>
                        {b.messagesDelivered} ({delivedPer}%)
                    </Table.Cell>
                    <Table.Cell>
                        {b.messagesClicked} ({clickedPer}%)
                    </Table.Cell>
                    <Table.Cell>
                        {b.messagesRead} ({readPer}%)
                    </Table.Cell>
                </Table.Row>
            );
        });
    };

    //#region functionlality
    addNewWorkflow = () => {
        Swal({
            title: 'Please wait...',
            // text: 'We are saving trigger...',
            onOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });
        const self = this;
        setTimeout(() => {
            self.props.history.push(
                `/page/${self.props.match.params.id}/workflows/add?type=broadcast`
            );
            Swal.close();
        }, 2000);
    };
    //#endregion

    render() {
        const { broadcasts, loading } = this.props;
        const { pageBroadcasts } = this.state;

        if (
            loading &&
            (!broadcasts || (broadcasts && broadcasts.length === 0))
        ) {
            Swal({
                title: 'Please wait...',
                text: 'We are fetching broadcasts...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else {
            Swal.close();
        }

        return (
            <Block className="inner-box-main mt-0">
                <h2 className="title-head float-left mt-3">Broadcasts</h2>
                {/* <Link
                    to={`/page/${this.props.match.params.id}/workflows/add?type=broadcast`}
                > */}
                <button
                    className="ui button primary float-right border-btn"
                    onClick={this.addNewWorkflow}
                >
                    <i aria-hidden="true" className="add icon"></i>
                    Add New
                </button>
                {/* </Link> */}

                <Block className="custom-table">
                    <Table celled className="float-left w-100">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Start</Table.HeaderCell>
                                <Table.HeaderCell>Sent</Table.HeaderCell>
                                <Table.HeaderCell>
                                    Delivered (%)
                                </Table.HeaderCell>
                                <Table.HeaderCell>Clicked (%)</Table.HeaderCell>
                                <Table.HeaderCell>Read (%)</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {pageBroadcasts &&
                                pageBroadcasts.length > 0 &&
                                this.renderBroadcasts(pageBroadcasts)}
                        </Table.Body>
                    </Table>
                </Block>

                <Block className="paginationCol">
                    {broadcasts && broadcasts.length > 0 && (
                        <Pagination
                            pageLimit={11}
                            onPageChange={pageBroadcasts =>
                                this.setState({ pageBroadcasts })
                            }
                            data={broadcasts}
                        />
                    )}
                </Block>
            </Block>
        );
    }
}

const mapStateToProps = (state, props) => ({
    broadcasts: state.default.broadcasts.broadcasts,
    loading: state.default.broadcasts.loading,
    error: state.default.broadcasts.error
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageBroadcasts,
            deleteBroadcast
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(ListBroadcast);
