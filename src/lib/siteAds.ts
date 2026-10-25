import {decideAds} from './adsConfig.mjs';
/** Compile-time advertising configuration. No third-party ad request unless fully enabled. */
export const siteAds=decideAds({
 publisherId:import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID,
 adsEnabled:import.meta.env.PUBLIC_ADSENSE_ADS_ENABLED,
 cmpReady:import.meta.env.PUBLIC_ADSENSE_CMP_READY,
 homeSlot:import.meta.env.PUBLIC_ADSENSE_HOME_SLOT,
 toolSlot:import.meta.env.PUBLIC_ADSENSE_TOOL_SLOT
});
