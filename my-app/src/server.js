const express = require('express');
const cors = require('cors');
const axios = require('axios')

const app = express();
const port = 3001;

app.use(cors());

app.get('/get_games', async (req, res) => {
  try {
    const endpoint = 'http://localhost:8983/solr';
    const collection = 'games';
    const url = `${endpoint}/${collection}/select`;

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const search_text = req.query.query;

    const hardSearchData = {
      bq: `{!child of=\"*:* -_nest_path_:*\"}name:(${search_text})^2 OR summary:(${search_text}) OR wikipedia:(${search_text})^2 OR genre:(${search_text})^3`,
      defType: "edismax",
      fl: "*,[child]",
      fq: "{!child of=\"*:* -_nest_path_:*\"}name:*",
      indent: "true",
      'q.op': "OR",
      q: `(${search_text})`,
      qf: "platform^8 review^2",
      rows: 1000,   //TODO: confirm
      useParams: "",
      wt: "json"
    }

    const hardSearchParams = new URLSearchParams(hardSearchData);

    console.log("Before Axios request");
    const response = await axios.post(url, hardSearchParams.toString(), {
      headers: headers
    });
    console.log("After Axios request\n");


    const data = response.data;
    const reviews = data.response.docs;

    let gameids = [];
    let games = [];
    let query = "";

    for (let index = 0; index < reviews.length; index++) {
      const doc = reviews[index];

      if (gameids.length === 20) break;

      const gameId = doc.id.split('/')[0];

      if (!gameids.includes(gameId)) {
        gameids.push(gameId);


        //const queryUrl = `http://localhost:8983/solr/games/select?fl=*%2C%5Bchild%5D&indent=true&q.op=OR&q=id%3A(${gameId})&useParams=&wt=json`;

        query += gameId + " ";

        //const gameResponse = await axios.get(queryUrl);
        //const gameData = gameResponse.data;
        //const gameResult = gameData.response.docs[0];

        //games.push(gameResult);
      }
    }

    const searchData = {
      q: `id:(${query})`,
      fl: "*,[child]",
      indent: "true",
      'q.op': "OR",
      rows: 30,
      useParams: "",
      wt: "json"
    }

    const searchParams = new URLSearchParams(searchData);

    console.log("Before games request");
    const responseGames = await axios.post(url, searchParams.toString(), {
      headers: headers
    });
    console.log("After games request\n");

    res.send(responseGames.data.response.docs);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});