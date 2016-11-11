var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// var getip = require('ipware')().get_ip;

var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var mongoose = require('mongoose');

var listSocket = new Array();
var i = 0;



// //Mongooose database work
mongoose.connect('mongodb://ndenelson:Picsou_88modulus@jello.modulusmongo.net:27017/iG8apaze');
var Client = mongoose.model('Client', {
    apikey : String,
    username : String,
    useremail: String,
    userpassword: String,
});

// Le middleware
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


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Specified to render static file such as images, css files or javascript file
app.use('/ressources', express.static(__dirname+'/public/css/'));
app.use('/ressources',express.static(__dirname+'/public/js/'));
app.use('/ressources', express.static(__dirname+'/public/img/'));
app.use('/ressources', express.static(__dirname+'/public/fonts/'));



//Setting the template engine to be ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);


//Routes
app.get('/', function(req, res){
    console.log("Connection en get sur le chemin home");
    res.render('index.html');
});

app.get('/ressources/wearetechapi-v1.js', function (request, response) {
    response.setHeader('content-type', 'text/javascript');
    //response.render('js/wearetechapi-v1.js');
});




// app.get('/documentation', function(request, response) {
//     response.render("./pages/documentation.html");
// });
//

app.post('/login', function(request, response){
    console.log(request.body);
    Client.find(request.body, function(err, client){
        console.log(err);
        if(err){
            console.log("Une erreur est survenu pendand la recherche "+err);
            response.redirect(500, '/');
        }else{
            console.log(client);
            if(client.length == 0){
                console.log("Cet utilisteur n'existe pas");
                response.redirect('/');
            }else{
                response.render('./pages/member.html', {client: client});
            }
        }
    })

})
//
// app.get('/member', function(request, response){
//     response.render('./pages/member.html');
// });


app.get('/register', function (request, response) {
    console.log("Connect to register in get");
    response.render('./pages/register.html');
});


app.post('/register', function(request, response){
    console.log(request.body);
    var data = request.body;
    var client = new Client();
    client.apikey = "A@e9B3n#$5c";
    client.useremail =  data.useremail;
    client.username = data.username;
    client.userpassword = data.userpassword;
    client.save(function(err){
        if(err){
            console.log("Une erreur c'est produite lors de l'enregistrement de l'utilisateur");
            response.redirect('/register');
        }else{
            console.log("L'utilisateur a ete creer avec succes");
            response.render('./pages/member.html');
        }
    })
    response.redirect('/')
})
//
// app.get('/login', function (request, response) {
//     response.render('./pages/login.html');
// });

app.get('/initpopup', function(req, res){
    console.log("Nouvelle connection à l'url /initpopup");
    console.log();
    var montant = req.query.amount;
    // var numtwo = req.query.numtwo;
    var htmlBox =
        "<div id=\'wearetech_modal\' style=\'padding:40px;background:rgba(0,0,0,0.3);z-index:1000000000;position:fixed;width:100%;height;100%;top:0px;left:0px;right:0px;padding-top:100px;\'> " +
        "<div style=\'width:300px;padding:30px 10px;margin:auto;background:white;text-align:center;border-radius:3px;-webkit-box-shadow: -1px 2px 6px 0px rgba(0,0,0,0.75);-moz-box-shadow: -1px 2px 6px 0px rgba(0,0,0,0.75);box-shadow: -1px 2px 6px 0px rgba(0,0,0,0.75);'> " +
        "<div style='color:#4099FF;font-size:35px;font-weight:600;margin-bottom:10px;'>WeareTech</div> " +
        "<div>" + "<table style='width:100%;'>" + "<tbody style='width:100%;''>" + "<tr>" + "<td style='width:50%;'>" +
        "<div style='text-transform:uppercase;font-size:10px;text-align:left;padding-bottom:3px'>Nombre 1</div>" +
        "<div><input style='width:100px;height:30px;' id='wearetech_numberone' class='one' value="+numone+" disabled='disabled'></div>" + "</td>" + "<td style='width:50%;padding-left:10px;'>" +
        "<div style='text-transform:uppercase;font-size:10px;text-align:left;padding-bottom:3px'>Nombre 2</div>" +
        "<div><input style=\'width:100px;height:30px;\' id=\'wearetech_numbertwo\' class=\'two\' value="+numtwo+" disabled='disabled'></div>" + "</td> </tbody> </table>" + "<div style=\'margin-top:15px;\'>" +
        "<button style=\'background:#4099FF;color:white;font-size:13px;font-weight:500;padding:5px 10px;border-radius:3px;\' id=\'wearetech_validnumber\'>Valider</button>" + "</div>" +
        "<div style=\'margin-top:30px;text-align:center;\'>" +
        "<button id=\'wearetech_closemodal\' style=\'background:white;color:rgb(100,100,100);border:0;font-size:11px;\'>Annuler</button> </div> </div> </div>";

    var boxScript =
        "<script>" +
            "var closebtn = document.getElementById('wearetech_closemodal');" +
            "var validerBtn = document.getElementById('wearetech_validnumber');" +
            "var socket;" +
            "loadMyScript('https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.5.0/socket.io.min.js', function(){" +
                "console.log('Socket.io chargée dans le popup.');" +
            "});" +
            "validerBtn.addEventListener('click', function () {" +
                "socket = io.connect('https://paiementback.herokuapp.com/');" +
                "console.log('jai pu charge le socket.io');" +
                "socket.on('result', function(result) {" +
                    "var status = {'status': 200, 'statusText': 'OK'};" +
                    "if(typeof wearetechPaymentBack == 'function'){" +
                        "wearetechPaymentBack(status, result);" +
                    "}else{" +
                        "alert('Define callback method to handle response.');" +
                    "}" +
                "});" +
                "var num1 = document.getElementById('wearetech_numberone').value;" +
                "var num2 = document.getElementById('wearetech_numbertwo').value;" +
                "var message = {'num1': num1, 'num2': num2};" +
                "socket.emit('message', message);" +
                "var modaldiv = document.getElementById('wearetech_modal');" +
                "document.body.removeChild(modaldiv);" +
            "});" +
            "closebtn.addEventListener('click', function() {" +
                "var modaldiv = document.getElementById('wearetech_modal');" +
                "document.body.removeChild(modaldiv);" +
            "});" +
            "function loadMyScript(url, callback) {" +
                "var scrpt = document.createElement('script');" +
                "scrpt.src = url;" +
                "scrpt.type = 'text/javascript';" +
                "scrpt.onload = callback();" +
                "document.getElementsByTagName('head')[0].appendChild(scrpt);" +
            "} " +
        "<\/script>";

    res.send(htmlBox+boxScript);

});

app.listen((process.env.PORT || 5000), function(){
    console.log('Le serveur écoute sur le port : '+ (process.env.PORT || 5000));
});

io.on('connection', function(socket){

    var req  = socket.request;
    var ip =  req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

    console.log("1 - req.headers =  "+ req.headers['x-forwarded-for']);
    console.log("2 - req.connection =  "+ req.connection.remoteAddress);
    console.log("3 - req.socket =  "+ req.socket.remoteAddress);
    console.log("4 - "+ socket.remoteAddress);

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


