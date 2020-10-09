document.addEventListener("DOMContentLoaded", function(event) {
    var clicked = false;
    var lastClicked = "";
    let someString = "This is a project I created because I was getting really tired of opening up photoshop every time I wanted to change something.";
    let target = document.getElementById("1");
    let output = document.getElementById("text-display");
    target.addEventListener("mouseenter", function( event ) {
        output.innerHTML = someString;
    })
    target.addEventListener("mouseout", function( event ) {
        output.innerHTML = lastClicked;
    })
    target.addEventListener("click", function( event ) {
        if (clicked == false){
            output.innerHTML = someString;
            lastClicked = someString;
        } else {
            output.innerHTML = "";
            lastClicked = "";
        }
        clicked = !clicked;


/*         tog[1] == !tog[1];
        if (tog[1] == false){
            output.innerHTML = someString;
            lastClicked = someString;
        } else {
            output.innerHTML = "";
            lastClicked = "";
        } */
    })
})

/* let test = document.getElementById("test");
  
// This handler will be executed only once when the cursor
// moves over the unordered list
test.addEventListener("mouseenter", function( event ) {  */