document.addEventListener("DOMContentLoaded", function(event) {
    var activeClick = false;
    var lastClicked = "";
    let strings = [
        "Color Picka",
        "Stripe",
        "Unes",
        "Video",
        "Amination",
        "oysters (interview)",
        "say hi",
        "mwesy",
        "rez"
    ];

    var chillun = document.getElementById("the-list").childNodes;
    console.log(chillun[1].innerHTML);

    for (var i = 0; i < strings.length; i++){
        //console.log(strings[i]);
    }
})

/* function assignHoverEvent(target){
    let target = document.getElementById(target);
    let output = document.getElementById("text-display");

    target.addEventListener("mouseenter", function( event ) {
        output.innerHTML = someString;
    })

    target.addEventListener("mouseout", function( event ) {
        output.innerHTML = lastClicked;
    })

    target.addEventListener("click", function( event ) {
        if (activeItem == false){
            output.innerHTML = someString;
            lastClicked = someString;
        } else {
            output.innerHTML = "";
            lastClicked = "";
        }
        activeItem = !activeItem;
    })
} */