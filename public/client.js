var socket=io.connect('http://localhost:8000');
//khi có sư kiện connect
socket.on('connect', function(data){
    // xuất ra sự kiênj join dữ liệu hello 
    socket.emit('join','hello');
});
//lang nghe luong thread tra ve data
socket.on('thread', function(data){
    $('#thread').append('<li>' + data  + '</li>');
});
$(document).ready(function(){
    $("#loginform").show();
    $("#chatform").hide();
    $("#btnRegister").click(function(){
        socket.emit('client-send-username',$("#txtUsername").val())
    });
    $("#btnLogout").click(function(){
        socket.emit('logout');
        $("#chatform").hide(200);
        $("#loginform").show(100);

    });
    $("#btnSendMessage").click(function(){
        socket.emit('user-send-message',$('#txtMessage').val());

    })
}) 
socket.on("Server-send-Data",function(data){
    $('#noidung').append(data + ", ")
});

socket.on("server-send-mesage",function(data){
    $('#listMessage').append("<div class='ms'>" + data.un + ":" + data.nd + "</div>")
});

socket.on("server-send-login-fail",function(){
    alert('username alealy exit');
});
socket.on("server-send-dki-thanhcong",function(data){
    $("#currentUser").html(data);
    $("#loginform").hide(2000);
    $("#chatform").show(1000);
});

socket.on("server-send-list-user",function(data){
    $("#boxContent").html("");
    data.forEach(function(i){
        $("#boxContent").append("<div class='user'> " + i + "</div>")

    })
});

//khi form có sự kiênj submit 
$('form').submit(function(){
    var message =$('#message').val();
    socket.emit('messages',message);
    this.reset();
    return false;

});