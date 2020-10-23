var next = tw.nextElementSibling;
if (next){

    var nextText = next.innerHTML;
    if (nextText === "&nbsp;") nextText = '';
    var page = gg("page");
    page.insertBefore(next, tw);
    next.innerHTML = total;

    // Edge case: when at the very last position
    if (!currentLineBeginIndex){

        entry.innerHTML = "";
        outry.innerHTML = nextText;
        var height = entry.offsetHeight;

        for (var i = 0; i < nextText.length; i++){
            var take = outry.innerHTML.substring(0, 1);
            entry.innerHTML = entry.innerHTML + take;
            outry.innerHTML = outry.innerHTML.substring(1);

            if (entry.offsetHeight > height){
                entry.innerHTML = nextText.substring(0, i-1);
                outry.innerHTML = nextText.substring(i-1, nextText.length);
                break;
            }
        }
        
    } else {
        var indexFromLineBeginning = e.length - currentLineBeginIndex;

        entry.innerHTML = nextText.substring(0, indexFromLineBeginning);
        outry.innerHTML = nextText.substring(indexFromLineBeginning, nextText.length);
    }
}