import { put, takeLatest, call } from 'redux-saga/effects';

import * as apis from './api';
import {
  getBillingInfoSucceed,
  getBillingInfoFailed,
  postCouponSucceed,
  postCouponFailed,
  cancelSubscriptionSucceed,
  cancelSubscriptionFailed,
  updatePaymentInfoSucceed,
  updatePaymentInfoFailed,
  postSmsPlanSucceed,
  postSmsPlanFailed,
  getSmsPlanSucceed,
  getSmsPlanFailed
} from './actions';
import { convertObjectKeyToCamelCase, errorMsg } from 'services/utils';

export function* billingSubscriber() {
  yield takeLatest('GET_BILLING_INFO', getPageBillingInfo);
  yield takeLatest('POST_LICENSE', postLicense);
  yield takeLatest('POST_COUPON', postCoupon);
  yield takeLatest('CANCEL_SUBSCRIPTION', cancelSubscription);
  yield takeLatest('UPDATE_PAYMENT_INFO', updatePaymentInfo);
  yield takeLatest('POST_SMS_PLAN', postSmsPlan);
  yield takeLatest('GET_SMS_PLAN', getSmsPlan);
}

export function* getPageBillingInfo({ payload: { pageId } }) {
  try {
    const response = yield call(apis.getBillingInfo, pageId);

    yield put(
      getBillingInfoSucceed(
        convertObjectKeyToCamelCase(response.data).billingInfo
      )
    );
  } catch (error) {
    yield put(getBillingInfoFailed(errorMsg(error)));
  }
}

export function* postLicense({ payload: { pageId, data } }) {
  try {
    const response = yield call(apis.postLicense, pageId, data);

    yield put(
      getBillingInfoSucceed(
        convertObjectKeyToCamelCase(response.data).billingInfo
      )
    );
  } catch (error) {
    yield put(getBillingInfoFailed(errorMsg(error)));
  }
}

export function* postCoupon({ payload: { pageId, plan, coupon } }) {
  try {
    const response = yield call(apis.postCoupon, pageId, plan, coupon);

    yield put(postCouponSucceed(response.data.price));
  } catch (error) {
    yield put(postCouponFailed(errorMsg(error)));
  }
}

export function* cancelSubscription({ payload: { pageId } }) {
  try {
    yield call(apis.cancelSubscription, pageId);

    yield put(cancelSubscriptionSucceed());
  } catch (error) {
    yield put(cancelSubscriptionFailed(errorMsg(error)));
  }
}

export function* updatePaymentInfo({ payload: { pageId, source } }) {
  try {
    const response = yield call(apis.updatePaymentInfo, pageId, source);

    yield put(
      updatePaymentInfoSucceed(
        convertObjectKeyToCamelCase(response.data).billingInfo
      )
    );
  } catch (error) {
    yield put(updatePaymentInfoFailed(errorMsg(error)));
  }
}

export function* postSmsPlan({ payload: { pageId, data } }) {
  try {
    const response = yield call(apis.postSmsPlan, pageId, data);

    const { phoneNumber } = convertObjectKeyToCamelCase(response.data);

    yield put(
      postSmsPlanSucceed(
        {
          phoneNumber
        }
      )
    );
  } catch (error) {
    yield put(postSmsPlanFailed(errorMsg(error)));
  }
}

export function* getSmsPlan({ payload: { pageId } }) {
  try {
    const response = yield call(apis.getSmsPlan, pageId);
    const { phoneNumber, smsHistory, autorenew, smsResume } = convertObjectKeyToCamelCase(response.data);
    yield put(
      getSmsPlanSucceed(
        {
          phoneNumber,
          smsHistory,
          autorenew,
          smsResume
        }
      )
    );
  } catch (error) {
    yield put(getSmsPlanFailed(errorMsg(error)));
  }
}
