// server.js
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3001;

app.use(cors());

app.get('/get_games', (req, res) => {
  const url = req.query.url;
  //console.log("URL: ", url);

  const pythonScript = 'getGames.py';
  const command = `python ${pythonScript} "${url}"`;
  console.log("Command = ", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      res.status(500).send('Internal Server Error');
      return;
    }

    const result = stdout.trim();
    res.send(`Result: ${result}`);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
