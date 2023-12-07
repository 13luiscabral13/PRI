const express = require('express');
const cors = require('cors');
const axios = require('axios')

const app = express();
const port = 3001;

app.use(cors());

app.get('/get_games', async (req, res) => {
  try {
    const url = req.query.url;
    console.log("URL: ", url);

    const response = await axios.get(url);
    const data = response.data;
    const reviews = data.response.docs;
    let gameids = [];
    let games = [];

    for (let index = 0; index < reviews.length; index++) {
      const doc = reviews[index];

      if (gameids.length === 20) break;

      const gameId = doc.id.split('/')[0];

      if (!gameids.includes(gameId)) {
        gameids.push(gameId);
        const queryUrl = `http://localhost:8983/solr/games/select?fl=*%2C%5Bchild%5D&indent=true&q.op=OR&q=id%3A(${gameId})&useParams=&wt=json`;

        const gameResponse = await axios.get(queryUrl);
        const gameData = gameResponse.data;
        const gameResult = gameData.response.docs[0];

        games.push(gameResult);
      }
      console.log("GameIds: ", gameids);
    }

    res.send(games);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});