/**
 * Created by ndenelson on 10/11/16.
 */

function setWearetechButton(){
    var balise = document.getElementById("wearetechapi");
    if(balise == null){
        alert("Créer un tag avec pour identifiant wearetechapi");
        return;
    }
    var newButton = document.createElement("button");
    newButton.id = "wearetechapi";
    newButton.innerHTML = "Mobile money payment";
    balise.parentNode.replaceChild(newButton, balise);
    newButton.addEventListener("click", function(){
        var xhttp;
        if(window.XDomainRequest){
            xhttp = new XDomainRequest();
            console.log("Le navigateur prend en compte le XDoamainRequest");
        }else if(window.XMLHttpRequest){
            xhttp = new XMLHttpRequest();
            console.log("Le navigateur prend en compte le XMLHttpRequest");
        }else{
            alert("");
            return;
        }
        xhttp.onload = function() {
            if(this.readyState == 4 && this.status == 200){
                document.body.insertAdjacentHTML('beforeend', this.responseText);
                var split = this.responseText.split("<script>");
                var javcsrpt = split[1].split("<\/script>");
                eval(javcsrpt[0]);
            }
        }
        xhttp.open("GET", "https://paiementback.herokuapp.com/initpopup", true);
        xhttp.send();
    })
}

window.onload = function () {
    setWearetechButton();
}
