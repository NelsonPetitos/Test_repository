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
        location.href = "http://192.168.15.189:8080";
    })
}