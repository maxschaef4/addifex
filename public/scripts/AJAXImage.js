var container;

window.onload = function(){
    var id = document.getElementById('productId').value;
    container = document.getElementById('testContainer');
    var btn = document.getElementById('testButton');
    
    var req = new XMLHttpRequest();
    let url = '/test/imageTest/' + id;
    
    btn.addEventListener('click', function(){    
        //req.onreadystatechange = function() {
        //    if (this.readyState == 4 && this.status == 200) {
        //        test('data:image/png;base64,' + hexToBase64(this.responseText));
        //   }
        //}
        
        req.onload = function(){
            var imagesData = parseResponse(req.responseText);
            
            for(var i = 0; i < imagesData.length; i++)
                if (hexToBase64(imagesData[i]) != null) 
                    test('data:image/png;base64,' + hexToBase64(imagesData[i] + '0000000049454e44ae426082'));
        }
        
        req.open('GET', url);
        req.send();
    })
}

function test(data) {
    var img = document.createElement('img');
    img.src = data;
    img.setAttribute('class', 'col-2');
    container.appendChild(img);
}

function para(data) {
    var p = document.createElement('p');
    p.innerHTML = data;
    container.appendChild(p);
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