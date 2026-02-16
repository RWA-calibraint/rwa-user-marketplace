import mixpanel from 'mixpanel-browser';

import { ENV_CONFIGS } from '@helpers/constants/configs/env-vars';

const MIXPANEL_TOKEN = ENV_CONFIGS.MIXPANEL_TOKEN;

let isInitialized = false;

export const initMixpanel = () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    mixpanel.init(MIXPANEL_TOKEN, { debug: false });
    isInitialized = true;
  }
};

export default mixpanel;
