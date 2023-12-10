const express = require('express');
const cors = require('cors');
const axios = require('axios')

const app = express();
const port = 3001;

const stopWords = [
  '', 'a','an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'can\'t', 'could', 'couldn\'t', 'did', 'do', 'does', 'down', 'for', 'from', 'has', 
  'have', 'he', 'her', 'him', 'i', 'in', 'is', 'it', 'its', 'mine', 'my', 'not', 'of', 'on', 'our', 'ours', 'she', 'should', 'shouldn\'t', 'so',
  'that', 'the', 'theirs', 'them', 'they', 'this', 'these', 'those', 'to', 'too', 'up', 'us', 'was', 'we', 'were', 'will', 'with', 'what', 'where',
  'who', 'you', 'your', 'yours'
];

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
      rows: 1000,
      useParams: "",
      wt: "json"
    }

    const hardSearchParams = new URLSearchParams(hardSearchData);

    const response = await axios.post(url, hardSearchParams.toString(), {
      headers: headers
    });

    const data = response.data;
    const reviews = data.response.docs;

    let gameids = [];
    let query = "";

    for (let index = 0; index < reviews.length; index++) {
      const doc = reviews[index];

      if (gameids.length === 30) break;

      const gameId = doc.id.split('/')[0];

      if (!gameids.includes(gameId)) {
        gameids.push(gameId);
        query += gameId + " ";
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

    const responseGames = await axios.post(url, searchParams.toString(), {
      headers: headers
    });

    res.send(responseGames.data.response.docs);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/get_more_games', async (req, res) => {

});

function getQueryVector(query) {
  const queryTerms = query.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').split(" ");
  const queryTF = new Map();

  for (const term of queryTerms) {
    if (stopWords.includes(term))
      continue;

    if (!queryTF.has(term)) {
      queryTF.set(term, 1);
    } else {
      queryTF.set(term, queryTF.get(term) + 1);
    }
  }

  return queryTF;
}

function getDocumentVector(document) {
  const summaryTerms = document.summary.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').split(" ");
  const wikipediaTerms = document.summary.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').split(" ");
  const documentTF = new Map();

  for (const term of summaryTerms) {
    if (stopWords.includes(term))
      continue;

    if (!documentTF.has(term)) {
      documentTF.set(term, 1);
    } else {
      documentTF.set(term, documentTF.get(term) + 1);
    }
  }

  for (const term of wikipediaTerms) {
    if (stopWords.includes(term))
      continue;

    if (!documentTF.has(term)) {
      documentTF.set(term, 1);
    } else {
      documentTF.set(term, documentTF.get(term) + 1);
    }
  }

  for (const review of document.reviews) {
    const reviewTerms = review.review.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').split(" ");
    for (const term of reviewTerms) {
      if (stopWords.includes(term))
        continue;

      if (!documentTF.has(term)) {
        documentTF.set(term, 1);
      } else {
        documentTF.set(term, documentTF.get(term) + 1);
      }
    }
  }

  return documentTF;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});