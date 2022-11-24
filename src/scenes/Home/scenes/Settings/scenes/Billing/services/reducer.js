import { handleActions } from 'redux-actions';

import {
  getBillingInfo,
  getBillingInfoSucceed,
  getBillingInfoFailed,
  postLicense,
  postCoupon,
  postCouponSucceed,
  postCouponFailed,
  cancelSubscription,
  cancelSubscriptionSucceed,
  cancelSubscriptionFailed,
  updatePaymentInfo,
  updatePaymentInfoSucceed,
  updatePaymentInfoFailed,
  postSmsPlan,
  postSmsPlanSucceed,
  postSmsPlanFailed,
  getSmsPlan,
  getSmsPlanSucceed,
  getSmsPlanFailed
} from './actions';

const defaultState = {
  billingInfo: null,
  loading: false,
  error: null,
  price: null,
  loadingCoupon: false,
  errorCoupon: null,
  smsPlan: null,
};

const reducer = handleActions(
  {
    [getBillingInfo](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [postLicense](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [getBillingInfoSucceed](
      state,
      {
        payload: { billingInfo }
      }
    ) {
      return {
        ...state,
        billingInfo,
        loading: false,
        error: null
      };
    },
    [getBillingInfoFailed](
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
    [postCoupon](state) {
      return {
        ...state,
        price: null,
        loadingCoupon: true,
        errorCoupon: null
      };
    },
    [postCouponSucceed](
      state,
      {
        payload: { price }
      }
    ) {
      return {
        ...state,
        price,
        loadingCoupon: false,
        errorCoupon: null
      };
    },
    [postCouponFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loadingCoupon: false,
        errorCoupon: error
      };
    },
    [cancelSubscription](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [cancelSubscriptionSucceed](state) {
      return {
        ...state,
        billingInfo: {},
        loading: false,
        error: null
      };
    },
    [cancelSubscriptionFailed](
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
    [updatePaymentInfo](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [updatePaymentInfoSucceed](
      state,
      {
        payload: { billingInfo }
      }
    ) {
      return {
        ...state,
        billingInfo,
        loading: false,
        error: null
      };
    },
    [updatePaymentInfoFailed](
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
    [postSmsPlan](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [postSmsPlanSucceed](
      state,
      {
        payload: { billingInfo }
      }
    ) {
      return {
        ...state,
        // billingInfo,
        loading: false,
        error: null
      };
    },
    [postSmsPlanFailed](
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
    [getSmsPlan](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [getSmsPlanSucceed](
      state,
      {
        payload: { smsPlan }
      }
    ) {
      return {
        ...state,
        smsPlan,
        loading: false,
        error: null
      };
    },
    [getSmsPlanFailed](
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
    }
  },
  defaultState
);

export default reducer;
