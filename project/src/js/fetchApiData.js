import when from 'when';

export default function (renderProps, host) {
  let data = {};

  const filteredRoutes = renderProps.routes.filter(route => route.component)
    .filter(route => route.component.fetchApiData);

  return when.Promise.all(
    filteredRoutes.map(route => {
      return route.component.fetchApiData(host, renderProps.params, renderProps.location).then(d => {
        data[route.name] = d;
      });
    })
  ).timeout(50000).then(() => data);
}
