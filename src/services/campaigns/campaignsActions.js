import { createActions } from 'redux-actions';

const {
  getPageCampaigns,
  getPageCampaignsSucceed,
  getPageCampaignsFailed,
  deleteCampaign,
  deleteCampaignSucceed,
  deleteCampaignFailed,
  getCampaignInfo,
  getCampaignInfoSucceed,
  getCampaignInfoFailed
} = createActions({
  GET_PAGE_CAMPAIGNS: pageId => ({ pageId }),
  GET_PAGE_CAMPAIGNS_SUCCEED: campaigns => ({ campaigns }),
  GET_PAGE_CAMPAIGNS_FAILED: error => ({ error }),
  DELETE_CAMPAIGN: (pageId, campaignId) => ({ pageId, campaignId }),
  DELETE_CAMPAIGN_SUCCEED: campaignId => ({ campaignId }),
  DELETE_CAMPAIGN_FAILED: error => ({ error }),
  GET_CAMPAIGN_INFO: publicId => ({ publicId }),
  GET_CAMPAIGN_INFO_SUCCEED: campaign => ({ campaign }),
  GET_CAMPAIGN_INFO_FAILED: error => ({ error })
});

export {
  getPageCampaigns,
  getPageCampaignsSucceed,
  getPageCampaignsFailed,
  deleteCampaign,
  deleteCampaignSucceed,
  deleteCampaignFailed,
  getCampaignInfo,
  getCampaignInfoSucceed,
  getCampaignInfoFailed
};
