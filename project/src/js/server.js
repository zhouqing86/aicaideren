"use strict";

import path from 'path';
import compression from 'compression';
import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {render} from 'react-dom';
import {Router, Route, DefaultRoute, Redirect, NotFoundRoute, match, RouterContext} from 'react-router';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import routes from './Routes';
import pkg from '../../package.json';
import diagnosticMidware from './diagnostics';
import configManager from './configuration/configManager';
import fetchApiData from "./fetchApiData";
import serverSidePage from "./serverSidePage.js";


const app = express();

// compress all requests
app.use(compression());

app.use(cookieParser());

app.use(useragent.express());

app.use(favicon(path.join(__dirname, '../favicon.ico')));

//Static assets
app.use(`/assets`, function (req, res, next) {
  res.header("Cache-Control", "public, max-age=31536000");
  next();
});
app.use(`/assets`, express.static(path.join(__dirname, '/../../public/')));

//Access Logging
app.use(morgan('combined'));

app.use(diagnosticMidware);

const serverConfiguration = configManager.serverConfig.generateConfigurationForBrowser();
const clientConfiguration = configManager.clientConfig.generateConfigurationForBrowser();

const externalServices = serverConfiguration.externalServices;
const apiHost = externalServices.apiHost;

// Application Middleware
app.all('/*', (req, res) => {
  match({routes: routes, location: req.url}, async function (error, redirectLocation, renderProps) {
    if (error) {
      res.status(500).send(error.message);
    } else if (renderProps) {
      let resStatus = 200;
      if (renderProps.routes[renderProps.routes.length - 1].name === 'not-found') {
        resStatus = 404;
      }

      renderProps.params.configuration = serverConfiguration;
      fetchApiData(renderProps, apiHost)
        .then(apiData => {
          apiData.status = resStatus;
          renderProps.params.apiData = apiData;
          const context = <RouterContext {...renderProps}/>;
          let html = serverSidePage(renderToString(context), clientConfiguration, apiData);
          res.status(resStatus).send(html);
        }).catch(err => {
          console.error(err);
          if(err.statusCode >= 400 && err.statusCode < 500) {
            renderProps.params.apiData = {status: 404};
          } else {
            renderProps.params.apiData = {status: 500};
          }
          const context = <RouterContext {...renderProps}/>;
          let html = serverSidePage(renderToString(context), clientConfiguration, renderProps.params.apiData);
          res.status(renderProps.params.apiData.status).send(html);
        });
    }
  });
});


//Startup Message
app.listen(configManager.serverConfig.listeningPort, configManager.serverConfig.listeningHost, () => {
  /* eslint-disable no-console */
  console.log(
    `${pkg.name} server listening on http://${configManager.serverConfig.listeningHost}:${configManager.serverConfig.listeningPort}`
  );
  /* eslint-enable no-console */
});
