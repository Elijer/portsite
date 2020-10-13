document.addEventListener("DOMContentLoaded", function(event) {

    string = ``;

    var phantom = document.getElementById("phantom");

    phantom.addEventListener('input', typing);

    var f = document.getElementById("cursor");

/*     setInterval(function() {
        f.style.display = (f.style.display == 'none' ? '' : 'none');
    }, 100) */

    cursorBlink();

    document.querySelector('#phantom').addEventListener('keypress', exception);

    state = {
        typing: false
    }
})

var typeWriter = function(){
    console.log("ding!");

    var entry = document.getElementById("entry");
    var phantom = document.getElementById("phantom");
    phantom.focus();
    entry.innerHTML = "";

}

var typing = function(e){

    document.getElementById("cursor").style.display = "inline";
    
    state.typing = true;

    var entry = document.getElementById("entry");
    var currentText = entry.innerHTML
    //console.log(e);

    if (e.inputType === "insertText"){
        console.log(e.target.value)
        entry.innerHTML = currentText + e.data;
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
            console.log("visible")
            cursor.style.visibility = "visible";
        } else {
            console.log("hidden")
            cursor.style.visibility = "hidden";
        }
    }, 500);
};

/* var assignHoverEvent = function(list, i){
    output = document.getElementById("text-display");
    let current = list[i];
    let blurb = strings[i];

    current.addEventListener("click", function( event ) { 

        if (current.classList.contains("test")) {
            current.classList.remove("test");
            output.innerHTML = "";
        } else {

            list.forEach(function(el) {
                //element.classList.add("test");
                if (el.classList.contains("test")) {
                    el.classList.remove("test");
                }
            });

            current.classList.add("test");
            output.innerHTML = blurb;

        }


    })
} */