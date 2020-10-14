document.addEventListener("DOMContentLoaded", function(event) {
    txt = "";

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
    entry.innerHTML = txt;

}

var typing = function(e){

    cursor.style.visibility = "visible";

    document.getElementById("cursor").style.display = "inline";
    
    state.typing = true;

    var entry = document.getElementById("entry");
    var currentText = entry.innerHTML

    if (e.inputType === "insertText"){

        txt = txt + e.data;
        entry.innerHTML = txt;

    } else if (e.inputType === "deleteContentBackward"){

        txt = txt.substring(0,currentText.length - 1)
        entry.innerHTML = txt;

    } else {
        console.log("Unknown input type: ", e.inputType);
    }

}

var exception = function(e){
        if (e.key === 'Enter') {

            var entry = document.getElementById("entry");
            txt = entry.innerHTML + `</br>`;
            entry.innerHTML = txt;
            
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