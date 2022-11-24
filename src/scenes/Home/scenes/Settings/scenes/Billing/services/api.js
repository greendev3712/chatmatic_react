import { wrapRequest, xapi, snakeCaseKeys } from 'services/utils';

export const getBillingInfo = wrapRequest(async pageId =>
  xapi(false).get(`pages/${pageId}/billing-info`)
);

export const postLicense = wrapRequest(async (pageId, data) =>
  xapi(false).post(`pages/${pageId}/license`, snakeCaseKeys(data))
);

export const postCoupon = wrapRequest(async (pageId, plan, coupon) =>
  xapi(false).post(`pages/${pageId}/coupon-check`, {
    plan,
    coupon
  })
);

export const cancelSubscription = wrapRequest(async pageId =>
  xapi(false).delete(`pages/${pageId}/license`)
);

export const updatePaymentInfo = wrapRequest(async (pageId, src) =>
  xapi(false).patch(`pages/${pageId}/license`, {
    src
  })
);

export const postSmsPlan = wrapRequest(async (pageId, data) =>
  xapi(false).post(`pages/${pageId}/sms/purchase`, snakeCaseKeys(data))
);

export const getSmsPlan = wrapRequest(async (pageId) =>
  xapi(false).get(`pages/${pageId}/sms`)
);
