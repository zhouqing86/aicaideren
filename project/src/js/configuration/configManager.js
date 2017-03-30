"use strict";

const configFilesBaseUrl = './';
const defaultConfigFilename = 'local';

let config;

const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV) {
  try {
    const configFilePath = configFilesBaseUrl + (NODE_ENV || defaultConfigFilename);
    config = require(configFilePath).default;
  } catch (e) {
    console.warn(e.message); // eslint-disable-line no-console
    config = require(configFilesBaseUrl + defaultConfigFilename).default;
  }
} else {
  config = require(configFilesBaseUrl + defaultConfigFilename).default;
}

export default config;
