$("#loginBtn").click(() => {
    var username = $("#username").val();
    var password = $("#password").val();
    ipc.send("loginRequest",username,password);
});

ipc.on("passMatch",(event)=>{
    $('#functionSelectorDiv').show();
    $('#container').html(" ");
    $.getScript("notification.js");
})

ipc.on("passWrong",(event)=>{
    alert("Wrong Password");
})