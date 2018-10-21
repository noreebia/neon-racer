var express = require('express');
var app = express();
var path = require('path');
var userRouter = require('./routers/default-router');
var morgan = require('morgan');

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode < 400
    }, stream: process.stderr
}));

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode >= 400
    }, stream: process.stdout
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Define the port to run on
app.set('port', 3000);
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", userRouter);

// Listen for requests
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});

var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on('disconnect', function() {
        console.log('A user disconnected');
    });
});