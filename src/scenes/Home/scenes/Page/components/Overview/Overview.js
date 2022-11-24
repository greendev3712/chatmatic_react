import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

/** Import selectors */
import { getPageFromUrl } from 'services/pages/selector';

/**import assets */
import viceImg from 'assets/images/vice.png';

class Overview extends React.Component {
  render() {
    if (this.props.page) {
      const {
        fbName,
        comments,
        subscribers,
        pageLikes,
        fbCoverPhoto,
        fbPageToken,
        fbId,
        activeTriggers
      } = this.props.page;
      const fbPageCoverPhoto =
        fbCoverPhoto &&
        fbCoverPhoto !== 'not-connected' &&
        fbCoverPhoto !== 'no-token'
          ? fbCoverPhoto
          : viceImg;

      return (
        <div className="card w-100">
          <img
            src={fbPageCoverPhoto}
            alt=""
            className="card-img-top"
            data-aos="fade"
          />
          <div className="d-flex justify-content-between align-items-center card-header">
            <h4 className="m-0">{fbName}</h4>
            <span>
              https://m.me/
              {fbId}
            </span>
          </div>
          <div className="card-body d-flex justify-content-around align-items-center">
            <div className="d-flex flex-column text-center">
              <strong>{subscribers}</strong>{' '}
              <small className="text-muted">SUBSCRIBERS</small>
            </div>
            <span className="vertical-line" />
            <div className="d-flex flex-column text-center">
              <strong>{activeTriggers}</strong>{' '}
              <small className="text-muted">ACTIVE TRIGGERS</small>
            </div>
            <span className="vertical-line" />
            <div className="d-flex flex-column text-center">
              <strong>{comments}</strong>{' '}
              <small className="text-muted">PAGE COMMENTS</small>
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default withRouter(
  connect(
    (state, props) => ({
      page: getPageFromUrl(state, props)
    }),
    null
  )(Overview)
);
