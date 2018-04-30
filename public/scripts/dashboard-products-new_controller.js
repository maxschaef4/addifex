window.onload = function () {
    
    //Variables for creating the shipping time value
    var shipNum = document.getElementById('shipNum');
    var shipSelect = document.getElementById('shipUnit');
    var shipTime = document.getElementById('shipTime');
    //Variables for creating the build time value
    var buildNum = document.getElementById('buildNum');
    var buildSelect = document.getElementById('buildUnit')
    var buildTime = document.getElementById('buildTime');
    //Variables for the "File Select" input
    var productImage = document.getElementById('productImage');
    var label = document.getElementById('imageLabel');
    var productsContainer = document.getElementById('imageContainer');
    var deleteImage = document.getElementById('deleteImage');
    //Variables for the color options functionality
    var newColor = document.getElementById('newColor');
    var addColorButton = document.getElementById('addColor');
    var colors = document.getElementById('colors');
    var colorsAdded = document.getElementById('colorsAdded');
    var colorList = [];
    var deleteColorButton = document.getElementById('deleteLastColor');
    //Variables for size option functionality
    var newSize = document.getElementById('newSize');
    var addSizeButton = document.getElementById('addSize');
    var sizes = document.getElementById('sizes');
    var sizesAdded = document.getElementById('sizesAdded');
    var sizeList = [];
    var deleteSizeButton = document.getElementById('deleteLastSize');
    //Variables for other option functionality
    var newOther = document.getElementById('newOther');
    var addOtherButton = document.getElementById('addOther');
    var other = document.getElementById('other');
    var otherAdded = document.getElementById('otherAdded');
    var otherList = [];
    var deleteOtherButton = document.getElementById('deleteLastOther');
    //Variables for adding Keywords
    var newKeyword = document.getElementById('newKeyword');
    var addKeywordButton = document.getElementById('addKeyword');
    var keywords = document.getElementById('keywords');
    var keywordsAdded = document.getElementById('keywordsAdded');
    var keywordList = [];
    var deleteLastKeyword = document.getElementById('deleteLastKeyword');
    
    if (productImage.attachEvent) {
        shipSelect.attachEvent('onchange', addShipTime);
        buildSelect.attachEvent('onchange', addBuildTime);
        productImage.attachEvent('onchange', imageSelect);
        deleteImage.attachEvent('onclick', deleteLastImage);
        addColorButton.attachEvent('onclick', addColor);
        deleteColorButton.attachEvent('onclick', deleteColor);
        addSizeButton.attachEvent('onclick', addSize);
        deleteSizeButton.attachEvent('onclick', deleteSize);
        addOtherButton.attachEvent('onclick', addOther);
        deleteOtherButton.attachEvent('onclick', deleteOther);
        addKeywordButton.attachevent('onclick', addKeyword);
        deleteLastKeyword.attachEvent('onclick', deleteKeyword);
    }else{
        shipSelect.addEventListener('change', addShipTime);
        buildSelect.addEventListener('change', addBuildTime);
        productImage.addEventListener('change', imageSelect);
        deleteImage.addEventListener('click', deleteLastImage);
        addColorButton.addEventListener('click', addColor);
        deleteColorButton.addEventListener('click', deleteColor);
        addSizeButton.addEventListener('click', addSize);
        deleteSizeButton.addEventListener('click', deleteSize);
        addOtherButton.addEventListener('click', addOther);
        deleteOtherButton.addEventListener('click', deleteOther);
        addKeywordButton.addEventListener('click', addKeyword);
        deleteLastKeyword.addEventListener('click', deleteKeyword);
    }
    
    function addShipTime() {
        shipTime.value = shipNum.value + " " + shipSelect.value;
    }
    
    function addBuildTime() {
        buildTime.value = buildNum.value + " " + buildSelect.value;
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
        
        
        readFile(e.srcElement.files);
    }
    
    function readFile(files) {
        for(var i = 0; i < files.length; i++){
            (function(file){
                var fileReader = new FileReader();
                
                fileReader.onload = function(event){
                    var dataUri = event.target.result;
                    
                    img = document.createElement('img');
                        
                    img.src = dataUri;
                    img.setAttribute('class', 'productImage col-1');
                    
                    productsContainer.appendChild(img);
                }
                fileReader.readAsDataURL(file);
            })(files[i]);
        }
    }
    
    function deleteLastImage() {
        if (!(productsContainer.childNodes.length == 0)) {
            productsContainer.removeChild(productsContainer.lastChild);
        }else{
            return;
        }
    }
    
    function addColor() {
        colorList.push(newColor.value);
        
        colors.value = colorList;
        
        var listItem = document.createElement('li');
        var listItemText = document.createTextNode(newColor.value);
        
        listItem.appendChild(listItemText);
        
        colorsAdded.appendChild(listItem);
        
        newColor.value = '';
    }
    
    function deleteColor() {
        if (!(colorsAdded.childNodes.length == 0)) {
            colorList.pop();
            
            colors.value = colorList;
            
            colorsAdded.removeChild(colorsAdded.lastChild);
        }else{
            return;
        }
        
    }
    
    function addSize() {
        sizeList.push(newSize.value);
        
        sizes.value = sizeList;
        
        var listItem = document.createElement('li');
        var listItemText = document.createTextNode(newSize.value);
        
        listItem.appendChild(listItemText);
        
        sizesAdded.appendChild(listItem);
        
        newSize.value = '';
    }
    
    function deleteSize() {
        if (!(sizesAdded.childNodes.length == 0)) {
            sizeList.pop();
            
            sizes.value = sizeList;
            
            sizesAdded.removeChild(sizesAdded.lastChild);
        }else{
            return;
        }
    }
    
    function addOther() {
        otherList.push(newOther.value);
        
        other.value = otherList;
        
        var listItem = document.createElement('li');
        var listItemText = document.createTextNode(newOther.value);
        
        listItem.appendChild(listItemText);
        
        otherAdded.appendChild(listItem);
        
        newOther.value = '';
    }
    
    function deleteOther() {
        if (!(otherAdded.childNodes.length == 0)) {
            otherList.pop();
        
            other.value = otherList;
            
            otherAdded.removeChild(otherAdded.lastChild);
        }else{
            return;
        }
    }
    
    function addKeyword() {
        keywordList.push(newKeyword.value);
        
        keywords.value = keywordList;
        
        var listItem = document.createElement('li');
        var listItemText = document.createTextNode(newKeyword.value);
        
        listItem.appendChild(listItemText);
        
        keywordsAdded.appendChild(listItem);
        
        newKeyword.value = '';
    }
    
    function deleteKeyword() {
        if (!(keywordsAdded.childNodes.length == 0)) {
            keywordList.pop();
        
            keywords.value = keywordList;
        
            keywordsAdded.removeChild(keywordsAdded.lastChild);
        }else{
            return;
        }
    }
}