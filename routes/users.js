var express = require('express');
var router = express.Router();

var request = require('request');
var rp = require('request-promise');
var async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const api_key = 'RGAPI-86e227d7-291f-4d5c-a91b-a6b0ca9a339e';
  const URL = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/lflame?api_key=${api_key}`;

  // rp(URL, function (error, response, body) {
  //   console.log('error:', error); // Print the error if one occurred
  //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //   // console.log('body:', body); // Print the HTML for the Google homepage.

  // })
  // .then(function(data) {
  //   const json = JSON.parse(data);
  //   const accountId = json.accountId;
  //   const URL2 = `https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}/recent?api_key=${api_key}`;
  //   let recentMatch;

  //   request(URL2, function (error, response, body) {
  //     const json = JSON.parse(body);
  //     // console.log('json', json);
  //     recentMatch = json.matches[0].gameId;
  //     console.log('recentMatch', recentMatch);
  //     // res.json(json)
  //     return recentMatch;
  //   });
  // })
  // .then(function(data) {
  //   // const json = JSON.parse(data);
  //   console.log('data third', data);
  // })
  // .catch(function(err) {
  //   console.log('err', err);
  // });

  let summonerInfo;
  let championData;
  let matchData;

  const thisneedstobefexed = 
    promiseReturn(URL)
    .then((userData) => {
      const accountId = userData.accountId;
      const URL2 = `https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}/recent?api_key=${api_key}`;
      summonerInfo = userData;

      return promiseReturn(URL2);
    })
    .then((matchData) => {
      const matchId = matchData.matches[0].gameId;
      // const URL3 = `https://na1.api.riotgames.com/lol/match/v3/timelines/by-match/${matchId}?api_key=${api_key}`;
      const URL3 = `https://na1.api.riotgames.com/lol/match/v3/matches/${matchId}?api_key=${api_key}`;
      return promiseReturn(URL3);
    })
    .then((match) => {
      console.log('match', match);
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
