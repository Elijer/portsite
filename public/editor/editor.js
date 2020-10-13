document.addEventListener("DOMContentLoaded", function(event) {

    string = ``;

    var phantom = document.getElementById("phantom");

    phantom.addEventListener('input', typing);
})

var typeWriter = function(){
    console.log("ding!");

    var page = document.getElementById("page");
    var phantom = document.getElementById("phantom");
    phantom.focus();
    page.innerHTML = `Donkey!!`;

}

var typing = function(e){
    console.log(e.target.value)
    //log.textContent = e.target.value;
}

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