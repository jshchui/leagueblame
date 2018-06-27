var express = require('express');
var router = express.Router();

var request = require('request');
var rp = require('request-promise');
var async = require('async');

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  const api_key = 'RGAPI-e4bf6f4b-e43a-49b9-8e27-89622426545b';
  const summonerName = req.params.name;
  const URL = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${api_key}`;

  let summonerInfo;
  let championData;
  let matchData;

  const thisneedstobefexed = 
    promiseReturn(URL)
    .then((userData) => {
      const accountId = userData.accountId;
      const URL2 = `https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}?api_key=${api_key}`;

      summonerInfo = userData;

      return promiseReturn(URL2);
    })
    .then((matchData) => {
      const matchId = matchData && matchData.matches && matchData.matches[0].gameId;
      // const URL3 = `https://na1.api.riotgames.com/lol/match/v3/timelines/by-match/${matchId}?api_key=${api_key}`;
      const URL3 = `https://na1.api.riotgames.com/lol/match/v3/matches/${matchId}?api_key=${api_key}`;
      return promiseReturn(URL3);
    })
    .then((match) => {
      matchData = match;
      // res.json({
      //   matchData,
      //   championData
      // })
      // const URL4 = `https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&dataById=false&api_key=${api_key}`;
      const URL4 = `empty test`;

      return URL4;
    })
    .then((champData) => {
      championData = champData;

      res.json({
        summonerInfo, 
        matchData,
        championData
      })
    })
    .catch((err) => {
      console.log('error', err);
    })
});

function promiseReturn(url) {
  return new Promise((resolve, reject) => {
    rp(url, function (error, response, body) {
      if(error) {
        reject(error);
      };

      if(body) {
        resolve(JSON.parse(body));
      };
    })
  });
}

module.exports = router;
