import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    data: {}
  }

  componentDidMount() {
    // this works because we set up proxy in package.json
    fetch('/users')
    .then(res => res.json())
    .then(data => this.setState({ data}));
  }


  render() {
    console.log(this.state.data);
    const matchInfo = this.state.data && this.state.data.matchData;
    const champions = this.state.data && this.state.data.championData && this.state.data.championData.data;
    const matchParticipants = matchInfo && matchInfo.participantIdentities; // array of 10 people

    const matchParticipantsStats = matchInfo && matchInfo.participants; // array of 10 peoples stats

    const participantsLength = matchParticipantsStats && matchParticipantsStats.length;

    let highestKDA = 0;
    let highestKDAPlayerId;
    let highestKDAPlayerName;
    let highestKDAChampionId;

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
      if (kda > highestKDA) {
        highestKDA = kda;
        highestKDAPlayerId = playerId;
        highestKDAChampionId = championId;
        highestKDAPlayerName = playerName;
      }
    }
    console.log('champs', champions);

    // let highestKDAChamp = champions &&  Object.keys(champions);
    console.log('higestKDAChamp');
    // for(let x in champions) {
    //   console.log(x);
    // }

    console.log(`${highestKDAPlayerName} of ID ${highestKDAPlayerId} had the highest KDA of ${highestKDA} as championID of ${highestKDAChampionId}`)

    const playerInfo = this.state.data && this.state.data.summonerInfo;
    const playerName = playerInfo && playerInfo.name;

    const currentPlayerInfo = matchParticipants && matchParticipants.filter(players => {
      const pInfo = players.player;
      const pName = pInfo.summonerName;

      return pName === playerName;  
    });


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
