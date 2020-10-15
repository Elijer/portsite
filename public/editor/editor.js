document.addEventListener("DOMContentLoaded", function(event) {
    txt = "";
    txt2 = "";
    txt3 = "";
    cursorBlink();
    cursorOn = false;

    initiateHotkeys();

    //cursorBlink();

    document.querySelector('#phantom').addEventListener('keypress', exception);

    state = {
        typing: false
    }



})

var initiateHotkeys = function(){
    document.onkeyup = function(e) {

        // https://medium.com/@melwinalm/crcreating-keyboard-shortcuts-in-javascripteating-keyboard-shortcuts-in-javascript-763ca19beb9e

        //console.log(e);
        if (e.key === "q" && e.ctrlKey === true){
            console.log("Yay");
        }

      };
}


var whereFocus = function(){
    var phantom = document.getElementById('phantom');

    if (document.activeElement === phantom){
        phantom.addEventListener('input', typing);
        clearInterval(cursorBlinkGlobal);
        document.getElementById("cursor").style.display = "inline";
        document.getElementById("cursor").style.visibility = "visible";
        cursorBlink()
        cursorOn = true;
    } else {
        phantom.removeEventListener('input', typing);
        document.getElementById("cursor").style.display = "none";
    }
}

var typeWriter = function(){

    var entry = document.getElementById("entry");
    var outry = document.getElementById("outry");
    var phantom = document.getElementById("phantom");
    var placeholder = document.getElementById("placeholder");
    phantom.focus();
    placeholder.style.display = "none";
}

var entryOutry = function(m){

    var i = window.getSelection().anchorOffset;

    // this saves a string
    var e = document.getElementById("entry").innerHTML;
    var o = document.getElementById("outry").innerHTML;

    // while this saves a reference capable of changing display
    var outry = document.getElementById("outry");
    var entry = document.getElementById("entry");
    var total = e + o;

    if (m === "1"){

        entry.innerHTML = total.substring(0, i);
        outry.innerHTML = total.substring(i, total.length);

    } else {

    // so using them interchangeably can cause problems.
    // That's why 'e' is saved separately.
    entry.innerHTML = total.substring(0, e.length+i);
    outry.innerHTML = total.substring(e.length+i, total.length);

    }
}


var typing = function(e){

    // typing causes cursor to remain solid. After waiting a moment,
    // it begins to blink again.
    cursorOn = false;
    setTimeout(function(){
        cursorOn = true
    }, 500);

    // consider using &nbsp; or something you can control for multiple spaces
    // instead whatever default space is being used here. Cause I don't like it.

    cursor.style.visibility = "visible";

    document.getElementById("cursor").style.display = "inline";
    
    state.typing = true;

    var test = document.getElementById("test");
    var entry = document.getElementById("entry");
    var outry = document.getElementById("outry");
    var currentText = entry.innerHTML

    if (e.inputType === "insertText"){

        if (e.data == " "){
            entry.innerHTML = entry.innerHTML + " ";
            //test.innerHTML = entry.innerHTML + '&nbsp;';
        } else {
/*             var parsed = entry.innerHTML;
            parsed = parsed.replaceAll("&nbsp;", " "); */
            entry.innerHTML = entry.innerHTML + e.data;

        }

    } else if (e.inputType === "deleteContentBackward"){

        var parsed = entry.innerHTML;
        parsed = parsed.substring(0, parsed.length - 1);
        entry.innerHTML = parsed;

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


var cursorBlink = function(){

    // cursorOn is for keeping cursor solid while typing
    // cursorBlinkGlobal is for restarting blink cycle at focus/refocus


    var cursor = document.getElementById("cursor");
    //cursor.style.display = "inline";

    cursorBlinkGlobal = setInterval(function(){

        if (cursorOn === true){

            if (cursor.style.visibility == "hidden"){
                cursor.style.visibility = "visible";
            } else {
                cursor.style.visibility = "hidden";
            }
        } else {
            cursor.style.visibility = "visible";
        }

    }, 600);

};

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 