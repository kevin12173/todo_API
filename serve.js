const http = require("http");
const { v4: uuid} = require("uuid");

const todos = [{
    value: "要色色",
    id: uuid()
}];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
       'Content-Type': 'application/json'
     }

     if(!req.url.startsWith('/todos')){
        res.writeHead(404, headers);
        res.write("網址錯誤");
        res.end();
        return;
     }
     
     let body = "";
     switch(req.method){
        case "GET":
            res.writeHead(200, headers);
            res.write(JSON.stringify(todos));
            res.end();
            break;
        case "POST":
            req.on( 'data', chunk => {
                body += chunk;
            });
            req.on( 'end', () => {
                try{
                    const todo = JSON.parse(body)
                    todos.push({
                        value: todo.value,
                        id: uuid()
                    })
                    res.writeHead(200, headers);
                    res.write(JSON.stringify(todos));
                    res.end();
                } catch( error ){
                    console.log(error);
                    res.writeHead(200, headers);
                    res.write("資料錯誤");
                    res.end();
                }
            });
            break;
        case "DELETE":
            if(req.url.startsWith('/todos/')){
                const id = req.url.split('/').pop();
                const index = todos.findIndex( todo => todo.id === id);
                if(index !== -1){
                    todos.splice(index, 1)
                }
                res.writeHead(200, headers);
                res.write(JSON.stringify(todos));
                res.end();
            } else {
                todos.length = 0;
                res.writeHead(200, headers);
                res.write(JSON.stringify(todos));
                res.end();
            }
            break;
        case "PATCH":
            req.on( 'data', chunk => {
                body += chunk;
            });
            req.on( 'end', () => {
                try{
                    const id = req.url.split('/').pop();
                    const index = todos.findIndex( todo => todo.id === id);
                    const todo = JSON.parse(body)
                    if(index !== -1){
                        todos[index].value = todo.value;
                    }
                    res.writeHead(200, headers);
                    res.write(JSON.stringify(todos));
                    res.end();
                } catch( error ){
                    console.log(error);
                    res.writeHead(200, headers);
                    res.write("資料錯誤");
                    res.end();
                }
            });
            break;
     }

    
}

const server = http.createServer(requestListener)

server.listen(process.env.PORT || 3005);