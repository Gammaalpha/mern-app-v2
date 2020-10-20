import { Client } from "@microsoft/microsoft-graph-client";
require('isomorphic-fetch');


export const getUserDetails = async (accessToken: any) => {
  const client: Client = getAuthenticatedClient(accessToken);

  const user = await client.api('/me').get();
  return user;
}

function getAuthenticatedClient(accessToken: any) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken)
    }
  })
  return client
}