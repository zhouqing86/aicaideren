'use strict';

import _ from 'lodash';

const serverConfig = {
  listeningHost: '0.0.0.0',
  listeningPort: 8000,
  externalServices: {
    apiHost: 'https://api.aicaidere.com'
  },
  generateConfigurationForBrowser() {
    return {
      domain: "localhost",
      assetsMappings: {
        "js/vendor.js": "js/vendor-dev.js",
        "js/main.js": "js/main-dev.js",
        "css/main.css": "css/main-dev.css"
      },
      externalServices: this.externalServices
    };
  }
};

const externalServicesForClientSide = {
  apiHost: 'https://api.aicaideren.com'
};

let clientConfig = _.merge({},serverConfig);
clientConfig.externalServices = _.merge({}, serverConfig.externalServices, externalServicesForClientSide);

export default {
  serverConfig,
  clientConfig,
};
