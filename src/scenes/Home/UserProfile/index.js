import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserProfile, saveUserInfo, getUserFollowInfo, followUser, getUserTemplateInfo, getUserSalesInfo } from './services/actions';
import defaultImage from 'assets/images/subscriber.png';
import UserIcon from 'assets/images/user.png';
import Swal from 'sweetalert2';
import UserInfo from './components/UserInfo';
import SocialLinks from './components/SocialLinks';
import FollowButtons from './components/FollowButtons';
import Echo from 'laravel-echo';
import NumericalInfo from './components/NumericalInfo';
import ListTemplates from './components/ListTemplates';
import SalesChart from './components/SalesChart';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import './style.scss';

class UserProfile extends React.Component {
  _echo;
  constructor(props) {
    super(props);
    this.state = {
      user: {
        profileImage: null,
        name: null,
        email: null
      },
      isAdmin: false,
      followInfo: null,
      newNotification: {}
    };

    this._echo = new Echo( {
      broadcaster: 'pusher',
      key: process.env.REACT_APP_PUSHER_API_KEY,
      authEndpoint: `${process.env.REACT_APP_API_URL}/pusher/auth`,
      auth: {
        headers: {
          Authorization: `Token ${this.props.apiToken}`,
          Accept: 'application/json'
        }
      },
      cluster: 'us2',
      forceTLS: true
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user, loading, error, followInfo, templateInfo, salesInfo } = nextProps;

    let salesChartData = {};
    if (!!salesInfo && !!salesInfo.salesByMonth) {
      salesInfo.salesByMonth.map((s) => {
        salesChartData[moment().year(s.year).month(s.month - 1).format('YYYY MM')] = s.data;
      })
    }
    const totalSales = !!salesInfo && salesInfo.totalSales;

    this.setState({ user, followInfo, templateInfo, salesChartData,totalSales });

    if (!!nextProps.currentUser) {
      const userId = nextProps.match.params.userId;
      if (nextProps.currentUser.userId + '' === userId + '')
        this.setState({ isAdmin: true});
      else this.setState({ isAdmin: false});
    }
    if ((!user || (user && Object.keys(user).length === 0)) && loading) {
      Swal({
        name: 'Please wait...',
        text: 'We are loading user data...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (!loading && error) {
      Swal.fire({
        type: 'error',
        name: 'Oops...',
        text: error || 'Something went wrong! Please try again.'
      });
    } else {
      this.setState({ editableUserInfo: false});
      Swal.close();
    }
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.props.actions.getUserProfile(userId);
    this.props.actions.getUserFollowInfo(userId);
    this.props.actions.getUserTemplateInfo(userId);
    this.props.actions.getUserSalesInfo(userId);

    this._echo.private(`App.User.${userId}`).notification((data) => {
      console.log('echo: ', data);
    })

    document.getElementById('main').style.overflow = "auto";
  }

  handleSaveUserInfo = (editUser) => {
    const userId = this.props.match.params.userId;
    const { user } = this.state;
    console.log('editUser: ', editUser);
    this.props.actions.saveUserInfo(userId, {...user, ...editUser});
  }

  handleFollow = () => {
    const userId = this.props.match.params.userId;
    this.props.actions.followUser(userId);
  }

  render() {
    const { user, isAdmin, followInfo, templateInfo, salesChartData, totalSales } = this.state;
    const profileImg = user && user.profileImage;
    console.log('isAdmin: ', isAdmin);

    const isFollowed = !!followInfo && !!followInfo.followers && followInfo.followers.filter((element) => !!this.props.currentUser && element.follower_uid+'' === this.props.currentUser.userId+'').length > 0;

    return (
      <div className="profile-container">
        <Link to="/" className="close-icon"><Icon name='close'/></Link>
        {!!user ? <div className="sub-container">
          <div className="user-information">
            {profileImg && <img className="user-avatar" src={profileImg}/>}
            {!profileImg && <img className="user-avatar" src={UserIcon}/>}
            <div className="info-section">
              <div className="section-body">
                <UserInfo user={user} pageEditable={isAdmin} saveUser={this.handleSaveUserInfo}/>
                <SocialLinks user={user} pageEditable={isAdmin} saveUser={this.handleSaveUserInfo}/>
              </div>
              <div className="section-body">
                <FollowButtons isAdmin={isAdmin} followInfo={followInfo} onFollow={this.handleFollow} isFollowed={isFollowed}/>
              </div>
            </div>
          </div> 
          <div className="user-statistics">
            <div className="badges"></div>
            {templateInfo ? <div className="numerical-info">
              <div className="info-title">My templates</div>
              <NumericalInfo templateInfo={templateInfo}/>
            </div> : null}
            <div className="statistics-view">
              <div className="templates-view"> 
              {!!templateInfo && !!templateInfo.templates ? 
                <ListTemplates templates={templateInfo.templates}/>
              : null }
              </div>
              <div className="graph-view">
                <SalesChart chartData={salesChartData} totalSales={totalSales}/>
              </div>
            </div>
          </div>
        </div>: null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  apiToken: state.default.auth.apiToken,
  user: state.default.scenes.userProfile.userProfile,
  loading: state.default.scenes.userProfile.loading,
  error: state.default.scenes.userProfile.error,
  followInfo: state.default.scenes.userProfile.followInfo,
  templateInfo: state.default.scenes.userProfile.templateInfo,
  salesInfo: state.default.scenes.userProfile.salesInfo,
  currentUser: state.default.auth.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    getUserProfile,
    saveUserInfo,
    getUserFollowInfo,
    followUser,
    getUserTemplateInfo,
    getUserSalesInfo
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);