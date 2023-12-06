// src/plugins/posthog.js
import posthog from 'posthog-js';

export default {
  install(app) {
    app.config.globalProperties.$posthog = posthog.init(
      'phc_PRiX4yl6wqrsrop7CCGRTkbzYqqR2C1XA4io5R7nl0a',
      {
        api_host: 'https://app.posthog.com',
      },
    );
  },
};
