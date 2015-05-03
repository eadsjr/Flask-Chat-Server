var y = null;
var x = function(e){y=e;console.log("changed")};
$("#start-conversation-select").on("change",x)

$("#start-conversation-select")

$("#name-select-text-input").on("keydown",function(e){y=e;console.log("text changed")})



$("#name-select-text-input").on("change",function(e){y=e;console.log("text changed")})

