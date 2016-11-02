/**
 * Created by ndenelson on 10/11/16.
 */

function setWearetechButton(){
    var balise = document.getElementById("wearetechapi");
    if(balise == null){
        alert("Créer un tag avec pour identifiant wearetechapi");
        return;
    }
    var texte = balise.innerHTML;
    var numone = balise.dataset.numone;
    var numtwo = balise.dataset.numtwo;
    var newButton = document.createElement("button");

    if(texte){
        newButton.innerHTML = texte;
    }else{
        newButton.innerHTML = "Mobile money payment";
    }

    if(numone){
        newButton.dataset.numone = numone;
    }else{
        newButton.dataset.numone = 78;
    }

    if(numtwo){
        newButton.dataset.numtwo = numtwo;
    }else{
        newButton.dataset.numtwo = 54;
    }

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
                var coupe = this.responseText.split("<script>");
                var javcsrpt = coupe[1].split("<\/script>");
                eval(javcsrpt[0]);
            }
        }

        var numone = this.dataset.numone;
        var numtwo = this.dataset.numtwo;
        //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.open("GET", "https://paiementback.herokuapp.com/initpopup?numone="+numone+"&numtwo="+numtwo, true);
        xhttp.send();
    })
}

window.onload = function () {
    setWearetechButton();
}

function wearetechPaymentBack(status, data) {
    alert("Response status is : " + status.statusText + "\n\nThe result is : " + data.somme);
}