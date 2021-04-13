var express= require('express');

var app=express();

var server=require('http').createServer(app);
//socket io noi vao server
var io=require('socket.io')(server);
//xu ly trang chu, khi truy cập vào trang chu se tra ve file index.html 
app.get('/', function(req,res,ext){
    //tra ve 1 file
    res.sendFile(__dirname + "/public/index.html");
});
//dùng chỉ định tất cả file public 
app.use(express.static('public'));
//khi 1 connector mới đc tạo ra sẽ 
var manageruser=[];
io.on('connection',function(client){
    console.log('client connected ' + client.id);
    client.on('client-send-username', function(data){
        console.log(data);
        if(manageruser.indexOf(data)>=0){
            //fail
            client.emit('server-send-login-fail');
        }
        else{
            manageruser.push(data);
            client.Username=data;
            client.emit('server-send-dki-thanhcong',data);
            io.sockets.emit("server-send-list-user",manageruser);

        }
    });
    client.on('logout',function(){
        const index=manageruser.indexOf(client.Username);
        console.log(index)
        manageruser.splice(index,1);
        client.broadcast.emit("server-send-list-user",manageruser);
    });
    client.on('user-send-message',function(data){
        console.log(data)
        io.sockets.emit("server-send-mesage", {
            un:client.Username,
            nd:data
        });

    });
});
server.listen('8000');