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

// --- Edge Caching Rules (Cloudflare) ---
// Route patterns eligible for edge caching. Order matters: article routes
// checked before locale-root routes.
const CACHEABLE_ROUTES: {
  pattern: RegExp;
  sMaxAge: number;
  swr: number;
  tagPrefix?: string;
}[] = [
    // /article/:slug
    {
      pattern: /^\/article\/([^/]+)\/?$/,
      sMaxAge: 7200,        // 2 hours fresh at edge
      swr: 172800,          // serve stale up to 2 days while revalidating
      tagPrefix: 'article',
    },
    // /en/article/:slug
    {
      pattern: /^\/en\/article\/([^/]+)\/?$/,
      sMaxAge: 7200,
      swr: 172800,
      tagPrefix: 'article',
    },
    // /ar homepage
    {
      pattern: /^\/ar\/?$/,
      sMaxAge: 3600,        // 1 hour fresh
      swr: 86400,
    },
    // /en homepage
    {
      pattern: /^\/en\/?$/,
      sMaxAge: 3600,
      swr: 86400,
    },
  ];

app.use((req, res, next) => {
  // Only cache GET requests — never cache POST/PUT/DELETE
  if (req.method !== 'GET') {
    return next();
  }

  for (const route of CACHEABLE_ROUTES) {
    const match = req.path.match(route.pattern);
    if (match) {
      res.setHeader(
        'Cache-Control',
        `public, max-age=0, s-maxage=${route.sMaxAge}, stale-while-revalidate=${route.swr}`,
      );

      // Cache-Tag requires Cloudflare Enterprise plan.
      // If you're on a lower plan, remove this and purge by URL instead.
      if (route.tagPrefix && match[1]) {
        res.setHeader('Cache-Tag', `${route.tagPrefix}-${match[1]}`);
      }
      break;
    }
  }

  next();
});
// --- End Edge Caching Rules ---

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