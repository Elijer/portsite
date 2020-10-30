document.addEventListener("DOMContentLoaded", function(event) {
    txt = "";
    txt2 = "";
    txt3 = "";
    cursorBlink();
    cursorOn = false;

    initiateHotkeys();
    arrowNav();

    // This is one specifically for the enter key
    document.querySelector('#phantom').addEventListener('keypress', exception);

    state = {
        typing: false
    }

    var dash = gg("grid-container");
    dash.children[0].style.background = "#292e35";

})

var arrowNav = function(){

    document.onkeydown = function(event){

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

            let e = gg("entry").innerHTML,
                o = gg("outry").innerHTML,
                total = e + o;

            var outry = gg("outry");
            var entry = gg("entry");
                
            entry.innerHTML = '';
            outry.innerHTML = total.substring(0, total.length);

            var height = entry.offsetHeight;

            // mechanics
            var line = 0;
            var lastLine = 0;
            var lines = [];

            //observations
            var currentLine = 0;
            var currentLineBeginIndex = 0;

            for (var i = 0; i <= total.length; i++){

                var take = outry.innerHTML.substring(0, 1)
                entry.innerHTML = entry.innerHTML + take;
                outry.innerHTML = outry.innerHTML.substring(1);

                if(entry.offsetHeight > height){
                    height = entry.offsetHeight;
                    line++;
                    lastLine = i;
                }

                if (i === e.length){
                    currentLine = line;
                    currentLineBeginIndex = lastLine;
                }

                if (!lines[line]) lines[line] = '';
                lines[line] = lines[line] + take;
            }

            var currentLineIndex = e.length - currentLineBeginIndex;

            // check to see if it's the top line
            if (currentLine === 0){
                var tw = gg("tw");
                var prev = tw.previousElementSibling;

                if (prev){

                    var page = gg("page");

                    page.insertBefore(tw, prev)

                    // check to see if previous block is 'empty', meaning it holds non-displayed, placeholder text ('///')
                    if (prev.classList.contains("empty")){
                        entry.innerHTML = "";
                        outry.innerHTML = "";
                        prev.innerHTML = total;

                        // class swap
                        var prevClass = immutableArray(prev.classList);
                        var entryClass = immutableArray(entry.classList);
                        prev.classList = entryClass;
                        
                        // Switching to empty blocks defaults to text-normal
                        entry.classList = ["text-normal"];
                        outry.classList = ["text-normal"];

                    } else {

                        let prevText = prev.innerHTML;
                        var prevClass = immutableArray(prev.classList);
                        var entryClass = immutableArray(entry.classList);
                        outry.innerHTML = prevText;
                        entry.innerHTML = ""
                        prev.innerHTML = total;

                        // loop mechanics
                        var height = entry.offsetHeight;
                        var take;
                        var line = 0;
                        var lines = [];

                        // loop observables
                        var lastLine = 0;
                        var currentLine = 0;
                        var currentLineBeginIndex = 0;

                        for (var i = 0; i <= prevText.length; i++){
                            take = outry.innerHTML.substring(0, 1);
                            entry.innerHTML = entry.innerHTML + take;
                            outry.innerHTML = outry.innerHTML.substring(1);

                            if (entry.offsetHeight > height){
                                height = entry.offsetHeight;
                                line++;
                                lastLine = i
                            }

                            if (!lines[line]) lines[line] = '';
                            lines[line] = lines[line] + take;
                        }

                        // if there is only one line, the for loop won't work because the height never changes.
                        if (lines.length === 1){
                            entry.innerHTML = prevText.substring(0, currentLineIndex);
                            outry.innerHTML = prevText.substring(currentLineIndex, prevText.length);

                        // otherwise, you can use the lastLine generated by the for loop with the currentLineIndex generated by the one before.
                        } else {
                            var newIndex = lastLine + currentLineIndex;
                            setIndex(prevText, newIndex);
                        }

                        prev.classList = entryClass;
                        entry.classList = prevClass;
                        outry.classList = prevClass;
                    }

                    // if you are leaving behind an empty block, style it correctly
                    if (total === ""){
                        prev.classList.add("empty");
                        prev.innerHTML = "///";
                    }

                } else {
                    entry.innerHTML = e;
                    outry.innerHTML = o;
                    refreshCursor();
                }

            } else {
                
                setIndex(total, currentLineBeginIndex - lines[currentLine - 1].length + currentLineIndex )

            }

            refreshCursor();
        } // End of ArrahUrp

        if (event.key == "ArrowDown"){

            let e = gg("entry").innerHTML,
                o = gg("outry").innerHTML,
                total = e + o;

            var entry = gg("entry"),
                outry = gg("outry");

            // set up for loop
            entry.innerHTML = '';
            outry.innerHTML = total;
            // height must come after
            var height = entry.offsetHeight;

                // mechanics
                var line = 0;
                var lines = [];

                // discoveries
                var lastBegin = 0;
                var currentLine = 0;

            for (var i = 0; i <= total.length; i++){

                var take = outry.innerHTML.substring(0, 1)
                entry.innerHTML = entry.innerHTML + take;
                outry.innerHTML = outry.innerHTML.substring(1);

                if(entry.offsetHeight > height){
                    height = entry.offsetHeight;
                    line++;
                    lastBegin = i;
                }

                if (i === e.length){
                    currentLine = line;
                    currentLineBeginIndex = lastBegin;
                }

                if (!lines[line]) lines[line] = '';
                // save to array
                lines[line] = lines[line] + take;
            }

            var lineIndex = e.length - currentLineBeginIndex;

            // on last line
            if (currentLine === lines.length - 1){
                let tw = gg("tw");
                let next = tw.nextElementSibling;

                if (next){

                    if (next.classList.contains("empty")){
                        //next.classList.remove("empty");
                        // Switching to an empty block defaults tw to "text-normal":
                        next.classList = ["text-normal"];
                        next.innerHTML = "";

                    }

                    var nextText = next.innerHTML;
                    var nextClass = immutableArray(next.classList)
                    var entryClass = immutableArray(entry.classList);
                    var page = gg("page");

                    page.insertBefore(next, tw);

                    next.innerHTML = total;
                    entry.innerHTML = nextText.substring(0, lineIndex)
                    outry.innerHTML = nextText.substring(lineIndex, nextText.length)

                    next.classList = entryClass;
                    outry.classList = nextClass;
                    entry.classList = nextClass;

                    refreshCursor();

                    // if next is empty, style it that way
                    if (next.innerHTML === ""){
                        next.classList.add("empty");
                        next.innerHTML = "///";
                    }

                } else {
                    setIndex(total, e.length);
                }

            } else {
                // set at same position but next line
                setIndex(total, currentLineBeginIndex + lines[currentLine].length + lineIndex);
            }
        } // END OF ArrowDown

        if (event.key === "Backspace"){

            var entry = gg("entry");
            
            if (entry.innerHTML == ""){

                var tw = gg("tw");
                var prev = tw.previousElementSibling;

                if (prev === null){
                    console.log("you've reached the end of your rope kid!")
                } else {
    
                    if (prev.classList.contains("empty")){
                        entry.innerHTML = "";
                    } else {
                        entry.innerHTML = prev.innerHTML
                    }
    
                    prev.remove();
    
                }

            } else {
    
                var parsed = entry.innerHTML;
                parsed = parsed.substring(0, parsed.length - 1);
                entry.innerHTML = parsed;
    
            }
        }

        
        // if (event.ctrlKey === true && e.key === "Backspace"){

        if (event.ctrlKey === true && event.key === "y"){

            var entry = gg("entry")
            var outry = gg("outry")
            var classList = entry.classList
            var classList2 = outry.classList
            var current;

            for (var i = 0; i < classList.length; i++){
                current = classList[i];
                if (current.includes("text")){
                    classList.remove(classList[i]);
                    classList2.remove(classList2[i]);
                    
                }
            }

            classList.add("text-normal");
            classList2.add("text-normal");

            setDash(0);

        }

        if (event.ctrlKey === true && event.key === "n"){

            var entry = gg("entry")
            var outry = gg("outry")
            var classList = entry.classList
            var classList2 = outry.classList
            var current;

            for (var i = 0; i < classList.length; i++){
                current = classList[i];
                if (current.includes("text")){
                    classList.remove(classList[i]);
                    classList2.remove(classList2[i]);
                    
                }
            }

            classList.add("text-noah");
            classList2.add("text-noah");

            setDash(3);

        }

        if (event.ctrlKey === true && event.key === "u"){

            var entry = gg("entry")
            var outry = gg("outry")
            var classList = entry.classList
            var classList2 = outry.classList
            var current;

            for (var i = 0; i < classList.length; i++){
                current = classList[i];
                if (current.includes("text")){
                    classList.remove(classList[i]);
                    classList2.remove(classList2[i]);
                }
            }

            classList.add("text-title");
            classList2.add("text-title");

            setDash(1);

        }

        if (event.ctrlKey === true && event.key === "i"){

            var entry = gg("entry")
            var outry = gg("outry")
            var classList = entry.classList
            var classList2 = outry.classList
            var current;

            for (var i = 0; i < classList.length; i++){
                current = classList[i];
                if (current.includes("text")){
                    classList.remove(classList[i]);
                    classList2.remove(classList2[i]);
                }
            }

            classList.add("text-fun");
            classList2.add("text-fun");

            setDash(2);

        }

    } // END OF OnKeyDown
} // END OF ArrowNav

var initiateHotkeys = function(){
    document.onkeyup = function(e) {
        // https://medium.com/@melwinalm/crcreating-keyboard-shortcuts-in-javascripteating-keyboard-shortcuts-in-javascript-763ca19beb9e

            if (e.key === "q" && e.ctrlKey === true){

        }
      };
}


var whereFocus = function(){
    var phantom = gg('phantom');

    if (document.activeElement === phantom){
        if (gg("placeholder")){
            gg("placeholder").style.display = "none";
        }
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

    } else if (e.inputType === "deleteContentBackward"){

        //

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

    var entry = gg("entry");
    var outry = gg("outry");

    if (entry.innerHTML === ""){
        var newBlock = document.createElement("div");
        var oldClasses = entry.classList;
        newBlock.classList = oldClasses;
        newBlock.classList.add("empty");
        newBlock.innerHTML = "///"
        var page = gg("page");
        page.insertBefore(newBlock, tw);
        entry.innerHTML = "";
    } else {
        
        // NOTE: As is, if the user happens to be at the very beginning of a line (but not the first line of a block)
        // and they press enter, they will break it off into a new block but the 'cut' is so perfect that there is no
        // indication that they did anything. One fix is simply a UX one, where something visual happens to indicate the split.
        // The other fix is functional: I could make it so that in this situation, a full line of space is automatically added.
        // This might be annoying if you wanted to style each line separately for some reason, which I haven't ruled out as something
        // people might want to do, or even for myself.

        // construct a new block to leave behind with tw's content
        var newBlock = document.createElement("div");
        newBlock.innerHTML = entry.innerHTML.trim();
        // give newBlock all class that tw had ("normal-text" by default)
        var oldClasses = entry.classList;
        newBlock.classList = oldClasses;
        // NOTE: make sure that tw retains the class it had
        var page = gg("page");
        page.insertBefore(newBlock, tw)
        entry.innerHTML = "";
        outry.innerHTML = outry.innerHTML.trim();
    }


    refreshCursor();
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

var immutableArray = function(arr){
    var returnedArray = [];

    for (var i = 0; i < arr.length ; i++){
        returnedArray[i] = arr[i];
    }
    return returnedArray;
}


var immutableArray = function(arr){
    var returnedArray = [];

    for (var i = 0; i < arr.length ; i++){
        returnedArray[i] = arr[i];
    }
    return returnedArray;
}


var getActiveClass = function(entry){

    var classes = entry.classList;
    var activeClass;

    for (var i = 0; i < classes.length ; i++){
        if (classes[i].includes("text")){
            activeClass = classes[i];
        }
    }

    return activeClass;

}

var immutableArray = function(arr){
    var returnedArray = [];

    for (var i = 0; i < arr.length ; i++){
        returnedArray[i] = arr[i];
    }
    return returnedArray;
}

var getActiveClass = function(entry){

    var classes = entry.classList;
    var activeClass;

    for (var i = 0; i < classes.length ; i++){
        if (classes[i].includes("text")){
            activeClass = classes[i];
        }
    }

    return activeClass;

}

var setDash = function(num){
    var dash = gg("grid-container").children;
    var current;
    
    for (var i = 0; i < dash.length; i++){
        dash[i].style.background = "none"
    }

    dash[num].style.background = "#292e35";


}