window.onload = function () {
    //Used for submitting forms based on the corresponding submit button *******Back-end purposes*******
    //Used for submitting a number
    var addNumButton = document.getElementById('addNumSubmit');
    var addNumForm = document.getElementById('addNumForm');
    //Used for adding a new creator to the testCreator collection
    var signupForm = document.getElementById('signupForm');
    var signupButton = document.getElementById('signupSubmit');
    
    //Used for testing
    addNumButton.addEventListener('click', addNumber);
    signupButton.addEventListener('click', signup);
    
    function addNumber() {
        addNumForm.submit();
    }
    
    function signup() {
        signupForm.submit();
    }
}