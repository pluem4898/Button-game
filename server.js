const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);


let scores = { red: 0, blue: 0 };


let readyPlayers = 0;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);


  socket.on('playerReady', () => {
    readyPlayers++;
    console.log(`Player ready count: ${readyPlayers}`);
    

    if (readyPlayers >= 2) {
      io.emit('gameStart');
      sendRandomPositions();
      readyPlayers = 0;
    }
  });

  // ส่งตำแหน่งปุ่มสุ่มไปยังผู้เล่นทุกคน
  function sendRandomPositions() {
    const positions = {
      red: { top: Math.random() * 80 + 10, left: Math.random() * 80 + 10 },
      blue: { top: Math.random() * 80 + 10, left: Math.random() * 80 + 10 }
    };
    io.emit('newPositions', positions);
  }

  // เมื่อมีการคลิกปุ่ม
  socket.on('buttonClicked', (color) => {
    if (color === 'red' || color === 'blue') {
      scores[color]++;
      io.emit('updateScores', scores);
      sendRandomPositions();
    }
  });


const resultOverlay = document.getElementById('resultOverlay');
resultOverlay.style.display = 'none';

socket.on('gameStart', () => {
  resultOverlay.style.display = 'none';
  timerDiv.style.display = 'block';
  startButton.style.display = 'none';
  startCountdown();
});



  socket.on('gameOver', () => {
    const winner = scores.red > scores.blue ? 'Red Player' : scores.red < scores.blue ? 'Blue Player' : "It's a tie!";
    io.emit('gameResult', winner);
    scores = { red: 0, blue: 0 };
  });
  



  socket.on('disconnect', () => {
    console.log('A player disconnected:', socket.id);
  });
});



server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
