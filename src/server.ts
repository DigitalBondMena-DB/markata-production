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
const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);
app.get
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 7200;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
// import { AngularAppEngine, createRequestHandler } from '@angular/ssr'
// import { getAllowedHosts, getContext, getTrustProxyHeaders } from '@netlify/angular-runtime/app-engine.js'

// const angularAppEngine = new AngularAppEngine({
//   allowedHosts: getAllowedHosts(),
//   trustProxyHeaders: getTrustProxyHeaders(),
// })

// export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
//   const context = getContext()

//   const result = await angularAppEngine.handle(request, context)
//   return result || new Response('Not found', { status: 404 })
// }

// /**
//  * The request handler used by the Angular CLI (dev-server and during build).
//  */
// export const reqHandler = createRequestHandler(netlifyAppEngineHandler)