import {analyticsSettings} from './analyticsConfig.mjs';
export const siteAnalytics=analyticsSettings({
 measurementId:import.meta.env.PUBLIC_GA4_MEASUREMENT_ID,
 enabled:import.meta.env.PUBLIC_GA4_ENABLED,
 dashboardUrl:import.meta.env.PUBLIC_LOOKER_STUDIO_REPORT_URL
});
