import {reportingSettings} from './reportingConfig.mjs';
export const siteReporting=reportingSettings({
 propertyId:import.meta.env.PUBLIC_GA4_PROPERTY_ID,
 oauthClientId:import.meta.env.PUBLIC_GOOGLE_OAUTH_CLIENT_ID
});
