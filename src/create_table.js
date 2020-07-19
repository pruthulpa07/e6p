$('#rentDiv').hide();
$('#repairDiv').hide();
$('#inventoryDiv').hide();
$('#masterSelect').on('change',function(){
    // alert('value changed');
    if($('#masterSelect').val() == 'rent'){
        $('#rentDiv').show("slow");
        $('#inventoryDiv').hide();
    }else if($('#masterSelect').val() == 'inventory'){
        $('#rentDiv').hide();
        $('#inventoryDiv').show("slow");
    }
    
});
$('#status').on('change',function(){
    if($('#status').val() == 'under repair'){
        $('#repairDiv').show("slow",function(){
            // alert('test');
            $('.dates #dateReturn').datepicker({
                'format':'dd-mm-yyyy',
                'autoclose':true
            });
        });
        $('#placeofrepair').focus();
    }else $('#repairDiv').hide();
});

$('.input1:text:first').focus();

$('.input1').bind("keydown", function(e) {

    var n = $(".input1").length;

    if (e.which == 13)

    { //Enter key

      e.preventDefault(); //Skip default behavior of the enter key

      var nextIndex = $('.input1').index(this) + 1;

      if(nextIndex < n)

        $('.input1')[nextIndex].focus();

      else

      {

        $('.input1')[nextIndex-1].blur();

        $('#btnSubmit').click();

      }

    }

  });

$('#invBtn').click(function(){
        // // alert('test');
        // var machinery = $("#inventoryDiv #machinery").val();
        // var datePick = $("#inventoryDiv #datePick").val();
        // var cost = $("#inventoryDiv #cost").val();
        // var place = $("#inventoryDiv #place").val();
        // var billnumber = $("#inventoryDiv #billnumber").val();
        // var rent = $("#inventoryDiv #rent").val();
        // var status = $("#inventoryDiv #status").val();
        // var placeofrepair,repaircost,dateReturn;
        // if(status == 'under repair'){
        //     placeofrepair = $("#inventoryDiv #placeofrepair").val();
        //     repaircost = $("#inventoryDiv #repaircost").val();
        //     dateReturn = $("#inventoryDiv #dateReturn").val();
        // }else{
        //     placeofrepair = 'none';
        //     repaircost = 0;
        //     dateReturn = 'none';
        // };
        // var data = {
        //     machinery:machinery,
        //     datePick:datePick,
        //     cost:cost,
        //     place:place,
        //     billnumber:billnumber,
        //     rent:rent,
        //     status:status,
        //     placeofrepair:placeofrepair,
        //     repaircost:repaircost,
        //     dateReturn:dateReturn
        // };
        // var arr = [machinery,datePick,cost,place,billnumber,rent,status,placeofrepair,repaircost,dateReturn];
        // console.log(data);
    var dataArr = [];
    var data = 0;
    var arrIndex = 0;
    $('#inventoryDiv .input1').each(function(){
        // console.log($(this).val());
        dataArr[arrIndex] = $(this).val();
        arrIndex = arrIndex + 1;
    });
    console.log(dataArr);
    ipc.send("datasent",data,dataArr);
    $(".input1").val("");
})

$('#rentBtn').click(function(){
    var dataArr = [];
    var arrIndex = 0;
    $('#rentDiv .input1').each(function(){
        // console.log($(this).val());
        dataArr[arrIndex] = $(this).val();
        arrIndex = arrIndex + 1;
    });
    console.log(dataArr);
    ipc.send("datasent2",dataArr);
    $("#rentDiv .input1").val("");
})
