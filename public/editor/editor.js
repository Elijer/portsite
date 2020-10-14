document.addEventListener("DOMContentLoaded", function(event) {
    txt = "";

    document.querySelector('#phantom').addEventListener('keypress', exception);

    state = {
        typing: false
    }
})


var whereFocus = function(){
    var phantom = document.getElementById('phantom');

    if (document.activeElement === phantom){
        phantom.addEventListener('input', typing);
        document.getElementById("cursor").style.visibility = "visible";
        //cursorBlink();
    } else {
        phantom.removeEventListener('input', typing);
        document.getElementById("cursor").style.visibility = "hidden";
    }
}

var typeWriter = function(){

    console.log(i);
    // Get Selection (or just the click I guess)
    var s = window.getSelection();
    var i = s.anchorOffset; // This is which character is clicked
    var current = document.getElementById("entry").innerHTML;
    document.getElementById("entry").innerHTML = current.substring(0, i);
    console.log(current.substring(0, i));
    //document.getElementById("outry").innerHTML = current.substring(i, txt.length);




    console.log(i);

    var entry = document.getElementById("entry");
    var phantom = document.getElementById("phantom");
    phantom.focus();

    entry.innerHTML = txt;

}

var splice = function(str, insert, i){

    var thing;
    var prefix = str.substring(0, i);
    var suffix = str.substring(i, str.length);
    thing = prefix + insert + suffix;
    return thing;

}


/* var moveCursor = function(e){

    if (document.getElementById("cursor")){
        document.getElementById("cursor").remove();
    }

    // Get Selection (or just the click I guess)
    var s = window.getSelection();
    var i = s.anchorOffset; // This is which character is clicked
    console.log(i);

    var cursor = `<span id = "cursor" ></span>`

    txt = splice(txt, cursor, i)
    document.getElementById("entry").innerHTML = txt;

} */

var typing = function(e){

    // consider using &nbsp; or something you can control for multiple spaces
    // instead whatever default space is being used here. Cause I don't like it.

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

        // debugging tool
        console.log(txt.length, txt);
        
        /* Add Newline
            var entry = document.getElementById("entry");
            txt = entry.innerHTML + "\n";
            entry.innerHTML = txt; */
            
        }
}

// This is a bit too much to handle for now.
/* var cursorBlink = function(){

    var cursor = document.getElementById("cursor");
    cursor.style.display = "inline";

    setInterval(function(){

        if (cursor.style.visibility == "hidden"){
            cursor.style.visibility = "visible";
        } else {
            cursor.style.visibility = "hidden";
        }
    }, 800);

}; */