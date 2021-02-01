const path = require('path');
const express = require('express')

const app = express()

app.use(express.static(path.resolve(__dirname, '../dist')));

app.listen(3006, () => {
  console.log('server start at: http://localhost: 3006')
})