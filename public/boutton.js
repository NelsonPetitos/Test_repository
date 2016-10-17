/**
 * Created by ndenelson on 10/11/16.
 */
var balise = document.getElementById("wearetechapi");


if(balise == null){
    balise = document.getElementsByName("wearetechapi");
}
if(balise != null){
    var newButton = document.createElement("button");
    newButton.id = "wearetechapi";
    newButton.innerHTML = "Mobile money payment";
    balise.parentNode.replaceChild(newButton, balise);
    newButton.addEventListener("click", function(){
        // location.href = "https://paiementback.herokuapp.com";
        var xhttp;

        if(window.XMLHttpRequest){
            xhttp = new XMLHttpRequest();
        }else{
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert("Request back.");
            }else{

            }
        };
        xhttp.open("GET", "https://paiementback.herokuapp.com/initpopup", true);
        xhttp.send()
    })
}