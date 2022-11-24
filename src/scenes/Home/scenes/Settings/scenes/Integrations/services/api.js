import { wrapRequest, xapi, snakeCaseKeys } from 'services/utils';

const getIntegrationTypes = wrapRequest(async () =>
  xapi().get('integrations/types')
);

const getIntegrations = wrapRequest(async pageId =>
  xapi(false).get(`pages/${pageId}/integrations`)
);

const addIntegration = wrapRequest(async (pageId, data) =>
  xapi(false).post(`pages/${pageId}/integrations`, {
    ...snakeCaseKeys(data)
  })
);

const updateIntegration = wrapRequest(async (pageId, integrationId, data) =>
  xapi(false).put(`pages/${pageId}/integrations/${integrationId}`, {
    ...snakeCaseKeys(data)
  })
);

const deleteIntegration = wrapRequest(async (pageId, integrationId) =>
  xapi(false).delete(`pages/${pageId}/integrations/${integrationId}`)
);

export {
  getIntegrationTypes,
  getIntegrations,
  addIntegration,
  updateIntegration,
  deleteIntegration
};
