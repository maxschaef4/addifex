var container;

window.onload = function(){
    container = document.getElementById('imagesContainer');
    
    var req = new XMLHttpRequest();
    
    let reqUrl = '/images/productImages/' + getId(window.location.href);
    
    req.onload = function(){
        var imagesData = parseResponse(req.responseText);
        
        for(var i = 0; i < imagesData.length; i++)
            if (hexToBase64(imagesData[i]) != null) 
                addImage('data:image/png;base64,' + hexToBase64(imagesData[i] + '0000000049454e44ae426082'));
    }
    
    req.open('GET', reqUrl);
    
    req.send();
}

//function getImages() {
//    var req = new XMLHttpRequest();
//    
//    let reqUrl = '/images/productImages/' + getId(window.location.href);
//    
//    req.onload = function(){
//            var imagesData = parseResponse(req.responseText);
//            
//            for(var i = 0; i < imagesData.length; i++)
//                if (hexToBase64(imagesData[i]) != null) 
//                    addImage('data:image/png;base64,' + hexToBase64(imagesData[i] + '0000000049454e44ae426082'));
//        }
//        
//        req.open('GET', reqUrl);
//        req.send();
//}

function addImage(data) {
    var img = document.createElement('img');
    img.src = data;
    img.setAttribute('class', 'col-2');
    container.appendChild(img);
}

function parseResponse(hexstring) {
    var array = hexstring.split('0000000049454e44ae426082');
    
    return array;
}

function hexToBase64(hexstring) {
    if (hexstring.match(/\w{2}/g) == null) return null;
    
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

function getId(url) {
    var arrUrl = url.split('/');
    
    return arrUrl[4];
}