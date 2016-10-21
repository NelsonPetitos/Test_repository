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
        newButton.dataset.numone = "num_one";
    }

    if(numtwo){
        newButton.dataset.numtwo = numtwo;
    }else{
        newButton.dataset.numtwo = "num_two";
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

