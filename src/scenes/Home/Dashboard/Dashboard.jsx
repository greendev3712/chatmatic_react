import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import {
    Input,
    Button,
    Icon,
    // Progress,
    Grid
} from 'semantic-ui-react';

import { Block, Svg } from '../Layout';
import { Area } from '../components/Charts';
import { AddNewPageModal } from './components';
import { getPages } from 'services/pages/pagesActions';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const fileContentStyle = {
    objectFit: 'cover'
    // borderRadius: 18
};

class Dashboard extends React.Component {
    //#region life cycle 
    constructor(props) {
        super(props);
        const { updates } = props;
        // const updates = [...props.updates, ...props.updates, ...props.updates];
        this.state = {
            pages: props.pages,
            allPages: props.pages,
            pageSearch: '',
            updates,
            activeUpdateIndex: 0,
            isNextUpdate: updates && updates.length > 1 ? true : false,
            isPrevUpdate: false,
            addPageModal: false
        };
    }

    componentDidMount = () => {
        // this.props.actions.getPages();
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { pages, updates } = nextProps;
        console.log('pages', pages);
        this.setState({
            allPages: pages,
            updates,
            isNextUpdate: updates && updates.length > 1 ? true : false,
        }, () => {
            this.onPageSearch(this.state.pageSearch);
        });
    }
    //#endregion

    //#region functionality
    onPageSearch = pageSearch => {
        // console.log('pageSearch', pageSearch);
        const { allPages } = this.state;
        if (pageSearch && pageSearch.trim() !== '') {
            const pages = allPages.filter(p =>
                p.fbName.toLowerCase().includes(pageSearch.trim().toLowerCase())
            );
            this.setState({
                pageSearch,
                pages
            });
        } else {
            this.setState({
                pageSearch: '',
                pages: allPages
            });
        }
    };

    clearPageSearch = () => this.setState(({ allPages }) => ({ pages: allPages, pageSearch: '' }));

    openPage = pageId => {
        this.props.history.push(`/page/${pageId}`);
    };

    prevUpdate = () => {
        const {
            updates,
            activeUpdateIndex: indexNow,
            isPrevUpdate
        } = this.state;
        if (isPrevUpdate) {
            this.setState({
                isNextUpdate: true,
                activeUpdateIndex: indexNow - 1,
                isPrevUpdate: updates && updates[indexNow - 2] ? true : false
            });
        }
    };

    nextUpdate = () => {
        const {
            updates,
            activeUpdateIndex: indexNow,
            isNextUpdate
        } = this.state;
        if (isNextUpdate) {
            this.setState({
                isNextUpdate: updates && updates[indexNow + 2] ? true : false,
                activeUpdateIndex: indexNow + 1,
                isPrevUpdate: true
            });
        }
    };

    handleCloseNewPageModal = () => {
        this.setState({ addPageModal: false});
        this.props.actions.getPages();
    }
    //#endregion

    render() {
        const {
            totalPages,
            totalSequences,
            totalSubscribers,
            totalRecentSubscribers,
            tips,
            currentUser
        } = this.props;

        const {
            pageSearch,
            updates,
            activeUpdateIndex,
            isNextUpdate,
            isPrevUpdate,
            addPageModal
        } = this.state;

        let newSubsPer = 0;
        let totalSubs = 0;
        let chartData = {};
        if (
            totalSubscribers &&
            totalSubscribers.length > 0
        ) {
            totalSubs = totalSubscribers[0].total;
            // console.log('subs', totalSubscribers[0], totalSubscribers);
            totalSubscribers.map(s => {
                chartData[s.date] = s.total;
                return true;
            });
        }
        if (
            totalSubscribers &&
            totalSubscribers.length > 0 &&
            totalRecentSubscribers
        ) {
            newSubsPer = ((totalRecentSubscribers / totalSubs) * 100).toFixed(0);
        }

        // console.log('updates', updates);
        const pages = this.state.pages.filter(p => p.isConnected);

        return (
            <Block className="main-container trigger-container dashboard-container mt-0">
                {addPageModal &&
                    <AddNewPageModal
                        open={addPageModal}
                        close={this.handleCloseNewPageModal}
                        // workflow={workflow}
                        // id={pageId}
                    />
                }
                <Block className="inner-box-main">
                    <Block className="dashboard-block">
                        <Block className="dashboard-aside-left">
                            <Block className="searchfield">
                                <Input
                                    placeholder="Search page by name..."
                                    value={pageSearch}
                                    onChange={(e, { value }) =>
                                        this.onPageSearch(value)
                                    }
                                />
                                <Button
                                    onClick={this.clearPageSearch}
                                    className="btn search"
                                >
                                    {pageSearch === '' ? (
                                        <Icon name="search" />
                                    ) : (
                                        <Icon name="close" />
                                    )}
                                </Button>
                            </Block>

                            <Block className="addnewField">
                                <Button
                                    onClick={() => this.setState({ addPageModal: true})}
                                    className="btn plusBtn"
                                >
                                    <Svg        
                                        name="plus"
                                    />
                                    Add a new fan page
                                </Button>
                                {pages &&
                                    pages.length > 0 &&
                                    pages.map(p => (
                                        <Block
                                            onClick={() => this.openPage(p.uid)}
                                            key={p.uid}
                                            className="side-listing"
                                        >
                                            <Block className="img-circle">
                                                <img
                                                    src={`https://graph.facebook.com/${p.fbId}/picture?type=small`}
                                                    alt="user"
                                                />
                                            </Block>
                                            <Block className="list-text">
                                                <h3>{p.fbName}</h3>
                                                <Block className="list-bottom">
                                                    <Block className="username">
                                                        <Icon name="users" />{' '}
                                                        {p.subscribers}
                                                        <span>
                                                            {' '}
                                                            +
                                                            {
                                                                p.recentSubscribers
                                                            }
                                                        </span>
                                                    </Block>
                                                    <Block className="calander">
                                                        <Icon name="calendar alternate" />{' '}
                                                        {p.sequences}{' '}
                                                        {/* <span>+17</span> */}
                                                    </Block>
                                                </Block>
                                            </Block>
                                        </Block>
                                    ))}
                            </Block>
                        </Block>

                        <Block className="dashboard-main">
                            <Block className="dashboard-top-block">
                                <Block className="welcome-section">
                                    <h2 className="title-head p-0 mb-4">
                                        Welcome,{' '}
                                        {currentUser &&
                                            currentUser.facebookName}
                                        !
                                    </h2>

                                    <Block className="welcome-cols">
                                        <Block className="row">
                                            <Block className="welcome-col-box">
                                                <Block className="welcome-box-inner">
                                                    <h3 className="no">
                                                        {totalPages}
                                                    </h3>
                                                    <h6>Total Pages</h6>
                                                </Block>
                                            </Block>
                                            <Block className="welcome-col-box">
                                                <Block className="welcome-box-inner active">
                                                    <h3 className="no">
                                                        {totalSubs}
                                                        <span>
                                                            {' '}
                                                            +{newSubsPer}%
                                                        </span>
                                                    </h3>
                                                    <h6>Total Subs</h6>
                                                </Block>
                                            </Block>
                                            <Block className="welcome-col-box">
                                                <Block className="welcome-box-inner">
                                                    <h3 className="no">
                                                        {totalSequences}
                                                        {/* <span>+5%</span> */}
                                                    </h3>
                                                    <h6>Workflows</h6>
                                                </Block>
                                            </Block>
                                        </Block>
                                    </Block>
                                </Block>
                                <Block className="grap-section dash-top-chart">
                                    {chartData && <Area data={chartData} />}
                                </Block>
                            </Block>

                            <Block className="dashboard-bottom-block">
                                <Grid columns={2}>
                                    <Grid.Row className="pb-0">
                                        <Grid.Column>
                                            <Block className="update-section d-flex">
                                                <h2 className="title-head p-0 mb-4">
                                                    Chatmatic Updates
                                                </h2>
                                                <Block className="update-section-inner">
                                                    {updates &&
                                                        updates[
                                                            activeUpdateIndex
                                                        ] && (
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        updates[
                                                                            activeUpdateIndex
                                                                        ]
                                                                            .content
                                                                }}
                                                            ></div>
                                                        )}
                                                    {/* <h4 className="titlesm">
                                                        New Dashboard!
                                                    </h4>
                                                    <p>
                                                        Feature Update One
                                                        listing lorem ipsum
                                                        dolor sit amet.
                                                    </p>
                                                    <List>
                                                        <List.Item>
                                                            - Feature Update One
                                                        </List.Item>
                                                        <List.Item>
                                                            - Feature Update One
                                                        </List.Item>
                                                        <List.Item>
                                                            - Feature Update One
                                                        </List.Item>
                                                    </List> */}
                                                    {/* <Block className="update-btn">
                                                        <Button className="primary">
                                                            View Update{' '}
                                                            <Icon name="arrow right" />
                                                        </Button>
                                                    </Block> */}
                                                </Block>
                                                <Block className="c-update-dash-btns mt-auto">
                                                    <Button
                                                        onClick={
                                                            this.prevUpdate
                                                        }
                                                        disabled={!isPrevUpdate}
                                                        className="prev-btn arrow-btn"
                                                    >
                                                        <Icon name="arrow left" />{' '}
                                                        previous
                                                    </Button>
                                                    <Button
                                                        onClick={
                                                            this.nextUpdate
                                                        }
                                                        disabled={!isNextUpdate}
                                                        className="next-btn arrow-btn float-right mt-1"
                                                    >
                                                        next{' '}
                                                        <Icon name="arrow right" />
                                                    </Button>
                                                </Block>
                                            </Block>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Block className="tips-section">
                                                <h2 className="title-head p-0 mb-4">
                                                    Tips
                                                </h2>
                                                <Block className="carousal-col">
                                                    <Carousel
                                                        // showThumbs={false}
                                                    >
                                                        {tips &&
                                                            tips.length > 0 &&
                                                            tips.map(t => (
                                                                <Block key={t.id}>
                                                                    <video
                                                                        className="w-100"
                                                                        style={
                                                                            fileContentStyle
                                                                        }
                                                                        controls
                                                                    >
                                                                        <source
                                                                            src={
                                                                                t.url
                                                                            }
                                                                        />
                                                                    </video>
                                                                </Block>
                                                            ))}
                                                    </Carousel>
                                                </Block>
                                            </Block>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Block>
                        </Block>

                        {/* <Block className="dashboard-aside-right">
                            <Block className="account-states">
                                <h2 className="title-head p-0 mb-4">
                                    Account States
                                </h2>
                                <Block className="states-blocks">
                                    <Block className="rail">
                                        <Block className="progress-header">
                                            <h3>Campaigns</h3>{' '}
                                            <Block className="counts">
                                                <span>210</span> OF 250
                                            </Block>
                                        </Block>
                                        <Progress
                                            percent={this.state.percent}
                                            indicating
                                        />
                                    </Block>
                                    <Block className="rail">
                                        <Block className="progress-header">
                                            <h3>Active Campaigns</h3>{' '}
                                            <Block className="counts">
                                                <span>11</span> OF 20
                                            </Block>
                                        </Block>
                                        <Progress
                                            percent={this.state.percent}
                                            indicating
                                        />
                                    </Block>
                                    <Block className="rail">
                                        <Block className="progress-header">
                                            <h3>Total Messages</h3>{' '}
                                            <Block className="counts">
                                                <span>123.451</span> OF 99M
                                            </Block>
                                        </Block>
                                        <Progress
                                            percent={this.state.percent}
                                            indicating
                                        />
                                    </Block>
                                    <Block className="rail">
                                        <Block className="progress-header">
                                            <h3>Comments</h3>{' '}
                                            <Block className="counts">
                                                <span>2,618</span>
                                            </Block>
                                        </Block>
                                        <Progress
                                            percent={this.state.percent}
                                            indicating
                                        />
                                    </Block>
                                </Block>
                            </Block>

                            <Block className="community-states">
                                <h2 className="title-head p-0 mb-4">
                                    Community
                                </h2>
                                <Block className="community-cols">
                                    <Block className="community-box">
                                        <Block className="img-circle">
                                            <img src={pageImage} alt="user" />
                                        </Block>
                                        <Block className="community-content">
                                            <Block className="text-content">
                                                <h3>Training with Travis</h3>
                                                <p>July 10th - 2pm Est</p>
                                            </Block>
                                            <Block className="view-icon">
                                                <a href="#">
                                                    {' '}
                                                    view{' '}
                                                    <span className="icon">
                                                        <Icon name="eye" />
                                                    </span>
                                                </a>
                                            </Block>
                                        </Block>
                                    </Block>
                                    <Block className="community-box">
                                        <Block className="img-circle">
                                            <img src={pageImage} alt="user" />
                                        </Block>
                                        <Block className="community-content">
                                            <Block className="text-content">
                                                <h3>Training with Travis</h3>
                                                <p>July 10th - 2pm Est</p>
                                            </Block>
                                            <Block className="view-icon">
                                                <a href="#">
                                                    {' '}
                                                    view{' '}
                                                    <span className="icon">
                                                        <Icon name="eye" />
                                                    </span>
                                                </a>
                                            </Block>
                                        </Block>
                                    </Block>
                                    <Block className="community-box">
                                        <Block className="img-circle">
                                            <img src={pageImage} alt="user" />
                                        </Block>
                                        <Block className="community-content">
                                            <Block className="text-content">
                                                <h3>Training with Travis</h3>
                                                <p>July 10th - 2pm Est</p>
                                            </Block>
                                            <Block className="view-icon">
                                                <a href="#">
                                                    {' '}
                                                    view{' '}
                                                    <span className="icon">
                                                        <Icon name="eye" />
                                                    </span>
                                                </a>
                                            </Block>
                                        </Block>
                                    </Block>
                                </Block>
                            </Block>
                        </Block> */}
                    </Block>
                </Block>
            </Block>
        );
    }
}

const mapStateToProps = state => ({
    // ...getEngageAddState(state),
    currentUser: state.default.auth.currentUser,
    pages: state.default.pages.pages,
    totalPages: state.default.pages.totalPages,
    totalSequences: state.default.pages.totalSequences,
    totalSubscribers: state.default.pages.totalSubscribers,
    totalRecentSubscribers: state.default.pages.totalRecentSubscribers,
    updates: state.default.pages.updates,
    tips: state.default.pages.tips
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPages
            // updateEngageInfo,
            // updateItemInfo,
            // addStepInfo,
            // updateStepInfo,
            // addEngage,
            // getTags,
            // getPageWorkflowTriggers
        },
        dispatch
    )
});
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
