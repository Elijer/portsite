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
            var total = e + o;

            var outry = gg("outry");
            var entry = gg("entry");

            // get the number of lines in current document
            var tw = gg("tw");
            var lines = tw.getClientRects().length;
                
                // entry gets nothing
                entry.innerHTML = '';
                // and start with everything in outry
                outry.innerHTML = total.substring(0, total.length);

                var line = 0;
                var lastBegin;
                var currentLineBeginIndex;
                var currentLineEndIndex;
                var currentLineLastChar;
                var indexFromLineBeginning;
                var lastLineBeginning;
                var newIndex;
                var lines = [];
                // height is saved to check for linebreaks.
                // One tricky part here is that I'm not sure if spaces can trigger a linebreak.
                // another tricky part: if entry start with nothing, will the offsetHeight be different when first character is added?
                var height = entry.offsetHeight;
                var currentLine;
                
                // Now we iterate through outry.innerHTML and move characters one by one to entry to observe which ones trigger line breaks
                // and therefore which characters are on which line;

                for (var i = 0; i < total.length; i++){

                    // take will be the character we are transfering in this iteration
                    var take = outry.innerHTML.substring(0, 1)
                    // add it to the end of entry
                    entry.innerHTML = entry.innerHTML + take;
                    // remove first character of outry from outry
                    outry.innerHTML = outry.innerHTML.substring(1);

                    // check to see if this character changes the height
                    if(entry.offsetHeight > height){
                        // if so, we raise the bar.
                        height = entry.offsetHeight;
                        line++;
                        lastBegin = i;
                    }

                    if (i === e.length){
                        currentLine = line;
                        currentLineBeginIndex = lastBegin;
                    }

                    // create array[index] if it doesn't exist yet
                    // this means we don't need to define how many lines the array is up front, which is good
                    // since we don't know.
                    if (!lines[line]) lines[line] = '';

                    
                    lines[line] = lines[line] + take;

                }

                currentLineEndIndex = currentLineBeginIndex + lines[currentLine].length;
                
                var l = lines[currentLine]
                currentLineLastChar = l.substring(l.length - 1, l.length);

                // BUT if the last character of the current line is a space, then there's really one less position than there ought
                // because spaces at the end of lines seem to be ignored.
                // so we have to adjust our currenLineEndIndex variable.
                // however, I think they all have spaces, to be honest. But if for some reason they don't, this should cover
                if (currentLineLastChar = ' '){
                    currentLineEndIndex--;
                }

                // check to see if there is a line above at all.
                if (currentLine === 0){
                    var prev = tw.previousElementSibling;
                    if (prev){
                        
                        var prevText = prev.innerHTML;
                        if (prevText === "&nbsp;") prevText = '';
                        page.insertBefore(tw, prev);

                        entry.innerHTML = prevText;
                        outry.innerHTML = "";
                        prev.innerHTML = total;

                        // shit, I've got to know what index the last
                        // line of the previous block starts on.
                        var lineBeginning = 0;
                        var i = prevText.length;
                        let height = outry.offsetHeight;
                        var lastLineIndex = 0;

                        for (var i = total.length; i > 0; i--){
                            var take = entry.innerHTML.substring(entry.innerHTML.length - 1, entry.innerHTML.length)
                            //console.log(outry.offsetHeight);
                            outry.innerHTML = take + outry.innerHTML;
                            entry.innerHTML = entry.innerHTML.substring(0, entry.innerHTML.length - 1)
                            if (outry.offsetHeight > height){
                                lastLineIndex = entry.innerHTML.length + 2;
                                break;
                            }
                            
                        }
                        
                        var newIndex = lastLineIndex + e.length;
                        console.log(newIndex);
                        entry.innerHTML = prevText.substring(0, newIndex);
                        outry.innerHTML = prevText.substring(newIndex, prevText.length);
                        refreshCursor();
/*                         entry.innerHTML = entry.innerHTML.substring(0, newIndex)
                        outry.innerHTML = outry.innerHTML.substring(newIndex, total.length);  */
                        
                        
                        // the new index is 
/*                         var newIndex = e.length + currentLineBeginIndex;
                        entry.innerHTML = entry.innerHTML.substring(0, newIndex)
                        outry.innerHTML = outry.innerHTML.substring(newIndex, o.length); */


/* 
                        var setIndex = function(total, index){
                            var entry = gg("entry");
                            var outry = gg("outry");
                        
                            entry.innerHTML = total.substring(0, index);
                            outry.innerHTML = total.substring(index, total.length);
                        
                            refreshCursor();
                            
                        } */

                    } else {
                        // if no previous block, just reset index
                        setIndex(total, e.length)
                    }

                } else {

                    lastLineBeginning = currentLineBeginIndex - lines[currentLine - 1].length;
                    indexFromLineBeginning = e.length - currentLineBeginIndex;

                    // Check to see if line above is shorter, in which case just go to the end
                    if (indexFromLineBeginning > lines[(currentLine - 1)].length){
                        setIndex(total, currentLineBeginIndex - 1)

                    // and then this is the normal case
                    } else {
                        newIndex = lastLineBeginning + indexFromLineBeginning;
                        setIndex(total, newIndex);
                    }
                }
        } // End of ArrowUp

        if (event.key == "ArrowDown"){

            var e = gg("entry").innerHTML;
            var o = gg("outry").innerHTML;
            var total = e + o;

            var outry = gg("outry");
            var entry = gg("entry");

            // get the number of lines in current document
            var tw = gg("tw");
            var lines = tw.getClientRects().length;

            if (lines > 1){
                
                // entry gets nothing
                entry.innerHTML = '';
                // and start with everything in outry
                outry.innerHTML = total.substring(0, total.length);

                var line = 0;
                var lastBegin = 0;
                var currentLineBeginIndex;
                var currentLineEndIndex;
                var currentLineLastChar;
                var indexFromLineBeginning;
                var nextLineBeginningIndex;
                var newIndex;
                var lines = [];
                // height is saved to check for linebreaks.
                // One tricky part here is that I'm not sure if spaces can trigger a linebreak.
                // another tricky part: if entry start with nothing, will the offsetHeight be different when first character is added?
                var height = entry.offsetHeight;
                var currentLine;
                
                // Now we iterate through outry.innerHTML and move characters one by one to entry to observe which ones trigger line breaks
                // and therefore which characters are on which line;

                for (var i = 0; i < total.length; i++){

                    // take will be the character we are transfering in this iteration
                    var take = outry.innerHTML.substring(0, 1)
                    // add it to the end of entry
                    entry.innerHTML = entry.innerHTML + take;
                    // remove first character of outry from outry
                    outry.innerHTML = outry.innerHTML.substring(1);

                    // check to see if this character changes the height
                    if(entry.offsetHeight > height){
                        // if so, we raise the bar.
                        height = entry.offsetHeight;
                        line++;
                        lastBegin = i;
                    }

                    if (i === e.length){
                        currentLine = line;
                        currentLineBeginIndex = lastBegin;
                    }

                    // create array[index] if it doesn't exist yet
                    // this means we don't need to define how many lines the array is up front, which is good
                    // since we don't know.
                    if (!lines[line]) lines[line] = '';

                    
                    lines[line] = lines[line] + take;

                }

                currentLineEndIndex = currentLineBeginIndex + lines[currentLine].length;
                
                var l = lines[currentLine]
                currentLineLastChar = l.substring(l.length - 1, l.length);

                // BUT if the last character of the current line is a space, then there's really one less position than there ought
                // because spaces at the end of lines seem to be ignored.
                // so we have to adjust our currenLineEndIndex variable.
                // however, I think they all have spaces, to be honest. But if for some reason they don't, this should cover
                if (currentLineLastChar = ' '){
                    currentLineEndIndex--;
                }

                // if currentLine is the last line, you're going to have to check to see if there's another block
                // but otherwise, you can set the index to the end like this:
                if (currentLine === line){
                    setIndex(total, total.length)

                } else {

                    console.log(currentLineBeginIndex);

                    nextLineBeginningIndex = currentLineBeginIndex + lines[currentLine].length;
                    indexFromLineBeginning = e.length - currentLineBeginIndex;
                    var nextLineLength = lines[(currentLine + 1)].length - 1;

                    // Check to see if line below is shorter, in which case just go to the end of it
                    if (indexFromLineBeginning > nextLineLength){
                        setIndex(total, nextLineBeginningIndex + nextLineLength)

                    // and then this is the normal case
                    } else {
                        newIndex = nextLineBeginningIndex + indexFromLineBeginning;
                        setIndex(total, newIndex);
                    }
                }

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

var setIndex = function(total, index){
    var entry = gg("entry");
    var outry = gg("outry");

    entry.innerHTML = total.substring(0, index);
    outry.innerHTML = total.substring(index, total.length);

    refreshCursor();
    
}