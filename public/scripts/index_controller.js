//This file is for the JavaScript functioning on the index page.
//Some functions include: feed_container tab and border changing

window.onload = function () {
    var featuredButton = document.getElementById("featuredButton");
    var popularButton = document.getElementById("popularButton");
    var newestButton = document.getElementById("newestButton");
    var moreButton = document.getElementById("moreButton");
    
    if (featuredButton.attachEvent) {
        featuredButton.attachEvent("onclick", featuredSelect);
        popularButton.attachEvent("onclick", popularSelect);
        newestButton.attachEvent("onclick", newestSelect);
    }else{
        featuredButton.addEventListener("click", featuredSelect);
        popularButton.addEventListener("click", popularSelect);
        newestButton.addEventListener("click", newestSelect);
    }
    
    function featuredSelect() {
        featuredButton.disabled = true;
        popularButton.disabled = false;
        newestButton.disabled = false;
        //Changes the class of more button to red
        //col-12 is needed to keep the width and layout of the button
        moreButton.className = "red col-12";
    }
    
    function popularSelect() {
        featuredButton.disabled = false;
        popularButton.disabled = true;
        newestButton.disabled = false;
        //Changes the class of more button to green
        //col-12 is needed to keep the width and layout of the button
        moreButton.className = "green col-12";
    }
    
    function newestSelect() {
        featuredButton.disabled = false;
        popularButton.disabled = false;
        newestButton.disabled = true;
        //Changes the class of more button to blue
        //col-12 is needed to keep the width and layout of the button
        moreButton.className = "blue col-12";
    }
}