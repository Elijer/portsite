/*

CURRENT TASK: Fix the css specificity.

I now see why styling should be done with class instead of id. I need
to understand how the style cascades a little better in order to address
how I am going to change the cursor style without using !important.
The way the style gets inherited and stuff in general, is going to cause
problems for defining these classes that I want to add on to the cursor
and the innerHTML of each block. ALSO. I need to allow people to navigate
using the up and down arrow keys as well. But that will be another thing
to really scrutinize. Perhaps? Idk I guess I could try.

" Well that was, at least for now, simpler than expected"
PAST TASK: 'Intelligent' New Line

When enter is pressed, a new line is created, but not simply with </br>
The existing line will be wrapped in a new type of div called class = "line"
or something, and while it is not active, it's entry and outry will be
removed and replaced with their combined text, and the cursor will be
removed.

Meanwhile, a new div with the "line" class will be created and an "entry"
and "outry" span will be placed inside, as well as a cursor in between them.
Because cursor, entry an outry are IDs, they must be kept to a single one
at any time. This is good, because I don't WANT more than one of these things
at any time.

However, each line will need to have a unique class to be identified. It will
probably just be something like <div class = "line" class = "line-4">.

Q: What about when a line break naturally occurs? Well, I would like to definitely
keep that. I don't want all this stuff to have to happen in response to natural
line breaks being formed or unformed. I ONLY want this functionality to occur
due to user-initiated-indenting. As such, they probably shouldn't be called
class = "line". They should be called class = "block" and "block-1".

I just tested that display type and I think it's pretty good. Ideally, later on,
I could also make it so that the active block is highlighted. Or perhaps there is
a highlight key that makes it so. And that highlight shows you what would be styled
with the style hotkeys. Plus, if I DID create an "active block" navigation mode,
you could navigated quickly from block to block and easily change styles that way,
which at girst glance sounds great.

So, here's some psuedo code then:

1. User types some stuff
2. User presses "enter"
3. a global variable called "currentBlock" is consulted, which stores the name of
    the classname, which would be "block-1" in this case.
4. "block-1" is identified. The inner.HTML of entry and outry is combined into a 
    string called "content". The entry, outry and cursor elements are deleted.
    "block-1".innerHTML is replaced with "content". 
5. At this point, ALL of the "block-n" classes after this point will have to be
    shifted up +1 in order to make room for a new one...NOTE: this means that
    blocks can't be identified, historically at least, by block-n alone. If
    they NEED a unique identifiying class, I could probably generate a hash.
    That would be the kind of thing that would get saved into a database, probably
    into a user as a sub-collection, right next to an array of objects that
    lists all of the included block hashes in a specific order with their contents
    and style type. THEN these arrays oculd be saved in a HISTORY array, which would
    allow for version control, command+z, that sort of thing.

*/

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
            //console.log(currentLineBeginIndex);

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
                        prev.classList.remove("empty");

                    } else {
                        
                        var prevText = prev.innerHTML;
                        prev.innerHTML = total;
                        outry.innerHTML = "";
                        entry.innerHTML = prevText;
                        height = outry.offsetHeight;
    
                        var i = prevText.length;
                        var breakPoint = prevText.length;
                        var take;
    
                        // This loop finds the last breakpoint in the block, which is used to calculate the new index
                        while (i > 0 && height >= outry.offsetHeight){
                            breakPoint = i;
                            i--;
                            take = entry.innerHTML.substring(entry.innerHTML.length - 1, entry.innerHTML.length)
                            entry.innerHTML = entry.innerHTML.substring(0, entry.innerHTML.length - 1);
                            outry.innerHTML = take + outry.innerHTML;
                        }

                        // if block you are leaving behind is empty,
                        // make sure to style it and leave the filler material
                        
                        var newIndex = breakPoint + 1 + currentLineIndex;
                        console.log(newIndex);

                        entry.innerHTML = prevText.substring(0, newIndex);
                        outry.innerHTML = prevText.substring(newIndex, prevText.length);
                        refreshCursor();
                    }

                    // if you are leaving behind an empty block, style it correctly
                    if (total === ""){
                        prev.classList.add("empty");
                        prev.innerHTML = "///";
                    }
                }

            } else {
                
                setIndex(total, currentLineBeginIndex - lines[currentLine - 1].length + currentLineIndex )

            }
        } // End of ArrowUp

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

                // okay wait hear me out, I could write a function that worked for both tw and a random div
                // and I could just feed both the random
            

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
                        next.classList.remove("empty");
                        next.innerHTML = "";
                    }

                    console.log("Last Line & Next exists")
                    var nextText = next.innerHTML;
                    var page = gg("page");
                    page.insertBefore(next, tw);
                    next.innerHTML = total;
                    entry.innerHTML = nextText.substring(0, lineIndex)
                    outry.innerHTML = nextText.substring(lineIndex, nextText.length)

                    refreshCursor();
                } else {
                    console.log("last line but next doesn't exist")
                    setIndex(total, e.length);
                }

                // if next is empty, style it that way
                if (next.innerHTML === ""){
                    next.classList.add("empty");
                    next.innerHTML = "///";
                }

            } else {
                // set at same position but next line
                setIndex(total, currentLineBeginIndex + lines[currentLine].length + lineIndex);
            }
        } // END OF ArrowDown


        if (event.ctrlKey === true && e.key === "Backspace"){
            var e = gg("entry").innerHTML;
            var entry = gg("entry");
            entry.innerHTML = e.substring(0, e.length - 1 )

            // Add things to phantom.value so that you don't run out of room to delete things
            // var phantom = gg("phantom")
            // phantom.value = phantom.value + "///";
        
        }

        if (event.ctrlKey === true && e.key === "p"){
            
            console.log("Aye!")
            var entry = gg("entry");
            var outry = gg("outry");

            entry.classList.add("text-title");
            outry.classList.add("text-title");
            cursor.classList.add("cursor-title");

            entry.classList.remove("text-normal");
            cursor.classList.remove("cursor-normal");
            outry.classList.remove("text-normal");

        
        }

    } // END OF OnKeyDown
} // END OF ArrowNav

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
    var phantom = gg('phantom');

    if (document.activeElement === phantom){
        refreshCursor();
/*      phantom.addEventListener('input', typing);
        clearInterval(cursorBlinkGlobal);
        gg("cursor").style.display = "inline";
        gg("cursor").style.visibility = "visible";
        cursorBlink()
        cursorOn = true; */
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

            // Add things to phantom.value to prevent
            // running out of room to delete things in input
            var phantom = gg("phantom")
            phantom.value = phantom.value + "///";

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

    var next = gg("tw").nextElementSibling;
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
        
/*         // This loop finds the last breakpoint in the block, which is used to calculate the new index
        while (i > 0 && height >= outry.offsetHeight){
            breakPoint = i;
            i--;
            take = entry.innerHTML.substring(entry.innerHTML.length - 1, entry.innerHTML.length)
            entry.innerHTML = entry.innerHTML.substring(0, entry.innerHTML.length - 1);
            outry.innerHTML = take + outry.innerHTML;
        } */
        


        // construct a new block to leave behind with tw's content
        var newBlock = document.createElement("div");
        newBlock.innerHTML = entry.innerHTML;
        // give newBlock all class that tw had ("normal-text" by default)
        var oldClasses = entry.classList;
        newBlock.classList = oldClasses;
        // NOTE: make sure that tw retains the class it had
        var page = gg("page");
        page.insertBefore(newBlock, tw)
        entry.innerHTML = "";
    }
    // IF
    // entry is blank. in that case, create a new block with "empty" class.
    // ELSE
    // create a new block that has the outry (if the outry is "", so much the better.)
    // leaves the entry in the last block
    // sets entry to ""

    // okay so I cursor delete, down, cursor up, click another block, cursor right, OR cursor left to another block
    // that has an "empty" class. What now?
    // Once you've checked each of this situations of the "empty" class and confirmed it,
    // Remove the "empty" class and the innerHTML. You should be good to go.





    //gg("cursor").style.display = "none";
/*             var tw = gg("tw")
    var entry = gg("entry");

    var newBlock = document.createElement("div");

    newBlock.innerHTML = entry.innerHTML;

    var oldClasses = entry.classList;
    newBlock.classList = oldClasses;
    newBlock.classList.add("empty");

    var page = gg("page");

    page.insertBefore(newBlock, tw) */
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