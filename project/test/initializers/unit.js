require("babel-polyfill");
require("babel-register")({
  presets: ['react', 'es2015', 'stage-0']
});

var TapEventPlugin = require('react/lib/TapEventPlugin');
var EventPluginHub = require('react/lib/EventPluginHub');

// This injection is a workaround for https://github.com/airbnb/enzyme/issues/99
// This code must be executed before importing enzyme!
EventPluginHub.injection.injectEventPluginsByName({'TapEventPlugin': TapEventPlugin});
