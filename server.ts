import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createHonoAdminApp } from './src/backend/app';

async function bootstrap() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const { app: honoApp } = createHonoAdminApp();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.all('/api/*', async (req, res) => {
    try {
      const protocol = req.protocol || 'http';
      const host = req.get('host') || `localhost:${port}`;
      const fullUrl = `${protocol}://${host}${req.originalUrl}`;
      const headers = new Headers();

      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
          else headers.set(key, value);
        }
      }

      const hasBody = !['GET', 'HEAD'].includes(req.method);
      const webReq = new Request(fullUrl, {
        method: req.method,
        headers,
        body: hasBody ? JSON.stringify(req.body) : undefined,
      });

      const honoRes = await honoApp.fetch(webReq);

      res.status(honoRes.status);
      honoRes.headers.forEach((val, key) => {
        res.setHeader(key, val);
      });

      const bodyText = await honoRes.text();
      res.send(bodyText);
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'DISPATCH_ERROR', message: err.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Housika Admin Backend running at http://0.0.0.0:${port}`);
  });
}

bootstrap();
