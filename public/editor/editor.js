document.addEventListener("DOMContentLoaded", function(event) {
    txt = "";
    txt2 = "";
    txt3 = "";
    cursorPoint = 0;

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

    var entry = document.getElementById("entry");
    var outry = document.getElementById("outry");
    var phantom = document.getElementById("phantom");
    var placeholder = document.getElementById("placeholder");
    phantom.focus();
    placeholder.style.display = "none";



/*     var entry = document.getElementById("entry");
    var outry = document.getElementById("outry");
    var phantom = document.getElementById("phantom");
    var placeholder = document.getElementById("placeholder");
    entry.innerHTML = "";
    outry.innerHTML = "";
    phantom.focus();
    placeholder.style.display = "none"; */

/*     txt2 = document.getElementById("entry").innerHTML;
    txt3 = document.getElementById("outry").innerHTML;

    var entry = document.getElementById("entry");
    
    var phantom = document.getElementById("phantom");
    phantom.focus();

    // Get Selection (or just the click I guess)
    var s = window.getSelection();
    var i = s.type; // This is which character is clicked
    console.log(i);

    const range = document.createRange();
    range.selectNodeContents(document.getElementById("page"))
    console.log(range.toString());


    txt = txt2 + txt3;
    txt2 = txt.substring(0, i);
    txt3 = txt.substring(i, txt.length);

    document.getElementById("entry").innerHTML = txt2;
    document.getElementById("outry").innerHTML = txt3; */
}

var entry = function(){

    var i = window.getSelection().anchorOffset;

    var entry = document.getElementById("entry");
    var outry = document.getElementById("outry");
    var total = entry.innerHTML + outry.innerHTML;

    entry.innerHTML = total.substring(0, i);
    outry.innerHTML = total.substring(i, total.length);

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
    var outry = document.getElementById("outry");
    var currentText = entry.innerHTML

    if (e.inputType === "insertText"){

        //txt2 = txt2 + e.data;
        entry.innerHTML = entry.innerHTML + e.data;

    } else if (e.inputType === "deleteContentBackward"){

        //txt2 = txt2.substring(0, currentText.length - 1)
        entry.innerHTML = entry.innerHTML.substring(0, currentText.length - 1);

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