window.onload = function () {
    //Variables for the "File Select" input
    var imageInput = document.getElementById('productImage');
    var label = document.getElementById('imageLabel');
    var productsContainer = document.getElementById('imageContainer');
    var deleteImage = document.getElementById('deleteImage');
    var dataCont = document.getElementById('dataContainer');
    var imagesCount = 0;
    
    productImage.addEventListener('change', imageSelect);
    deleteImage.addEventListener('click', deleteLastImage);
    
    //Used for the custom "File Select" input functionality
    //Gets the file path from the event and splits it after the two '/' to get the file name
    function imageSelect(e) {
        imagesCount += imageInput.files.length;
        
        if (imagesCount != 0) {
            label.innerHTML = imagesCount + " Images Selected";
        }else{
            label.innerHTML = "Choose a file...";
        }
        
        readFiles(imageInput.files);
    }
    
    function readFiles(files) {
        var dataUri;
        var dataInput;
        
        for(var i = 0; i < files.length; i++){
            (function(file, count){
                var fileReader = new FileReader();
                
                fileReader.onload = function(event){
                    dataUri = event.target.result;
                    
                    img = document.createElement('img');
                    img.src = dataUri;
                    img.setAttribute('class', 'productImage col-1');
                    
                    dataInput = document.createElement('input');
                    dataInput.setAttribute('name', 'image' + count);
                    //dataInput.setAttribute('value', dataUri);
                    dataInput.setAttribute('type', 'hidden');
                    
                    productsContainer.appendChild(img);
                    dataCont.appendChild(dataInput);
                }
                fileReader.readAsDataURL(file);
            })(files[i], i);
        }
    }
    
    function deleteLastImage() {
        if (productsContainer.childNodes.length != 0) {
            productsContainer.removeChild(productsContainer.lastChild);
            dataCont.removeChild(dataCont.lastChild);
            imagesCount--;
            label.innerHTML = imagesCount + " Images Selected";
        }else{
            return;
        }
    }
}