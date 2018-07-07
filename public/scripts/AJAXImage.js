var container;

window.onload = function(){
    var id = document.getElementById('productId').value;
    container = document.getElementById('testContainer');
    var btn = document.getElementById('testButton');
    
    var req = new XMLHttpRequest();
    let url = '/test/imageTest/' + id;
    
    btn.addEventListener('click', function(){    
        req.open('GET', url);
        
        req.onload = function(){
            test('data:image/png;base64,' + hexToBase64(req.responseText));
        }
        
        req.send();
    })
}

function test(data) {
    var img = document.createElement('img');
    img.src = data;
    container.appendChild(img);
}

function para(data) {
    var p = document.createElement('p');
    p.innerHTML = data;
    container.appendChild(p);
}

function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}