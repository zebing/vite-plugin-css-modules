const { createServer } = require('vite')

;(async () => {
  const server = await createServer({
    server: {
      port: 3003
    }
  })
  await server.listen()
})()