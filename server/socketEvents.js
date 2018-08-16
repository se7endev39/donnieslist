var line_history = [];
exports = module.exports = function (io) {
  // Set socket.io listeners.
  io.on('connection', (socket) => {
     console.log('_________________a user connected_________________');

    // first send the history to the new client
    for (var i in line_history) {
      console.log('_____________ draw_line _____________ ');
      socket.emit('draw_line', { line: line_history[i] } );
    }
    // add handler for message type "draw_line".
    socket.on('draw_line', function (data) {
      console.log('** ** ** ** server : draw_line ** ** ** **');
      // add received line to history
      line_history.push(data.line);
      // send line to all clients
      io.emit('draw_line', { line: data.line });
    });

    // On conversation entry, join broadcast channel
    socket.on('enter conversation', (conversation) => {
      socket.join(conversation);
       console.log('joined ' + conversation);
     });

    socket.on('leave conversation', (conversation) => {
      socket.leave(conversation);
       console.log('left ' + conversation);
    });

    socket.on('new message', (conversation) => {
      console.log('new message: '+ JSON.stringify(conversation));
      io.sockets.in(conversation).emit('refresh messages', conversation);
    });

    socket.on('disconnect', () => {
       console.log('_________________user disconnected_________________');
    });

    /* expert session socket functions */

    // On conversation entry, join broadcast channel
    socket.on('expert enter session', (sessionOwnerUsername) => {
      socket.join(sessionOwnerUsername);
       console.log('server side : joined ' + sessionOwnerUsername);
    });

    socket.on('expert leave session', (sessionOwnerUsername) => {
      socket.leave(sessionOwnerUsername);
       console.log('server side : left ' + sessionOwnerUsername);
    });

    socket.on('expert new message', (sessionOwnerUsername) => {
      console.log('server side : ***** ***** ***** expert new message: '+ JSON.stringify(sessionOwnerUsername));
      io.sockets.in(sessionOwnerUsername).emit('refresh expert session messages', sessionOwnerUsername);
    });

    /*event fires when any user leave the session page*/
    socket.on('expert user disconnected', (sessionOwnerUsername) => {
      line_history = [];
      console.log('server side : ***** ***** *****  expert user disconnected '+sessionOwnerUsername);
      io.sockets.in(sessionOwnerUsername).emit('expert user disconnected', sessionOwnerUsername);
    });

    /*event fires when any user leave the session page*/
    socket.on('audio call to expert', (data) => {
      console.log('server side : ***** ***** *****  audio call to expert '+data.userAudioCallSokcetname);
      io.sockets.to(data.expertAudioCallSokcetname).emit('audio call to expert', data);
    });
    
    socket.on('disconnect incoming audio call to user', function(data){
        console.log('*** disconnect incoming audio call to user ***'+ data.userAudioCallSokcetname);
        io.sockets.to(data.userAudioCallSokcetname).emit('disconnect incoming audio call to user', data);
    });

    // create expert audio call session
    socket.on('expert audio call session', (username) => {
      socket.join(username);
       console.log('expert audio call session : joined ' + username);
    });

    //will be fired when some expert starts a session
    socket.on('admin new expert session starting', function(){
      socket.emit("Update Expert Session List")
    });
    socket.on('TESTing', (data) => {
        console.log("&&###&&&")
    })

  });
};
