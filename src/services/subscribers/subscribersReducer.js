import { handleActions } from 'redux-actions';

import {
  clearPageSubscribers,
  getPageSubscribers,
  getPageSubscribersBroadcastCount,
  getPageSubscribersBroadcastCountSucceed,
  getPageSubscribersFailed,
  getPageSubscribersSucceed,
  getSubscribersHistory,
  getSubscribersHistorySucceed,
  getSubscribersHistoryFailed,
  updateActiveSubscriberSucceed,
  updateActiveSubscriberFailed,
  getSubscriberInfo,
  getSubscriberInfoSucceed,
  getSubscriberInfoFailed,
  updateSubscriberInfoSucceed,
  updateSubscriberInfoFailed,
  getExportSubscribers,
  getExportSubscribersSucceed,
  getExportSubscribersFailed
} from './subscribersActions';

const defaultState = {
  broadCastSubscribersCount: 0,
  subscribers: [],
  loading: false,
  error: null,
  paging: null,
  subscribersHistory: [],
  activeSubscriberId: null,
  loadingExportSubscribers: false,
  exportSubscribers: []
};

const reducer = handleActions(
  {
    [clearPageSubscribers](state) {
      return {
        ...state,
        paging: null,
        activeSubscriberId: null,
        subscribers: []
      };
    },
    [getPageSubscribers](state) {
      return {
        ...state,
        activeSubscriberId: null,
        loading: true,
        error: null
      };
    },
    [getPageSubscribersBroadcastCount](state) {
      return {
        ...state,
        broadCastSubscribersCount: 0,
        loading: true,
        error: null
      };
    },
    [getPageSubscribersBroadcastCountSucceed](
      state,
      {
        payload: { broadCastSubscribersCount }
      }
    ) {
      return {
        ...state,
        broadCastSubscribersCount,
        loading: false,
        error: null
      };
    },
    [getPageSubscribersFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error
      };
    },
    [getPageSubscribersSucceed](
      state,
      {
        payload: { subscribers, paging }
      }
    ) {
      return {
        ...state,
        paging,
        subscribers: [...state.subscribers, ...subscribers],
        loading: false,
        error: null
      };
    },
    [getSubscribersHistory](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [getSubscribersHistorySucceed](
      state,
      {
        payload: { subscribersHistory }
      }
    ) {
      return {
        ...state,
        subscribersHistory,
        loading: false,
        error: null
      };
    },
    [getSubscribersHistoryFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error
      };
    },
    [updateActiveSubscriberSucceed](
      state,
      {
        payload: { subscriberId, activeStatus }
      }
    ) {
      return {
        ...state,
        activeSubscriberId: activeStatus ? subscriberId : null
      };
    },
    [updateActiveSubscriberFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        error
      };
    },
    [getSubscriberInfo](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [getSubscriberInfoSucceed](
      state,
      {
        payload: { subscriberId, data }
      }
    ) {
      const subscribers = state.subscribers.map(subscriber => {
        if (subscriber.uid !== subscriberId) return subscriber;

        return {
          ...subscriber,
          ...data
        };
      });

      return {
        ...state,
        subscribers,
        loading: false,
        error: null
      };
    },
    [getSubscriberInfoFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error
      };
    },
    [updateSubscriberInfoSucceed](
      state,
      {
        payload: { subscriberId, data }
      }
    ) {
      const subscribers = state.subscribers.map(subscriber => {
        if (subscriber.uid !== subscriberId) return subscriber;

        return {
          ...subscriber,
          ...data
        };
      });

      return {
        ...state,
        subscribers
      };
    },
    [updateSubscriberInfoFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        error
      };
    },
    [getExportSubscribers](state) {
      return {
        ...state,
        loadingExportSubscribers: true,
        error: null
      };
    },
    [getExportSubscribersFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loadingExportSubscribers: false,
        error
      };
    },
    [getExportSubscribersSucceed](
      state,
      {
        payload: { subscribers }
      }
    ) {
      return {
        ...state,
        exportSubscribers: subscribers,
        loadingExportSubscribers: false,
        error: null
      };
    }
  },
  defaultState
);

export default reducer;
