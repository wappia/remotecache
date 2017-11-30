const http = require('http')
const fs = require('fs')
const port = 5501

const requestHandler = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || req.headers.host);
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
	res.setHeader('Access-Control-Allow-Headers', '*');

  if ( req.method === 'OPTIONS' ) {
		res.writeHead(200)
		res.end()
		return
	}

  const file = 'data/' + (req.url || 'unknown').replace(/[^a-zA-Z0-9]/g, '')

  if (req.method === 'GET') {
      fs.readFile(file, (err, data) => {
        if (err) {
          console.log(err)
          res.end('')
        } else {
          res.end(data)
        }
      })
    return
  }

  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString()

    fs.writeFile(file, body, (err) => {
      if (err) {
        console.error(err)
        res.statusCode = 500
        res.end(JSON.stringify(err))
      } else {
        res.end('OK')
      }
    })

  });
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
