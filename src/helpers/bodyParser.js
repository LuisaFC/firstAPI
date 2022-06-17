
//fica ouvindo as mensagem
function bodyParser(request, callback) {
  let body = ''

  //sempre que chega algum evento com nome 'data'
  request.on('data', (chunk) => {
    //concatenando dentro da variavel 
    body += chunk
  })

  //quando chega ultima mensagem...
  request.on('end', () => {
    //transformar string em objeto json
    body = JSON.parse(body)
    //injeta dentro do request
    request.body = body
    //chama função de callback
    callback()
  })
}

module.exports =  bodyParser