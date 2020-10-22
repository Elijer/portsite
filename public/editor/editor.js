document.addEventListener("DOMContentLoaded", function(event) {
    txt = "";
    txt2 = "";
    txt3 = "";
    cursorBlink();
    cursorOn = false;

    arrowNav();

    // This is one specifically for the enter key
    document.querySelector('#phantom').addEventListener('keypress', exception);

    state = {
        typing: false
    }

    currentBlock = {

        end: 0,
        lastHeight: 0,
        lines: [],

        currentLine: {
            index: 0,
            which: 0,
            suspense: 0,
            start: 0,
            end: 0,
            length: 0
        },

        prevLine: {
            start: null,
            end: null,
            length: null
        },

        nextLine: {
            start: null,
            end: null // length not necessary: same as end
        }
    }

    nextBlock = {
        exists: false,
        isEmpty: true,
        multipleLines: false,
        firstLineLength: 0
    }

    lastBlock = {

        exists: false,
        isEmpty: true,
        length: 0,

        lastLine: {
            
            start: 0,
            length: 0

        }

    }


})

var arrowNav = function(){

    document.onkeydown = function(event){

        //console.log(e);
        if (event.key == "ArrowLeft"){

            // this saves a STRING
            var e = gg("entry").innerHTML;
            var o = gg("outry").innerHTML;

            // while this saves a REFERENCE capable of changing display
            var outry = gg("outry");
            var entry = gg("entry");
            var total = e + o;

            var mid = e.length - 1;

            entry.innerHTML = total.substring(0, mid);
            outry.innerHTML = total.substring(mid, total.length);

            refreshCursor();
        }

        if (event.key == "ArrowRight"){

            // this saves a string
            var e = gg("entry").innerHTML;
            var o = gg("outry").innerHTML;
            var total = e + o;
            // while this saves a reference capable of changing display
            var outry = gg("outry");
            var entry = gg("entry");

            entry.innerHTML = total.substring(0, e.length + 1);
            outry.innerHTML = total.substring(e.length + 1, total.length);

            refreshCursor();
        }

        if (event.key == "ArrowUp"){

            console.log("Arrow UP");

        } // End of ArrowUp

        if (event.key == "ArrowDown"){
            
            console.log("Arrow Down");

        } // END OF ArrowDown

        if (event.ctrlKey === true && e.key === "p"){
            
/*             console.log("Aye!")
            var entry = gg("entry");
            var outry = gg("outry");

            entry.classList.add("text-title");
            outry.classList.add("text-title");
            cursor.classList.add("cursor-title");

            entry.classList.remove("text-normal");
            cursor.classList.remove("cursor-normal");
            outry.classList.remove("text-normal"); */

        }

    } // END OF OnKeyDown
} // END OF ArrowNav




var whereFocus = function(){
    var phantom = gg('phantom');

    if (document.activeElement === phantom){
        refreshCursor();
    } else {
        phantom.removeEventListener('input', typing);
        gg("cursor").style.display = "none";
    }
}

var refreshCursor = function(){
    phantom.addEventListener('input', typing);
    clearInterval(cursorBlinkGlobal);
    gg("cursor").style.display = "inline";
    gg("cursor").style.visibility = "visible";
    cursorBlink()
    cursorOn = true;
}

var typeWriter = function(){

    var entry = gg("entry");
    var outry = gg("outry");
    var phantom = gg("phantom");
    var placeholder = gg("placeholder");
    phantom.value = phantom.value + "/";
    phantom.focus();
    //placeholder.style.display = "none";
}

var moveCursor = function(m){

    var i = window.getSelection().anchorOffset;

    // this saves a string
    var e = gg("entry").innerHTML;
    var o = gg("outry").innerHTML;

    // while this saves a reference capable of changing display
    var outry = gg("outry");
    var entry = gg("entry");
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

    gg("cursor").style.display = "inline";
    
    state.typing = true;

    var test = gg("test");
    var entry = gg("entry");
    var outry = gg("outry");
    var currentText = entry.innerHTML

    if (e.inputType === "insertText"){


        entry.innerHTML = entry.innerHTML + e.data;
        if (entry.offsetHeight > currentBlock.lastHeight)

            

    } else if (e.inputType === "deleteContentBackward"){

            // Add things to phantom.value to prevent
            // running out of room to delete things in input
            var phantom = gg("phantom")
            phantom.value = phantom.value + "/";

        if (entry.innerHTML == ""){

            var tw = gg("tw");
            var prev = tw.previousElementSibling;

            if (prev === null){
                console.log("you've reached the end of your rope kid!")
            } else {
                entry.innerHTML = prev.innerHTML;
                prev.remove();
            }

        } else {

            var parsed = entry.innerHTML;
            parsed = parsed.substring(0, parsed.length - 1);
            entry.innerHTML = parsed;

        }

    } else {
        console.log("Unknown input type: ", e.inputType);
    }

}

var exception = function(e){
        if (e.key === 'Enter') {
            createNewBlock();
        }
}

var createNewBlock = function(){

            //gg("cursor").style.display = "none";
            var tw = gg("tw")
            var entry = gg("entry");
            var outry = gg("outry");

            var newBlock = document.createElement("div");

            if (entry.innerHTML === ""){
                // blocks with no innerHTML can't be displayed as full-width blocks apparently
                newBlock.innerHTML = "&nbsp;";
            } else {
                newBlock.innerHTML = entry.innerHTML;
            }

            var oldClasses = entry.classList;
            newBlock.classList = oldClasses;
            //newBlock.classList.add("text-normal");

            var page = gg("page");

            entry.innerHTML = "";

            page.insertBefore(newBlock, tw)
}


var cursorBlink = function(){

    // cursorOn is for keeping cursor solid while typing
    // cursorBlinkGlobal is for restarting blink cycle at focus/refocus


    var cursor = gg("cursor");
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



// ***** Some quick and dirty utilities **********

var bug = function(){
    console.log("yes-----we out here-----")
}

var gg = function(id){
    return document.getElementById(id);
}

var setIndex = function(total, index){
    var entry = gg("entry");
    var outry = gg("outry");

    entry.innerHTML = total.substring(0, index);
    outry.innerHTML = total.substring(index, total.length);

    refreshCursor();
    
}