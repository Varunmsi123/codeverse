const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');

const setupYjsServer = (server) => {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', (ws, req) => {
    setupWSConnection(ws, req);
  });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  console.log('Yjs WebSocket server running');
};

module.exports = setupYjsServer;