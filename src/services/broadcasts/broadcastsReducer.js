import { handleActions } from 'redux-actions';

import {
    getPageBroadcasts,
    getPageBroadcastsSucceed,
    getPageBroadcastsFailed,
    deleteBroadcast,
    deleteBroadcastSucceed,
    deleteBroadcastFailed,
    addBroadcast,
    addBroadcastSucceed,
    addBroadcastFailed
} from './broadcastsActions';

const defaultState = {
    loading: false,
    error: null,
    broadcasts: [],
    uid: null
    // broadcastFromPublicId: {}
};

const reducer = handleActions(
    {
        [getPageBroadcasts](state) {
            return {
                ...state,
                error: null,
                loading: true
            };
        },
        [getPageBroadcastsSucceed](state, { payload: { broadcasts } }) {
            return {
                ...state,
                error: null,
                loading: false,
                broadcasts
            };
        },
        [getPageBroadcastsFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [deleteBroadcast](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [deleteBroadcastSucceed](state, { payload: { broadcastId } }) {
            const broadcasts = state.broadcasts.filter(
                broadcast => broadcast.uid !== broadcastId
            );

            return {
                ...state,
                broadcasts,
                loading: false,
                error: null
            };
        },
        [deleteBroadcastFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [addBroadcast](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [addBroadcastSucceed](state, { payload: { broadcastId } }) {
            // const broadcasts = state.broadcasts.filter(
            //     broadcast => broadcast.uid !== broadcastId
            // );

            return {
                ...state,
                uid: broadcastId,
                loading: false,
                error: null
            };
        },
        [addBroadcastFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        }
        // [getBroadcastInfo](state) {
        //     return {
        //         ...state,
        //         broadcastFromPublicId: {},
        //         error: null,
        //         loading: true
        //     };
        // },
        // [getBroadcastInfoSucceed](state, { payload: { broadcast } }) {
        //     return {
        //         ...state,
        //         error: null,
        //         loading: false,
        //         broadcastFromPublicId: broadcast
        //     };
        // },
        // [getBroadcastInfoFailed](state, { payload: { error } }) {
        //     return {
        //         ...state,
        //         error,
        //         loading: false
        //     };
        // }
    },
    defaultState
);

export default reducer;
