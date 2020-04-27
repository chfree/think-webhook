var http = require('http')
var createHandler = require('github-webhook-handler')
var exec = require('child_process').exec

var handlerOption = [
  { 
    path: '/hooks/publish_tennetcn', 
    secret: 'yoursecret', 
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

  console.log("application is run at: http://%s:%s", host, port)
  console.log('date now:%s',new Date())
})

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  var url = event.url
  console.log('req url %s; time: %s', url, new Date())

  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
  
  const currOption = handlerOption.filter(item => item.path === url) || []
  if(currOption.length <= 0){
    console.log('current url is not matchs')
  }else{
    const shell = currOption[0].shell
    console.log('exec shell：%s; time [%s]', shell, new Date())
    exec(shell, function(err,stdout,stderr){
      if(!err) {
        console.log(stdout);
      }else{
        console.log('exec shell success; time [%s]', new Date())
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