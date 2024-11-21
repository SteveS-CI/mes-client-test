const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const next = require('next');
const schema = require('./config.schema');
const { validate } = require('jsonschema');

const isWin = process.platform === "win32";
const lineEnd = isWin ? '\r\n' : '\n';

const configName = 'config.json';

if (!fs.existsSync(configName)) {
  console.log(`Configuration file missing (${configName})`);
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configName));

// validate the configuration
const validation = validate(config, schema);
const { errors } = validation;
if (errors && errors[0]) {
  let message = 'Invalid config file:'
  errors.forEach(error => {
    const { stack } = error;
    message = message.concat(`${lineEnd}${stack}`);
  })
  console.log(message);
  process.exit(1);
}

const { port, host, certName } = config;

const portStr = port === 443 ? '' : `:${port}`;
const appUrl = `http://${host}${portStr}`;

const dev = process.env.NODE_ENV === 'development';

const app = next({ dev, dir: __dirname });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    req.config =  config; // attach config
    return handle(req, res);
  });

  server.listen(8080, (req, res) => {
    console.log(`listening on ${appUrl}`);
  });

  // const certPath = path.join(__dirname, `${certName}.crt`);
  // const keyPath = path.join(__dirname, `${certName}.key`);

  // https.createServer({
  //   key: fs.readFileSync(keyPath),
  //   cert: fs.readFileSync(certPath)
  // }, server).listen(port, (err) => {
  //   if (err) throw err
  //   console.log(`app is listening on port ${port} Go to "${appUrl}"/`)
  // });

});
