document.addEventListener("DOMContentLoaded", function(event) {

    strings = [
        `Color Picker: I made this because I was really fed up with opening photoshop everytime I had to choose a new hexkey color for a website. <a href = https://elijer.github.io/>Here's the link </a>`,
        `Stripe: I had an idea for a online market where you could buy things directly from a location on a map. However, I've never done any payment processing online before so, so I had to learn how! I learned how to use the super-secure Stripe API, which allows for sophisticated card-payment processing to a business's profile. <a href = "https://firestripe-boilerplate.web.app/" > You can check that out here. </a> `,
        `Unity: Unity is so cool! When I was evacuated from Uganda, I had a lot of time on my hands while I was going through quarantine after passing through what felt like a millin airports. I thought, why not learn how to do somethng I've wanted to learn for years; make video games. So I got started! I've made three humble projects so far, but I made all of them in just three months, starting from no Unity experience. I really look forward to experimenting with AR/VR, with creating gamified experiences and creating an epic suvivalist game I've been thiking about for a while. You can play all three of the games I've made <a href = "https://simmer.io/@Kua"> here, on my Simmer.io page </a>`,
        `I studied Film & Photography for a year at Virginia Commonwealth University before switching my degree to animation because it was way more fun and there were fewer barriers to what is possibe (and I still graduated on time, with a billion extra credits!) As a result, I came out of my undergrad education with a video portfolio that boasted my editing and animation skills, as well as a job working with the universiy where I created more videos, mostly profiles of research projects. I then worked briefly for a startup called 'Culturescene', which employed me to do artist profiles. You can see all that and more <a href = "https://vimeo.com/squarrow"> here </a>`,
        "Amination",
        "oysters",
        "say hi",
        "mwesy",
        "rez"
    ];

    list = document.querySelectorAll("ul#the-list li");

    for (i = 0; i < list.length; i++){
        assignHoverEvent(list, i);
    }
})

var assignHoverEvent = function(list, i){
    output = document.getElementById("text-display");
    let current = list[i];
    let blurb = strings[i];

    current.addEventListener("click", function( event ) {

        list.forEach(function(el) {
            //element.classList.add("test");
            if (el.classList.contains("test")) {
                el.classList.remove("test");
            }
        });

        output.innerHTML = blurb;
        current.classList.add("test");
        lastClicked = current;
        
    })
}


/*

Okay. I want, when no option has been clicked, for highlighting another option
to show that option as long as it is highlighted. Conversely, if an option has been clicked,
I don't want other options to have any hover

*/