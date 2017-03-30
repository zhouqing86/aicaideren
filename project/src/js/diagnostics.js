import os from "os";
import _ from 'lodash';

const routes = [
  {
    path: "/diagnostic",
    callback: self
  },
  {
    path: "/diagnostic/status/heartbeat",
    callback: heartbeat
  },
  {
    path: "/diagnostic/status/nagios",
    callback: nagios
  },
  {
    path: "/diagnostic/status/diagnosis",
    callback: diagnosis
  },
  {
    path: "/diagnostic/host",
    callback: host
  },
  {
    path: "/diagnostic/version",
    callback: version
  }
];

function self(request, response) {
  response.send(routes.filter(function (route) {
    return route.callback != self;
  }).map(function (route) {
    return {
      rel: route.callback.name,
      path: route.path
    };
  }));
}

function heartbeat(request, response) {
  response.send("OK");
}

function nagios(request, response) {
  response.send("OK");
}

function diagnosis(request, response) {
  response.send("OK");
}

function host(request, response) {
  response.send(os.hostname());
}

function version(request, response) {
  response.send(process.env.BUILD_NUMBER || "0.0.0");
}

export default function diagnosticMidware(req, res, next) {
  const route = _.find(routes, route => route.path === req.url);
  if (route) {
    route.callback(req, res);
  } else {
    next();
  }
}
