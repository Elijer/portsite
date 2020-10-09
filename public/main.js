document.addEventListener("DOMContentLoaded", function(event) {
    activeItem = false;
    lastClicked = "";
    strings = [
        "Color Picka",
        "Stripe",
        "Unes",
        "Video",
        "Amination",
        "oysters",
        "say hi",
        "mwesy",
        "rez"
    ];

    list = document.querySelectorAll("ul#the-list li");

    for (i = 0; i < 9; i++){
        assignHoverEvent(i);
    }
})

var assignHoverEvent = function(i){
    output = document.getElementById("text-display");
    let target = list[i];
    let blurb = strings[i];
    //console.log(target);

    target.addEventListener("mouseenter", function( event ) {
        output.innerHTML = blurb;
        console.log(blurb);
    })

    target.addEventListener("mouseout", function( event ) {
        output.innerHTML = lastClicked;
    })

    target.addEventListener("click", function( event ) {
        if (activeItem == false){
            output.innerHTML = blurb;
            lastClicked = blurb;
        } else {
            output.innerHTML = "";
            lastClicked = "";
        }
        activeItem = !activeItem;
    })
}