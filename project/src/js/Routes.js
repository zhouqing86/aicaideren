"use strict";

import React from 'react';
import {Router, Route, IndexRoute, Redirect} from 'react-router';
import App from './components/App';
import LandingPage from './components/landingPage/LandingPage';
import DetailPage from './components/detailPage/DetailPage';
import NotFound from './components/common/NotFound';

export default (
  <Router>
    <Route path="/" name="app" component={App}>
      <IndexRoute name="landingPage" component={LandingPage}/>
      <Route path="p/:articleId" name="detailPage" component={DetailPage}/>
    </Route>
    <Route path="*" component={App}>
      <IndexRoute name="not-found" component={NotFound}/>
    </Route>
  </Router>
);
