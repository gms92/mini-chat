// Load the TCP Library
net = require('net');
const { exec } = require('child_process');


// Keep track of the chat clients
//var clients = [];
var rooms = ["Batata", "Cebola", "Banana", "Tangerina"];
var personInRoom = {}
// Start a TCP Server
net.createServer(function (socket) {

  // Identify this client
  socket.name = null
  socket.nameOfGroupOfPerson = null

  // Put this new client in the list
  //clients.push(socket);

  socket.write("BEM VINDO AO MEU SERVIDOR  \n");
  socket.write("Crie um novo nome toda vez que entrar em uma sala. \n");
  whatGroupNameToPerson(socket);
  // Handle incoming messages from clients.
  
  
  socket.on('data', function (buffer) {
      var data = buffer.toString()
      
      
    if(data.startsWith("sala.")){
        
        var nameOfGroupOfPerson = data.split('.')[1].replace('\\r\\n','')
        console.log("Nome do grupo que o cliente escreveu: " + nameOfGroupOfPerson);
        console.log("Lista de salas: " + rooms);
        console.log("Existe na lista: " + rooms.includes(nameOfGroupOfPerson.trim()));


        if(rooms.includes(nameOfGroupOfPerson.trim())){
          socket.nameOfGroupOfPerson = data.split('.')[1].replace('\\r\\n','');
          socket.write("Bem vindo a sala: "+socket.nameOfGroupOfPerson+ " Agora me diga seu nome. Digite 'name.SEUNOME.'\n");    
        }else{
          socket.write("Não encontramos a sala escolhida\n");
          whatGroupNameToPerson(socket);
        }      
  
    }else if(data.startsWith("name.")){
          
          socket.name = data.split('.')[1].replace('\\r\\n','')
          socket.write("olá, pode chatear agora " + socket.name + "\n");
            // Send a nice welcome message and announce
          
          var listOfPersonInGroup = personInRoom[socket.nameOfGroupOfPerson]
          console.log("listOfPersonInGroup" + listOfPersonInGroup);
          console.log("listOfPersonInGroup" + (typeof listOfPersonInGroup == "undefined") );
          
          if(typeof listOfPersonInGroup == "undefined" || listOfPersonInGroup === null){
            listOfPersonInGroup = [];
          }
          if(data.startsWith("sala.")){
            listOfPersonInGroup = [];
          }
          console.log("listOfPersonInGroup" + listOfPersonInGroup);

          listOfPersonInGroup.push(socket);
          console.log("listOfPersonInGroup" + listOfPersonInGroup);
          personInRoom[socket.nameOfGroupOfPerson] = listOfPersonInGroup;

          broadcast(socket.name + " começou a chatear\n", socket);
      
    }else if(socket.nameOfGroupOfPerson === null ){
      whatGroupNameToPerson(socket);
    }else if(socket.name === null ){
        socket.write("Me diga seu nome. Digite 'name.SEUNOME.'\n")
    }else{
      broadcast(socket.name +" diz" + " >>>> " + data, socket);
    }
      
  });
  
  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(socket.name + " parou de chatear.\n");
  });
  
  // Send a message to all clients
  function broadcast(message, socket) {
    
    var listOfPersonInGroup = personInRoom[socket.nameOfGroupOfPerson]

    listOfPersonInGroup.forEach(function (socketPerson) {
      // Don't want to send it to sender
      if (socketPerson === socket) return;
      socketPerson.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
  }
  
  function whatGroupNameToPerson(socket){
    socket.write("ESCOLHA UMA SALA:'sala.NOMESALA' \n")
    rooms.forEach(function (room) {
    socket.write(room+", \n"); 
    });
  }


}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log("Chat server na porta 5000\n");