const express = require('express');
const {Server} = require("socket.io")
const http = require('http');
const socketIo = require('socket.io');
const FileManager = require("./fileManager")
const path = require("path")
const handlebars = require("express-handlebars")
const fileManager = new FileManager("products.json")
const app = express();
const server = http.createServer(app);



const io = new Server(server)

app.engine("handlebars", handlebars.engine())

app.set("views", __dirname + "/views")

app.set("view engine", "handlebars")

app.use(express.static(__dirname + "/views"))

app.get('/', (req, res) => {
  
  const products = fileManager.getData()
  res.render('home.hbs', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts.hbs');
});


io.on('connection', (socket) => {
  console.log('Usuario conectado');

  
  socket.on('updateProducts', () => {
    const products = fileManager.getData(); 
    socket.emit('productsUpdated', products);
  });
});


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
