var scooby = [
    "Ruh-Roh!",
    "Zoinks!",
    "Like...no way man!",
    "Jinkies!",
    "Scooby Doo - where are you!"
];

exports.getScooby = function() {
    var idx = Math.floor(Math.random() * scooby.length);
    
    return scooby[idx];
}