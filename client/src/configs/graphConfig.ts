import { prodCheck } from "./common";

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
    graphMeEndpoint: `${prodCheck("REACT_APP_GRAPH_ENDPOINT")}/v1.0/me`,
    graphMailEndpoint: `${prodCheck("REACT_APP_GRAPH_ENDPOINT")}/v1.0/me/messages`
};