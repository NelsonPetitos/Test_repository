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
var cors = require('cors')

var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var listSocket = new Array();
var i = 0;

app.use(cors())

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
    console.log("Nouvelle connection à l'accueil du serveur.");
});

app.get('/initpopup', function(req, res){
    console.log("Nouvelle connection à l'url /initpopup");
    fs.readFile(__dirname + '/public/popup.html', function(error, content) {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

io.on('connection', function(socket){

    console.log('A new user is connected with socket id = ' + socket.id)
    listSocket[i] = socket;
    i = i + 1;

    socket.on('message', function(message){
        console.log("Le sereur viens recoit une demande de "+ socket.id);
        message.userid = socket.id
        io.emit('mobile', message);
        console.log("Le sereur a transmis le message au modem.");
    });

    socket.on('mobile', function (result) {
        var j;
        var obj = JSON.parse(result);
        console.log("Le module viens de repondre au serveur.");
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
            console.log("Le sereur répond a la socket "+ listSocket[j].id);
            listSocket[j].emit('result', obj);
        }
    });
});

http.listen((process.env.PORT || 5000), function(){
    console.log('Le serveur écoute sur le port : '+ (process.env.PORT || 5000));
});
