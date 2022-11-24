import { createActions } from 'redux-actions';

const {
    getPageBroadcasts,
    getPageBroadcastsSucceed,
    getPageBroadcastsFailed,
    deleteBroadcast,
    deleteBroadcastSucceed,
    deleteBroadcastFailed,
    addBroadcast,
    addBroadcastSucceed,
    addBroadcastFailed
    // getBroadcastInfo,
    // getBroadcastInfoSucceed,
    // getBroadcastInfoFailed
} = createActions({
    GET_PAGE_BROADCASTS: pageId => ({ pageId }),
    GET_PAGE_BROADCASTS_SUCCEED: broadcasts => ({ broadcasts }),
    GET_PAGE_BROADCASTS_FAILED: error => ({ error }),
    DELETE_BROADCAST: (pageId, broadcastId) => ({ pageId, broadcastId }),
    DELETE_BROADCAST_SUCCEED: broadcastId => ({ broadcastId }),
    DELETE_BROADCAST_FAILED: error => ({ error }),
    ADD_BROADCAST: (pageId, broadcast) => ({ pageId, broadcast }),
    ADD_BROADCAST_SUCCEED: broadcastId => ({ broadcastId }),
    ADD_BROADCAST_FAILED: error => ({ error })
    // GET_BROADCAST_INFO: publicId => ({ publicId }),
    // GET_BROADCAST_INFO_SUCCEED: broadcast => ({ broadcast }),
    // GET_BROADCAST_INFO_FAILED: error => ({ error })
});

export {
    getPageBroadcasts,
    getPageBroadcastsSucceed,
    getPageBroadcastsFailed,
    deleteBroadcast,
    deleteBroadcastSucceed,
    deleteBroadcastFailed,
    addBroadcast,
    addBroadcastSucceed,
    addBroadcastFailed
    // getBroadcastInfo,
    // getBroadcastInfoSucceed,
    // getBroadcastInfoFailed
};
