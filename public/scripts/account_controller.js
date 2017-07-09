window.onload = function () {
    var likesButton = document.getElementById("likesButton");
    var ordersButton = document.getElementById("ordersButton");
    var infoButton = document.getElementById("infoButton");
    var likesSection = document.getElementById("likesSection");
    var ordersSection = document.getElementById("ordersSection");
    var infoSection = document.getElementById("infoSection");
    
    if (likesButton.attachEvent) {
        likesButton.attachEvent("onclick", likesSelect);
        ordersButton.attachEvent("onclick", ordersSelect);
        infoButton.attachEvent("onclick", infoSelect);
    }else{
        likesButton.addEventListener("click", likesSelect);
        ordersButton.addEventListener("click", ordersSelect);
        infoButton.addEventListener("click", infoSelect);
    }
    
    function likesSelect() {
        likesButton.disabled = true;
        ordersButton.disabled = false;
        infoButton.disabled = false;
        
        likesSection.style.display = "block";
        ordersSection.style.display = "none";
        infoSection.style.display = "none";
    }
    
    function ordersSelect() {
        likesButton.disabled = false;
        ordersButton.disabled = true;
        infoButton.disabled = false;
        
        likesSection.style.display = "none";
        ordersSection.style.display = "block";
        infoSection.style.display = "none";
    }
    
    function infoSelect() {
        likesButton.disabled = false;
        ordersButton.disabled = false;
        infoButton.disabled = true;
        
        likesSection.style.display = "none";
        ordersSection.style.display = "none";
        infoSection.style.display = "block";
    }
}