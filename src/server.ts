import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

app.set('trust proxy', true);
app.set('etag', 'strong');

const angularApp = new AngularNodeAppEngine({
  trustProxyHeaders: true,
  allowedHosts: [
    'localhost',
    'mrkata.com',
    'www.mrkata.com',
  ],
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    immutable: true,
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader(
    'Referrer-Policy',
    'strict-origin-when-cross-origin',
  );
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()',
  );
  res.setHeader('Vary', 'Accept-Encoding');

  next();
});

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response
        ? writeResponseToNodeResponse(response, res)
        : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = Number(process.env['PORT']) || 7200;

  const server = app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(
      `Node Express server listening on http://localhost:${port}`,
    );
  });

  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;
}

export const reqHandler = createNodeRequestHandler(app);