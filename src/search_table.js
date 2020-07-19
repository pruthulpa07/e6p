$('#searchBtn').click(function(){
    var tableSelect = $('#tableSelect').val();
    var keyword = $('#searchword').val();
    ipc.send("searchRequest",tableSelect,keyword);
});
var rowCount;
var searchResult;
ipc.on("searchResult",(event,result)=>{
    searchResult = result;
    console.log(result);
    rowCount = result.columns.length;
    // $("#searchResult").html('<h5>Search Results</h5>');
    $("#searchResult").html('<table id="searchResultTable">');
        $("#searchResult").append('<thead><tr>');
            result.columns.forEach(element => {
                $("#searchResult").append('<th>'+ element +'</th>');
            });
            $("#searchResult").append('<th>Actions</th>');
        $("#searchResult").append('</tr></thead>');
        $("#searchResult").append('<tbody>');
            result.values.forEach((element,index)=>{
                $("#searchResult").append('<tr>');
                    element.forEach(val=>{
                        $("#searchResult").append('<td>'+ val +'</td');
                    });
                    $("#searchResult").append(`<td>
                    <div class="btn-group">
                    <button value="${index}" class="btn btn-primary btn-sm mailBtn" type="button">Mail Token</button>
                    <button value="${index}" class="btn btn-danger btn-sm delColBtn" type="button">Delete</button>
                    </div></td`);
                $("#searchResult").append('</tr>');
            })
        $("#searchResult").append('</tbody>');
    $("#searchResult").append('</table>');
    $("#searchResult").addClass('table table-striped');
    // ipc.send("searchShown");
});
ipc.on("noResult",(event)=>{
    $("#searchResult").html("<h6>No Result</h6>");
})
$(document).on("click",".mailBtn",function(e){
    var indx = $(this).val();
    clickedRow = searchResult.values[indx];
    console.log(clickedRow);
    $("#bodyDiv").hide();
    $("#holder").load("token.html",()=>{
        $.getScript("token.js",()=>{
            $("#holder").append(`<div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">Sending...</div>
          </div>`);
            ipc.send("searchShown",clickedRow[10]);
        })
        
    })
});

ipc.on("mailSent",(event)=>{
    $("#bodyDiv").show();
    $("#holder").html(" ");
})
$(document).on("click",".delColBtn",function(e){
    var indx = $(this).val();
    clickedRow = searchResult.values[indx];
    // alert(clickedRow[0]);
    ipc.send("delRequest",clickedRow);
    console.log("delrequest sent");
});