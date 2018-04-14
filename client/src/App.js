import React, { Component } from 'react';
import './App.css';

import champ from './champions';
// import { STATES } from './test';

class App extends Component {
  state = {
    data: {}
  }

  componentDidMount() {
    // this works because we set up proxy in package.json
    fetch('/users')
    .then(res => res.json())
    .then(data => this.setState({ data}));

    this.setState({
      championData: Object.values(champ.champ)
    })
  }

  findwhere(array, criteria) {
    return array.find(item => Object.keys(criteria).every(key => item[key] === criteria[key]));
  }


  render() {
    console.log(this.state.data);
    const matchInfo = this.state.data && this.state.data.matchData;
    const champions = this.state.data && this.state.data.championData && this.state.data.championData.data;
    const matchParticipants = matchInfo && matchInfo.participantIdentities; // array of 10 people

    const matchParticipantsStats = matchInfo && matchInfo.participants; // array of 10 peoples stats

    const participantsLength = matchParticipantsStats && matchParticipantsStats.length;

    const playerInfo = this.state.data && this.state.data.summonerInfo;
    const playerName = playerInfo && playerInfo.name;

    const currentPlayerInfo = matchParticipants && matchParticipants.filter(players => {
      const pInfo = players.player;
      const pName = pInfo.summonerName;

      return pName === playerName;  
    });

    let highestKDA = 0;
    let highestKDAPlayerId;
    let highestKDAPlayerName;
    let highestKDAChampionId;

    let lowestKDA = 0;
    let lowestKDAPlayerId;
    let lowestKDAPlayerName;
    let lowestKDAChampionId;

    let currentPlayerKDA = 0;
    let currentPlayerId;
    let currentPlayerName;
    let currentPlayerChampionId;


    // loops through participants Stats
    for(let i = 0; i < participantsLength; i++) {
      const championId = matchParticipantsStats[i].championId;
      const stats = matchParticipantsStats[i].stats;
      const playerId = stats.participantId;
      const kills = stats.kills;
      const deaths = stats.deaths;
      const assists = stats.assists;

      const playerName = matchParticipants[i].player.summonerName;

      const kda = (kills + assists) / deaths;
      //highest KDA
      if (kda > highestKDA) {
        highestKDA = kda;
        highestKDAPlayerId = playerId;
        highestKDAChampionId = championId;
        highestKDAPlayerName = playerName;
      }

      //lowest KDA
      if ((kda < lowestKDA) || lowestKDA === 0) {

        console.log('kda logged for lowest');
        lowestKDA = kda;
        lowestKDAPlayerId = playerId;
        lowestKDAChampionId = championId;
        lowestKDAPlayerName = playerName;
      }

      if (playerName === currentPlayerInfo[0].player.summonerName) {
        currentPlayerKDA = kda;
        currentPlayerName = playerName;
        currentPlayerChampionId = championId;
      }
    }

    let highestKDAChamp = highestKDAChampionId && this.findwhere(this.state.championData, {"id": highestKDAChampionId}).name;
    let lowestKDAChamp = lowestKDAChampionId && this.findwhere(this.state.championData, {"id": lowestKDAChampionId}).name;
    let currentPlayerChamp = currentPlayerChampionId && this.findwhere(this.state.championData, {"id": currentPlayerChampionId}).name;

    // console.log('champs', champions);

    // let highestKDAChamp = champions &&  Object.keys(champions);
    console.log('higestKDAChamp', highestKDAChamp);
    // for(let x in champions) {
    //   console.log(x);
    // }

    console.log(`${highestKDAPlayerName} playing ${highestKDAChamp} had the highest KDA of ${highestKDA} as championID of ${highestKDAChampionId}`)
    console.log(`${lowestKDAPlayerName} playing ${lowestKDAChamp} had the lowest KDA of ${lowestKDA} as championID of ${lowestKDAChampionId}`)
    console.log(`${currentPlayerName} playing ${currentPlayerChamp} had a KDA of ${currentPlayerKDA} as championID of ${currentPlayerChampionId}`)


    // const highestKDAPlayer = matchParticipantsStats && matchParticipantsStats.filter(players => {
    //   const stats = players.stats;
    //   const playerId = stats.participantId;
    //   const kills = stats.kills;
    //   const deaths = stats.deaths;
    //   const assists = stats.assits;

    //   const kda = (kills + assists) / deaths;
    //   if (kda > highestKDA) {
    //     highestKDA = kda;
    //     highestKDAPlayerId = playerId;
    //   }

    //   return 
    //   console.log('players', players);
    // });

    // console.log('playerName', playerName);
    // console.log('matchParticipants', matchParticipants);
    // console.log('pNames', currentPlayerInfo);

    // get highest KDA out of 10 players

    


    return (
      <div className="App">
        <h1>Users</h1>
        <ul>
          {/* {this.state.data.map(data =>
            <li key={data.id}>{data.username}</li>
          )} */}
        </ul>
      </div>
    );
  }
}

export default App;
