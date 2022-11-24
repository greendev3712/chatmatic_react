import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import { NavLink, withRouter } from 'react-router-dom';

import iconActiveSub from 'assets/images/icon-active-chat.png';
import iconDeactiveSub from 'assets/images/icon-deactive-chat.png';
import iconActiveCampaign from 'assets/images/icon-active-campaign.png';
import iconDeactiveCampaign from 'assets/images/icon-deactive-campaign.png';
import iconActiveEngage from 'assets/images/icon-active-engage.png';
import iconDeactiveEngage from 'assets/images/icon-deactive-engage.png';
import trainingIcon from 'assets/images/icon-training.png';
import iconDeactiveSettings from 'assets/images/icon-deactive-settings.png';
import iconActiveSettings from 'assets/images/icon-active-settings.png';
import PurchaseLicense from '../PurchaseLicense/PurchaseLicense';
import pageImage from 'assets/images/Ellipse1.png';
import { Popup } from 'semantic-ui-react';
import { Svg, Block } from '../../Layout';
/** Import assets */
import './sidebar.css';

class Sidebar extends React.Component {
    state = {
        showPages: false
    };

    togglePageMenu = e => {
        e.preventDefault();
        this.setState(({ showPages }) => ({
            showPages: !showPages
        }));
    };

    openPage = pageId => {
        this.setState(({ showPages }) => ({
            showPages: !showPages
        }));
        this.props.history.push(`/page/${pageId}`);
    };

    render() {
        const props = this.props;
        const { showPages } = this.state;
        const {
            pages: { pages }
        } = props;
        const id = props.match.params.id;
        const subscriberIcon = this.props.location.pathname.startsWith(
            `/page/${id}/subscribers`
        )
            ? iconActiveSub
            : iconDeactiveSub;
        const campaignIcon = this.props.location.pathname.startsWith(
            `/page/${id}/campaigns`
        )
            ? iconActiveCampaign
            : iconDeactiveCampaign;
        const engageIcon = this.props.location.pathname.startsWith(
            `/page/${id}/engages`
        )
            ? iconActiveEngage
            : iconDeactiveEngage;
        const settingsIcon = this.props.location.pathname.startsWith(
            `/page/${id}/settings`
        )
            ? iconActiveSettings
            : iconDeactiveSettings;

        // console.log('pages', pages);
        let activePage = null;
        let inactivePages = pages;
        if (pages) {
            activePage = pages.find(p => p.uid === Number(id));
            inactivePages = pages.filter(p => p.uid !== Number(id));
        }
        // console.log('activePage', activePage, showPages, id);

        return (
            <React.Fragment>
                <Menu {...props} menuClassName="shadow-sm sidebar-container">
                    <ul className="sidebar-menu-container card p-2 list-group list-group-flush text-center d-flex flex-column align-items-start shadow-sm">
                        {activePage && activePage.uid && (
                            <NavLink
                                activeClassName="active"
                                to={`#`}
                                className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column"
                                onClick={this.togglePageMenu}
                            >
                                <Block className="pn-img">
                                    <img
                                        src={`https://graph.facebook.com/${activePage.fbId}/picture?type=small`}
                                        alt=""
                                        className="align-self-center"
                                    />
                                </Block>
                                <small className="mt-2">
                                    {activePage.fbName}
                                    <i
                                        aria-hidden="true"
                                        className="triangle down icon"
                                    ></i>
                                </small>
                            </NavLink>
                        )}

                        <Block
                            className={`p-sidebar-main ${
                                showPages ? 'show' : ''
                            }`}
                        >
                            {inactivePages &&
                                inactivePages.map(p => (
                                    <Block
                                        key={p.uid}
                                        className="p-sidebar-inner"
                                        onClick={() => this.openPage(p.uid)}
                                    >
                                        <Block className="pn-img">
                                            <img
                                                src={`https://graph.facebook.com/${p.fbId}/picture?type=small`}
                                                alt=""
                                                className="align-self-center"
                                            />
                                        </Block>
                                        <small className="mt-2">
                                            {p.fbName}
                                        </small>
                                    </Block>
                                ))}
                        </Block>

                        <NavLink
                            activeClassName="active"
                            to={`/page/${id}/subscribers`}
                            className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column"
                        >
                            <img
                                src={subscriberIcon}
                                alt=""
                                className="align-self-center"
                            />
                            <small className="mt-2">SUBSCRIBERS</small>
                        </NavLink>

                        {/* <Popup
                            trigger={<NavLink
                            activeClassName="active"
                            to={`/page/${id}/campaigns`}
                            className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column border-top-0"
                        >
                            <img
                                src={campaignIcon}
                                alt=""
                                className="align-self-center"
                            />
                        </NavLink>}
                            content='CAMPAIGNS'
                            inverted
                            offset='-50px, 0px'
                            position='bottom left'
                            />
                            

                         <NavLink
                            activeClassName="active"
                            to={`/page/${id}/engages`}
                            className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column border-top-0"
                        >
                            <img
                                src={engageIcon}
                                alt=""
                                className="align-self-center"
                            />
                            <small className="mt-2">ENGAGE</small>
                        </NavLink> */}

                        <NavLink
                            activeClassName="active"
                            to={`/page/${id}/triggers`}
                            className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column border-top-0"
                        >
                            <img
                                src={campaignIcon}
                                alt=""
                                className="align-self-center"
                            />
                            <small className="mt-2">TRIGGERS</small>
                        </NavLink>

                        <NavLink
                            activeClassName="active"
                            to={`/page/${id}/broadcasts`}
                            className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column border-top-0"
                        >
                            {/* <img
                                src={engageIcon}
                                alt=""
                                className="align-self-center"
                            /> */}
                            <Svg name="broadcastIcon" />
                            <small className="mt-2">BROADCASTS</small>
                        </NavLink>
                        <NavLink
                            activeClassName="active"
                            to={`/page/${id}/workflows`}
                            className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column border-top-0"
                        >
                            <img
                                src={engageIcon}
                                alt=""
                                className="align-self-center"
                            />
                            <small className="mt-2">WORKFLOWS</small>
                        </NavLink>

                        <a
                            className="px-1 py-3 list-group-item mt-auto list-group-item-action d-flex flex-column"
                            href="https://members.chatmatic.com/training"
                            target="_blank"
                        >
                            <img
                                src={trainingIcon}
                                alt=""
                                className="align-self-center"
                            />
                            <small className="mt-2">TRAINING</small>
                        </a>
                        <NavLink
                            exact={true}
                            activeClassName="active"
                            to={`/page/${id}/settings`}
                            className="px-1 py-3 list-group-item border-bottom-0 list-group-item-action d-flex flex-column border-top-0"
                        >
                            <img
                                src={settingsIcon}
                                alt=""
                                className="align-self-center"
                            />
                            <small className="mt-2">SETTINGS</small>
                        </NavLink>
                    </ul>
                </Menu>
                <PurchaseLicense />
            </React.Fragment>
        );
    }
}

export default withRouter(connect(
    state => ({
        // auth: state.default.auth,
        pages: state.default.pages
    }),
    dispatch => ({
        actions: bindActionCreators(
            {
                // getPages,
                // logout
            },
            dispatch
        )
    })
)(Sidebar));
