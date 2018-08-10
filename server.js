  // server.js print

const express = require('express');
const WebSocket = require('ws');

// Set the port to 3001
const PORT = 3001;


// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new WebSocket.Server({ server });

//adding random number
const uuidv4 = require('uuid/v4');


function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  const colors= ["#D46A6A", "#D49A6A", "#407F7F", "#55AA55"];
  let random = Math.floor(Math.random() * Math.floor(4));

  const wssCount = {
    count: wss.clients.size,
    type: "count"
  };

  const wssColor = {
    color: colors[random],
    type: "color"
  };

  let returnCount = (JSON.stringify(wssCount));

  broadcast(returnCount);
  // client.send(returnCount);
  // console.log(returnCount);

  let returnColor = (JSON.stringify(wssColor));

  ws.send(returnColor)




  ws.on('message', function incoming(data) {




    let objData = (JSON.parse(data));

    switch(objData.type) {
      case "postMessage":
        console.log("objData", objData);
        objData.type= "incomingMessage";
        let newData = Object.assign({id: uuidv4()}, objData);
        console.log("newData", newData);
        let returnData = (JSON.stringify(newData));
        console.log(returnData);
        broadcast(returnData);
        break;
      case "postNotification":
        objData.type= "incomingNotification";
        let returnName = (JSON.stringify(objData));
        console.log(returnName);
        broadcast(returnName);
        break;
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + objData.type);
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    const wssCount = {count: wss.clients.size,
      type: "count"
    };
    let wssCountName = (JSON.stringify(wssCount));
    broadcast(wssCountName);
    console.log(wssCountName);
  });
});





