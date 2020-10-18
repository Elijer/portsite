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

            var e = gg("entry").innerHTML;
            var o = gg("outry").innerHTML;

            var outry = gg("outry");
            var entry = gg("entry");
            var page = gg("page");

            // get the number of lines in current document
            var tw = gg("tw");
            var lines = tw.getClientRects().length;

            if (lines > 1){
                
                // leave one char in entry, put the rest in outry.
                entry.innerHTML = entry.innerHTML.substring(0, 1);
                outry.innerHTML = e.substring(1, e.length) + o;
                var line = 0;
                var lines = [];
                lines[0] = entry.innerHTML;
                var height = entry.offsetHeight;

                // add all characters to #entry one-by-one to map linebreaks locations
                for (var i = 1; i < e.length; i++){

                    // copy first character of outry
                    var take = outry.innerHTML.substring(0, 1)
                    // add it to the end of entry
                    entry.innerHTML = entry.innerHTML + take;
                    // remove first character of outry from outry
                    outry.innerHTML = outry.innerHTML.substring(1);

                    if(entry.offsetHeight > height){
                        height = entry.offsetHeight;
                        line = line + 1;
                    }

                    // create array[index] if it doesn't exist yet
                    if (!lines[line]) lines[line] = '';

                    lines[line] = lines[line] + take;
                }

                // set useful waypoints
                var currentLine = lines[line];
                var lastLine = lines[line - 1];
                var total = e + o;
                var newIndex;
                var lastLineBegin = entry.innerHTML.length - currentLine.length - lastLine.length;

                // address edge case for when lastline is shorter than current one.
                if (lastLine.length < currentLine.length){
                    newIndex = lastLineBegin + lastLine.length - 1;
                } else {
                    newIndex = lastLineBegin + currentLine.length
                }  

                // set cursor at new index!
                entry.innerHTML = total.substring(0, newIndex);
                outry.innerHTML = total.substring(newIndex, total.length);
                refreshCursor();

            } else {

                var prev = tw.previousElementSibling;
                //var next = tw.nextElementSibling;
    
                if (prev){
                    var p = prev.innerHTML;
    
                    if (p == "&nbsp;"){
                        p = "";
                    }
    
                    if (e+o == ""){
                        e = "&nbsp;"
                    }
        
                    page.insertBefore(tw, prev);
        
                    entry.innerHTML = p;
                    prev.innerHTML = e + o;
                    outry.innerHTML = "";
                }
                // Blocks with no innerHTML aren't displayed, so you must add something.
            }

        }

        if (event.key == "ArrowDown"){

            var e = gg("entry").innerHTML;
            var o = gg("outry").innerHTML;

            var outry = gg("outry");
            var entry = gg("entry");
            var page = gg("page");
            var tw = gg("tw");

            // get the number of lines in current document
            var lines = tw.getClientRects().length;

            if (lines > 1){

                var line = 0;
                lines = [];
                var height = entry.offsetHeight;

                for (var i = 1; i < o.length+1; i++){

                    // copy first character of outry
                    var take = outry.innerHTML.substring(0, 1);
                    // add it to the end of entry
                    entry.innerHTML = entry.innerHTML + take;
                    // remove it from outry
                    outry.innerHTML = outry.innerHTML.substring(1);
                    
                    // check to see if this changed the height,
                    // indicating it was a line break.
                    if(entry.offsetHeight > height){
                        height = entry.offsetHeight;
                        line = line + 1;
                    }

                    // create array[index] if it doesn't exist yet
                    if (!lines[line]) lines[line] = ''

                    lines[line] = lines[line] + take;
                    
                } // end of character iterator 1

                var totalLines = line;

                // this one specifically checks if there are more lines AFTER
                // the cursor not just if there are more than one lines
                if (totalLines > 0){
                    var total = e + o;

                    // backwards iterator to discover how many backsteps to beginning of line
                    var count = 0;
                    entry.innerHTML = total.substring(0, newIndex)
                    outry.innerHTML = total.substring(newIndex, total.length)
                    refreshCursor();
                    
                    entry.innerHTML = e;
                    var height = entry.offsetHeight;

                    entry.innerHTML = e;
                    outry.innerHTML = o;

                    // determine backsteps
                    for (var i = e.length; i > 0; i--){
                        entry.innerHTML = total.substring(0, entry.innerHTML.length-1);
                        outry.innerHTML = total.substring(entry.innerHTML.length-1, total.length);
                        //console.log(entry.innerHTML);
                        count++;

                        //console.log("new height is ", entry.offsetHeight)
                        if (entry.offsetHeight < height){
                            if (!backsteps){
                                var backsteps = count;
                            }
                        }
                    }

                    var negativePosition = lines[0].length;
                    var newIndex = e.length + negativePosition + backsteps;

                    entry.innerHTML = total.substring(0, newIndex)
                    outry.innerHTML = total.substring(newIndex, total.length)
                    refreshCursor();
                    
                    //console.log(negativePosition)
                } else {
                    // reset
                    entry.innerHTML = e;
                    outry.innerHTML = o;
                    refreshCursor();
                }
/*                 var currentLine = lines[line];
                var lastLine = lines[line - 1];
                var total = e + o;
                var newIndex;
                var lastLineBegin = entry.innerHTML.length - currentLine.length - lastLine.length; */

            } else {
                                /* ********** */
                var prev = tw.previousElementSibling;
                
                var next = tw.nextElementSibling;

                if (next){
                    var n = next.innerHTML;

                    if (n == "&nbsp;"){
                        n = "";
                    }

                    entry.innerHTML = n;
                    next.innerHTML = e + o;
                    outry.innerHTML = "";

                    page.insertBefore(next, tw);
                }

            } // END OF ELSE

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

        if (e.data == " "){
            entry.innerHTML = entry.innerHTML + " ";
            //test.innerHTML = entry.innerHTML + '&nbsp;';
        } else {
/*             var parsed = entry.innerHTML;
            parsed = parsed.replaceAll("&nbsp;", " "); */
            entry.innerHTML = entry.innerHTML + e.data;

        }

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

function countLines(id) { 
  
    // Get element with 'content' as id                             
    var el =  
        document.getElementById(id);

    // Get total height of the content     
    var divHeight = el.offsetHeight 

    // object.style.lineHeight, returns  
    // the lineHeight property 
    // height of one line  
    var lineHeight =  
        parseInt(el.style.lineHeight); 

    var lines = divHeight / lineHeight; 
    return lines;
} 