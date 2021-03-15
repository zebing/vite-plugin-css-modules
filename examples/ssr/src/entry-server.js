import createVueApp from './main'
import { renderToString } from '@vue/server-renderer'

export async function render(url, manifest) {
  return renderVue(manifest)
}

async function renderVue(manifest) {
  const ctx = {}
  const app = await createVueApp()
  const html = await renderToString(app, ctx)
  const preloadLinks = renderPreloadLinks(ctx.modules, manifest)
  return [html, preloadLinks]
}

function renderPreloadLinks (modules, manifest) {
  if (typeof modules === 'string') {
    const file = modules;
    if (file.endsWith('.js')) {
      return `<link rel="modulepreload" crossorigin href="${file}">`
    } else if (file.endsWith('.css')) {
      return `<link rel="stylesheet" href="${file}">`
    } else {
      // TODO
      return ''
    }

  } else {
    let links = ''
    const seen = new Set()
    modules.forEach((id) => {
      const files = manifest[id]
      if (files) {
        files.forEach((file) => {
          if (!seen.has(file)) {
            seen.add(file)
            links += renderPreloadLink(file)
          }
        })
      }
    })
    return links
  }
}
