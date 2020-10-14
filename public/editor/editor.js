document.addEventListener("DOMContentLoaded", function(event) {
    string = "";

    var phantom = document.getElementById("phantom");

    phantom.addEventListener('input', typing);

    var f = document.getElementById("cursor");

    cursorBlink();

    document.querySelector('#phantom').addEventListener('keypress', exception);

    state = {
        typing: false
    }
})

var typeWriter = function(){

    var entry = document.getElementById("entry");
    var phantom = document.getElementById("phantom");
    phantom.focus();
    entry.innerHTML = string;

}

var typing = function(e){

    cursor.style.visibility = "visible";

    document.getElementById("cursor").style.display = "inline";
    
    state.typing = true;

    var entry = document.getElementById("entry");
    var currentText = entry.innerHTML
    //console.log(e);

    if (e.inputType === "insertText"){
        entry.innerHTML = currentText + e.data;

        string = string + e.data;

    } else if (e.inputType === "deleteContentBackward"){
        entry.innerHTML = currentText.substring(0, currentText.length - 1);
    } else {
        console.log("Unknown input type: ", e.inputType);
    }

}

var exception = function(e){
        if (e.key === 'Enter') {
            console.log("well hey");
            var entry = document.getElementById("entry");
            var currentText = entry.innerHTML;
            entry.innerHTML = currentText + `</br>`

        }
}

var cursorBlink = function(){
    var cursor = document.getElementById("cursor");
    setInterval(function(){
        if (cursor.style.visibility == "hidden"){
            cursor.style.visibility = "visible";
        } else {
            cursor.style.visibility = "hidden";
        }
    }, 800);
};

var moveCursor = function(){
    console.log("aye");
}