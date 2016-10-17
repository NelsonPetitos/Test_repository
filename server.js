// var http = require('http');
// var fs = require('fs');
//
// var server = http.createServer(function (request, response) {
//     fs.readFile('./public/popup.html', 'utf-8', function (error, content) {
//         response.writeHead(200, {"Content-Type": "text/html"})
//         response.end(content);
//     })
// });
//
// var socketIO = require('socket.io').listen(server);
//
// socketIO.sockets.on('connection', function (socket) {
//     //console.log(socket)
//     console.log('un nouvel utilisateur est connecté....');
//     // socket.on('message', function (message) {
//     //     socket.broadcast.emit('message', {'message': message});
//     //     console.log('un client dit : ' + message.message)
//     // });
// });
//
// server.listen(8081);
//
// console.log("App listening on port 8081");

var app = require('express')();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var listSocket = new Array();
var i = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/initpopup', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("Hi Nelson.");
});

io.on('connection', function(socket){

    console.log('A new user is connected with socket id = ' + socket.id)
    listSocket[i] = socket;
    i = i + 1;

    socket.on('message', function(message){
        message.userid = socket.id
        io.emit('mobile', message);
    });

    socket.on('mobile', function (result) {
        var j;
        var obj = JSON.parse(result);
        // console.log(listSocket.length);
        // console.log(listSocket[0].id);
        // console.log(obj.somme);
        for(j=0; j<=i; j++){
            if(listSocket[j].id == obj.userid){
                break;
            }
        }
        if( j <= i ){
            console.log(result);
            listSocket[j].emit('result', obj);
        }
    });
});

http.listen((process.env.PORT || 5000), function(){
    console.log('listening on port : '+ (process.env.PORT || 5000));
});
