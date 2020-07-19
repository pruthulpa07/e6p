var today = new Date(); 
var dd = today.getDate(); 
var mm = today.getMonth()+1; 
if(mm<10){
    mm = '0'+mm;
}
var yyyy = today.getFullYear();
var date = dd+'-'+mm+'-'+yyyy;
console.log(date);
ipc.send("dueSearch",date);
ipc.on("dueResult",(event,val)=>{
    $("#container").html("<h6>Notifications:</h6>");
    $("#container").append("Due Today<br>");
    val.forEach(element => {
        element.forEach(elem=>{
            $("#container").append(elem+" | ");
         });
        $("#container").append("<br>");
    });
})