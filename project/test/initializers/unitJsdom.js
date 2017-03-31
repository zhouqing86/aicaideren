require("babel-polyfill");
require("babel-register")({
  presets: ['react', 'es2015', 'stage-0']
});
var jsdom = require('jsdom');

var TapEventPlugin = require('react/lib/TapEventPlugin');
var EventPluginHub = require('react/lib/EventPluginHub');

// This injection is a workaround for https://github.com/airbnb/enzyme/issues/99
// This code must be executed before importing enzyme!
EventPluginHub.injection.injectEventPluginsByName({'TapEventPlugin': TapEventPlugin});

// Workaround for https://github.com/airbnb/enzyme/issues/58 and https://github.com/airbnb/enzyme/issues/68
global.document = jsdom.jsdom('');
global.window = document.defaultView;
global.navigator = window.navigator;