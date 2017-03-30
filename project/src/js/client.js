"use strict";

import React from 'react';
import TapEventPlugin from 'react/lib/TapEventPlugin';
import EventPluginHub from 'react/lib/EventPluginHub';
import {render} from 'react-dom';
import {Router, match, RouterContext, browserHistory} from 'react-router';
import routes from './Routes';
import fetchApiData from "./fetchApiData";

EventPluginHub.injection.injectEventPluginsByName({'TapEventPlugin': TapEventPlugin});

const history = browserHistory;

const configuration = window.DATA.configurationFromNode;

const apiHost = configuration.externalServices.apiHost;

function matchLocation(location) {

  match({routes, location, history}, (error, redirectLocation, renderProps) => {

    const pageData = window.DATA.pageData;
    delete window.DATA.pageData;
    if (pageData && !_.isEmpty(pageData)) {
      let component;
      renderProps.params.configuration = configuration;
      component = <RouterContext {...renderProps} history={history}/>;
      render(component, document.getElementById('main'));
    } else {
      fetchApiData(renderProps, apiHost)
        .then(apiData => {
            apiData.status = 200;
            renderProps.params.configuration = configuration;
            renderProps.params.apiData = apiData;
            let component = <RouterContext {...renderProps} history={history}/>;
            render(component, document.getElementById('main'));
          }
        ).catch(err => {
        renderProps.params.apiData = {};
        if (err.status >= 500) {
          renderProps.params.apiData.status = 500;
        } else {
          renderProps.params.apiData.status = 404;
        }
        renderProps.params.configuration = configuration;
        let component = <RouterContext {...renderProps} />;
        render(component, document.getElementById('main'));
      });
    }

  });
}

history.listen(matchLocation);
