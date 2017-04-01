import Helmet from 'react-helmet';

export default function (reactRenderedBody, configuration, apiData) {
  const head = Helmet.rewind();
  const stringifyApiData = JSON.stringify(apiData);
  const pageData = `
    window.DATA = window.DATA || {};
    window.DATA.configurationFromNode = ${JSON.stringify(configuration)};
    window.DATA.pageData = ${stringifyApiData};
  `;

  return (`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        ${head.title}
        ${head.meta}
        ${head.link}

        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
        <link rel="stylesheet"
              href=/assets/${configuration.assetsMappings["css/main.css"]} />
      </head>
      <body>
        <div id="main">${reactRenderedBody}</div>
        <script type="text/javascript"
                src=/assets/${configuration.assetsMappings["js/vendor.js"]}></script>
        <script type="text/javascript">${pageData}</script>
        <script type="text/javascript"
                src=/assets/${configuration.assetsMappings["js/main.js"]}></script>
      </body>
    </html>
    `);
}
