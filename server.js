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
var fs = require('fs');

var listSocket = new Array();
var i = 0;

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
    console.log("Nouvelle connection à l'accueil du serveur.");
});

app.get('/initpopup', function(req, res){
    console.log("Nouvelle connection à l'url /initpopup");
    //res.writeHead(500, { 'Content-Type': 'text/html' });
    res.sendFile(__dirname + '/public/popup.html');
    // fs.readFile(__dirname + '/public/popup.html', function(error, content) {
    //     if (error) {
    //         res.writeHead(500, { 'Content-Type': 'text/html' });
    //         res.end();
    //     }
    //     else {
    //         res.writeHead(200, { 'Content-Type': 'text/html' });
    //         res.end(content, 'utf-8');
    //     }
    // });
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
