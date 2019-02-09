var express = require('express');
var router = express.Router();

var request = require('request');
var rp = require('request-promise');
var async = require('async');

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  const api_key = 'RGAPI-c902ab6d-32fb-42dd-af1a-2091afd52289';
  const summonerName = req.params.name;
  const URL = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${api_key}`;

  let summonerInfo;
  let matchData;

  promiseReturn(URL)
    .then(userData => {
      const accountId = userData.accountId;
      const URL2 = `https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}?api_key=${api_key}`;

      summonerInfo = userData;

      return promiseReturn(URL2);
    })
    .then(matchData => {
      const matchId =
        matchData && matchData.matches && matchData.matches[0].gameId;
      const URL3 = `https://na1.api.riotgames.com/lol/match/v3/matches/${matchId}?api_key=${api_key}`;
      return promiseReturn(URL3);
    })
    .then(match => {
      matchData = match;
      res.json({
        summonerInfo,
        matchData
      });
    })
    .catch(err => {
      console.log('error', err);
    });
});

function promiseReturn(url) {
  return new Promise((resolve, reject) => {
    rp(url, function(error, response, body) {
      if (error) {
        reject(error);
      }

      if (body) {
        resolve(JSON.parse(body));
      }
    });
  });
}

module.exports = router;
