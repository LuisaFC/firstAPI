const http = require('http');
const routes = require('./routes');
const {URL} = require('url');
const bodyParser = require('./helpers/bodyParser');

const server = http.createServer((request, response) => {
  //parse da url para conseguir extrair query params
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);
  console.log(`Method: ${request.method} | Endpoint: ${parsedUrl.pathname}`);

  let {pathname} = parsedUrl
  let id = null

  //split do endpoint nas / para identificar quando o usuário está mandando um query param
  const splitEndpoint = pathname.split('/').filter(Boolean)

  //separando pathname do query param
  if(splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`
    id = splitEndpoint[1]
  }

  //pesquisando rota que faça match de endpointne de metodo
  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname && routeObj.method === request.method
  ))
  
  //se rota existir...
  if(route){
    //injeta query params dentro da request
    request.query = Object.fromEntries(parsedUrl.searchParams)
    //injeta id dentro da request
    request.params = { id }

    // criação do  metodo send para evitar repetição de código
    response.send = (statusCode, body) => {
      //enviar resposta para o cliente
      response.writeHead(statusCode, {'Content-Type':'application/json'});
      response.end(JSON.stringify(body))
    }

    //verifica o metodo da requisição
    if(['POST', 'PUT', 'PATCH'].includes(request.method)) {
      //pegar o stream do body e transformar em obj json
      bodyParser(request, () =>  route.handler(request, response) )
    } else {
      route.handler(request, response)
    }

  }else{
    response.writeHead(404, {'Content-Type':'text/html'});
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }

  
})

server.listen(3000, () => console.log('Server started at http://localhost:3000'))