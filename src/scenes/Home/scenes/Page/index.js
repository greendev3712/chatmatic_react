import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

import Overview from './components/Overview/Overview';
import Subscribers from './components/Subscribers/Subscribers';
import NewDetails from './components/NewDetails';

import { getPagePosts } from 'services/pages/pagesActions';
import { getPageFromUrl } from 'services/pages/selector';

import './styles.css';

class Page extends React.Component {
    componentWillMount() {
        this.props.getPagePosts(parseInt(this.props.match.params.id, 10));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            nextProps.match.params.id &&
            this.props.match.params.id !== nextProps.match.params.id
        ) {
            nextProps.getPagePosts(parseInt(nextProps.match.params.id, 10));
        }

        if (nextProps.page.loading) {
            Swal({
                title: 'Please wait...',
                text: 'We are generating a listing of your pages...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });

            return <div />;
        } else if (this.props.page.loading) {
            Swal.close();

            if (nextProps.error) {
                toastr.error('Page Loading Error', nextProps.error);
            }
        }

        if (this.props.page.tokenError === undefined && nextProps.page.tokenError === true) {
            toastr.error('Page token not found', 'There is an issue with your Page Token which means your bot is currently not functioning. Please go to "Settings > Admin > Disable Page Bot" and then go back to the dashboard and "Add New Page" and re-add it. You will not lose any of your sequences or triggers, everything will be working immediately after', { position: 'top-right', timeOut: 10000 });
        }
    }

    render() {
        if (!this.props.page) {
            return <Redirect to="/404" />;
        }
        console.log('page: ', this.props.page);

        return (
            <div className="outer-main-padding">
                <div className="fanpage-home-container mt-0">
                    <div className="d-flex flex-column">
                        <div className="d-flex homepage-top-container">
                            <div
                                className="d-flex align-items-stretch px-0 user-info-container mr-1"
                                data-aos="fade"
                                data-aos-delay="100"
                            >
                                <Overview />
                            </div>
                            <div
                                className="d-flex align-items-stretch px-0 subscribers-chart-container"
                                data-aos="fade"
                                data-aos-delay="200"
                            >
                                <Subscribers />
                            </div>
                        </div>
                        {/* <Details /> */}
                        <NewDetails />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => ({
        page: getPageFromUrl(state, props),
        error: state.default.pages.error
    }),
    dispatch => ({
        getPagePosts: bindActionCreators(getPagePosts, dispatch)
    })
)(Page);
