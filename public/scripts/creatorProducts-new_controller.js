window.onload = function () {
    //Variables for the "File Select" input
    var shopImage = document.getElementById("productImage");
    var label = document.getElementById("imageLabel");
    //Variables for the color select functionality
    var sizesCheck = document.getElementById("sizesCheck");
    var sizeInput = document.getElementById("sizeInput");
    
    if (shopImage.attachEvent) {
        shopImage.attachEvent("onchange", imageSelect);
        sizesCheck.attachEvent("onchange", displayInput(sizesCheck));
    }else{
        shopImage.addEventListener("change", imageSelect);
        sizesCheck.addEventListener("change", displayInput(sizesCheck));
    }
    
    //Used for the custom "File Select" input functionality
    //Gets the file path from the event and splits it after the two '/' to get the file name
    function imageSelect(e) {
        var fileName = "";
        
        fileName = e.target.value.split("\\").pop();
        
        if (fileName) {
            label.innerHTML = fileName;
        }else{
            label.innerHTML = "Choose a file...";
        }
    }
    
    function displayInput(target) {
        
        
        target.style.display = "block";
    }
}