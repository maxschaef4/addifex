//This file is for the JavaScript functioning on the index page.
//Some functions include: feed_container tab and border changing

window.onload = function () {
    var shopImage = document.getElementById("shopImage");
    var label = document.getElementById("imageLabel");
    
    if (shopImage.attachEvent) {
        shopImage.attachEvent("onchange", imageSelect);
    }else{
        shopImage.addEventListener("change", imageSelect);
    }
    
    function imageSelect(e) {
        var fileName = "";
        
        fileName = e.target.value.split("\\").pop();
        
        if (fileName) {
            label.innerHTML = fileName;
        }else{
            label.innerHTML = "Choose a file...";
        }
    }
}