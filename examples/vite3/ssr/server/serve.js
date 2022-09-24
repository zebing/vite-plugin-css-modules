import fs from 'fs';
import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
) {

  const indexProd = isProd
    ? fs.readFileSync(path.resolve(__dirname, '../dist/client/index.html'), 'utf-8')
    : ''

  const manifest = isProd
    ? // @ts-ignore
      await import('../dist/client/ssr-manifest.json')
    : {}

  function getIndexTemplate(url) {
    if (isProd) {
      return indexProd;
    }

    // during dev, inject vite client + always read fresh index.html
    return (
      `<script type="module" src="/@vite/client"></script>` +
      fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8')
    )
  }

  const app = express()

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite
  if (!isProd) {
    vite = await createViteServer({
      root,
      server: {
        middlewareMode: true
      }
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use(import('compression')())
    app.use(
      import('serve-static')(path.resolve(__dirname, '../dist/client'), {
        index: false
      })
    )
  }
  

  app.use('*', async (req, res, next) => {
    try {
      const url = req.originalUrl
      let template = getIndexTemplate();
      if (!isProd) {
        template = await vite.transformIndexHtml(url, template)
      }
      const { render } = isProd 
      ? import('../dist/server/entry-server.js')
      : await vite.ssrLoadModule('/src/entry-server.js')

      const [appHtml, preloadLinks] = await render(req.originalUrl, manifest)
      console.log(appHtml, 'preloadLinks', preloadLinks)

      const html = `
      ${preloadLinks}
      ${template.replace(`<!--ssr-outlet-->`, appHtml)}
      `

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      next(e)
    }
  })

  return { app, vite }
}

createServer().then(({ app }) =>
  app.listen(3006, () => {
    console.log('http://localhost:3006')
  })
)
