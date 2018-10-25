const http = require('http')
const test = require('tape')
const { requestList } = require('./')

test('requests should be captured', t => {
  t.plan(1)
  const server = http.createServer((req, res) => res.end([
    `<html>`,
    `  <head>`,
    `    <title>test</title>`,
    `    <link href="style.css" rel="stylesheet">`,
    `  </head>`,
    `  <body>`,
    `    <img src="image.jpg">`,
    `    <script src="script.js"></script>`,
    `    <script>`,
    `      (function(d, script) {`,
    `        script = d.createElement('script')`,
    `        script.type = 'text/javascript'`,
    `        script.async = true`,
    `        script.src = 'inject.js'`,
    `        d.getElementsByTagName('head')[0].appendChild(script)`,
    `      }(document))`,
    `    </script>`,
    `  </body>`,
    `</html>`
  ].join('\n')))
  server.listen(async () => {
    const url = `http://localhost:${server.address().port}/`
    const result = await requestList(url)
    const expected = [
      'style.css',
      'image.jpg',
      'script.js',
      'inject.js'
    ].map(item => `${url}${item}`)
    t.deepEqual(result, [url].concat(expected))
    t.end()
    server.close()
  })
})
