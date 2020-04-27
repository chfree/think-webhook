var http = require('http')
var createHandler = require('github-webhook-handler')
var exec = require('child_process').exec

var handlerOption = [
  { 
    path: '/hooks/publish_tennetcn', 
    secret: 'tennetcn.com', 
    shell: 'sh /home/publish/tennetcn/publish.sh' 
  }
]

var handler = createHandler(handlerOption)

const server = http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
})

server.listen(9100, function(){
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  var url = event.url
  console.log(url, 'url')

  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
  
  const currOption = handlerOption.filter(item => item.path === url) || []
  if(currOption.length <= 0){
    console.log('current url is not matchs')
  }else{
    exec(currOption[0].shell, function(err,stdout,stderr){
      if(!err) {
        console.log(stdout);
      }
    })
  }
})

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})