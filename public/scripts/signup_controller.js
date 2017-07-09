//Waits for window to load all the elements of the page
//This insures there are no elements that are 'undefined'
window.onload = function() {
    //Gets the elements needed from the page
    //Name validation variables
    var nameErr = document.getElementById("nameError");
    var name = document.getElementById("name");
    var nameOK = false;
    //Email validation variables
    var emailErr = document.getElementById("emailError");
    var email = document.getElementById("email");
    var emailOK = false
    //Password validation variables
    var rules = document.getElementById("requirments");
    var lengthText = document.getElementById("length");
    var upperText = document.getElementById("uppercase");
    var numText = document.getElementById("number");
    var passErr = document.getElementById("passwordError");
    var password = document.getElementById("password");
    var passwordOK = false;
    //Confirm password variables
    var confirmErr = document.getElementById("confirmError");
    var confirm = document.getElementById("confirm");
    var confirmOK = false;
    //Form validation variables
    var submit = document.getElementById("signup");
    //Default states is disabled
    submit.disabled = true;
    
    //Uses attachEvent() if the browser is IE 8 or earlier
    if (name.attachEvent) {
        name.attachEvent("onblur", nameCheck);
        email.attachEvent("onblur", emailCheck);
        password.attachEvent("onfocus", showRules);
        password.attachEvent("onkeyup", passwordCheck);
        confirm.attachEvent("onkeyup", confirmCheck);
        confirm.attachEvent("onkeyup", formCheck);
    }else if(name.addEventListener){
        //Adds event listeners to input fields
        name.addEventListener("blur", nameCheck);
        email.addEventListener("blur", emailCheck);
        password.addEventListener("focus", showRules);
        password.addEventListener("keyup", passwordCheck);
        confirm.addEventListener("keyup", confirmCheck);
        window.addEventListener("keyup", formCheck);
    }
    
    //--------------------------------------------------------
    //When a function returns true, the corresponding text field's border is set to green and 2px thick
    //This is so the user knows that the input is OK
    //--------------------------------------------------------
    
    //Checks to make sure that the user added their last name and there are no numbers
    function nameCheck(){
        if (!/\s(?=\D)/.test(name.value) || /\d/.test(name.value)) {
            if(!/\s(?=\D)/.test(name.value)){
                nameErr.innerHTML = "Please Enter Your Last Name";
            }else{
                nameErr.innerHTML = "No Numbers";
            }
            
            name.style.borderColor = "#313131";
            name.style.borderWidth = "1px";
        }else{
            nameErr.innerHTML = "";
            
            name.style.borderColor = "#5cb85c";
            name.style.borderWidth = "2px";
            
            nameOK = true;
        }
    }
    
    //Checks the email field to make sure the user entered a standard email form
    //Checks to see if it has a '@' and a '.' in it
    function emailCheck(){
        if (!/[@]/.test(email.value) || !/[.]/.test(email.value)) {
            emailErr.innerHTML = "Please Enter Valid Email";
            
            email.style.borderColor = "#313131";
            email.style.borderWidth = "1px";
        }else{
            emailErr.innerHTML = "";
            
            email.style.borderColor = "#5cb85c";
            email.style.borderWidth = "2px";
            
            emailOK = true;
        }
    }
    
    function showRules(){
        rules.style.display = "block";
    }
    
    function passwordCheck(){
        var lengthCheck, upperCheck, numCheck, spaceCheck;
        
        //Checks if the password is greater than 8 characters long
        if (password.value.length < 8) {
            lengthText.style.color = "#d9534f";
            lengthCheck = false;
        }else{
            lengthText.style.color = "#5cb85c";
            lengthCheck = true;
        }
        
        //Checks to see if the password has at least one capital letter
        if (/[A-Z]/.test(password.value)) {
            upperText.style.color = "#5cb85c";
            upperCheck = true;
        }else{
            upperText.style.color = "#d9534f";
            upperCheck = false;
        }
        
        //Checks to see if the password has at least 1 number
        if (/[0-9]/.test(password.value)) {
            numText.style.color = "#5cb85c";
            numCheck = true;
        }else{
            numText.style.color = "#d9534f";
            numCheck = false;
        }
        
        //Checks for any spaces in the password (a space means the function returns false)
        if (/\s/.test(password.value)) {
            passErr.innerHTML = "No Spaces";
            
            spaceCheck = false;
        }else{
            passErr.innerHTML = "";
            
            spaceCheck = true;
        }
        
        //checks all variables to see if they are true and if they are all true then the password is OK
        if (!lengthCheck || !upperCheck || !numCheck || !spaceCheck) {
            password.style.borderColor = "#313131";
            password.style.borderWidth = "1px";
        }else{
            password.style.borderColor = "#5cb85c";
            password.style.borderWidth = "2px";
            
            passwordOK = true;
        }
    }
    
    //Checks to see if the value in confirm is the exact same as the value in password
    function confirmCheck(){
        if(confirm.value != password.value){
            confirmErr.innerHTML = "Passwords Do Not Match";
            
            confirm.style.borderColor = "#313131";
            confirm.style.borderWidth = "1px";
        }else{
            confirmErr.innerHTML = "";
            
            confirm.style.borderColor = "#5cb85c";
            confirm.style.borderWidth = "2px";
            
            confirmOK = true;
        }
    }
    
    //Called when user is entering info in the confirm password field
    //Checks to make sure all functions return true and enables the submit button
    function formCheck(){
        if (!nameOK || !emailOK || !passwordOK || !confirmOK) {
            submit.disabled = true;
            return false;
        }else{
            submit.disabled = false;
            return true;
        }
    }
}