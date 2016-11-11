function WRTechAPI(){
    this.apiKey = "Default avlue key";
    this.apiCallback = function(data, status){};
}
WRTechAPI.prototype.setApiKey = function(newKey){
    this.apiKey = newKey;
    console.log("new api key = "+ newKey);
}

WRTechAPI.prototype.setCloseButton = function(closeButton){
    this.closeButton = closeButton;
    this.setCloseButtonEventListener();
}

WRTechAPI.prototype.setValidateButton = function(validateButton){
    this.validateButton = validateButton;
    this.setValidateButtonEventListemer();
}

WRTechAPI.prototype.setApiButtonEventListener = function(){
    var balise = document.getElementById("wearetechapi");
    balise.addEventListener("click", function(){
        var xhttp;
        if(window.XDomainRequest){
            xhttp = new XDomainRequest();
            console.log("Le navigateur prend en compte le XDoamainRequest");
        }else if(window.XMLHttpRequest){
            xhttp = new XMLHttpRequest();
            console.log("Le navigateur prend en compte le XMLHttpRequest");
        }else{
            console.log("Le navigateur prend en compte ni le XMLHttpRequest ni le XDoamainRequest");
            return;
        }
        xhttp.onload = function(){
            if(this.readyState == 4 && this.status == 200){

                //Il faut faire un controle avant d'inserer de nouveau le code suivant.
                document.body.insertAdjacentHTML('beforeend', this.responseText);
                var coupe = this.responseText.split("<script>");
                var javcsrpt = coupe[1].split("<\/script>");
                eval(javcsrpt[0]);
                // WAPI.setCloseButton(document.getElementById("wearetech_closemodal"));
                // WAPI.setValidateButton(document.getElementById("wearetech_validnumber"));

            }
        }

        var amount = this.dataset.amount;
        if(amount){
            xhttp.open("GET", "https://paiementback.herokuapp.com/initpopup?amount="+amount, true);
            xhttp.send();
        }else{
            console.log("Set data-amount attribute to your button");
        }
    })
}

//TThis method will set the callback of the
WRTechAPI.prototype.setApiCallback = function(resolve){
    if(typeof resolve){
        this.apiCallback = resolve;
    }
}

WRTechAPI.prototype.setValidateButtonEventListemer = function(){
    this.validateButton.addEventListener("click", function () {
        socket = io.connect('https://paiementback.herokuapp.com/');
        console.log("j'ai pu charge le socket.io");
        socket.on('result', function(result) {
            var status = {"status": 200, "statusText": "OK"};

            if(typeof wearetechPaymentBack == 'function'){
                wearetechPaymentBack(status, result);
            }else{
                alert("You didn't defined callback method to handle response.");
            }
        });
        var num1 = document.getElementById('wearetech_numberone').value;
        var num2 = document.getElementById('wearetech_numbertwo').value;
        var message = {'num1': num1, 'num2': num2};
        socket.emit('message', message);
        var modaldiv = document.getElementById('wearetech_modal');
        document.body.removeChild(modaldiv);
    });
}

WRTechAPI.prototype.setCloseButtonEventListener = function() {
    this.closeButton.addEventListener("click", function() {
        var modaldiv = document.getElementById('wearetech_modal');
        document.body.removeChild(modaldiv);
    });
}

const WAPI = new WRTechAPI();
WAPI.setApiButtonEventListener();