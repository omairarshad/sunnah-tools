import {decideAds} from './adsConfig.mjs';
import {ADSENSE_SITE_PUBLISHER_ID} from './adsIdentity.mjs';
/** Single publisher identity for verification and later advertising.
 * A stale GitHub variable from a previous rejected application must never
 * silently override the verified AdSense for YouTube publisher ID.
 * No third-party ad request unless all ad-serving prerequisites are enabled.
 */
export const siteAds=decideAds({
 publisherId:ADSENSE_SITE_PUBLISHER_ID,
 adsEnabled:import.meta.env.PUBLIC_ADSENSE_ADS_ENABLED,
 siteReady:import.meta.env.PUBLIC_ADSENSE_SITE_READY,
 cmpReady:import.meta.env.PUBLIC_ADSENSE_CMP_READY,
 homeSlot:import.meta.env.PUBLIC_ADSENSE_HOME_SLOT,
 toolSlot:import.meta.env.PUBLIC_ADSENSE_TOOL_SLOT
});
