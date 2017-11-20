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

  const file = req.url.match(/^\/([a-zA-Z0-9-]+)\/?$/)[1] || 'unknown'

  if (req.method === 'GET') {
    try {
      res.end(fs.readFileSync('data/' + file))
    } catch (e) {
      res.end('')
    }
    return
  }

  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    fs.writeFileSync('data/' + file, body)

    res.end('Thank you!')
  });
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
