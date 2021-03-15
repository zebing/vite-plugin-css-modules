export default function () {
  const test = 'test'
  return {
    name: 'my-plugin',
    config (config) {
      console.log(config)
    },
    transformIndexHtml (html) {
      console.log(html)
    },
    resolveId (source, importer, options) {
      console.log(source, importer, options)
    },
    load (id) {
      console.log(id)
    },
    transform (code, id) {
      console.log(code, id)
    }
  }
}