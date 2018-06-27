import React, { Component } from 'react';
import './App.css';
import PlayerBox from './components/PlayerBox';

import champ from './champions';
import axios from 'axios';
// import { STATES } from './test';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      value: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.calculateGame = this.calculateGame.bind(this);
  }

  componentDidMount() {
    // this works because we set up proxy in package.json
    // fetch('/users')
    // .then(res => res.json())
    // .then(data => this.setState({ data}));

    // sets the champion data in the state
    
    
    
    // DELETE
    // this.setState({
    //   championData: Object.values(champ.champ)
    // })
  }

  calculateGame() {
    // const champions = this.state.data && this.state.data.championData && this.state.data.championData.data;

    // gets latest match info (game duration, gameID, PARTICIPANTS STATS, PARTICIPANTSIDENTITIES)
    const matchInfo = this.state.data && this.state.data.matchData;

    // gets match participants Info (participantId, accountId, summonerId, SUMMONERNAME);
    const matchParticipants = matchInfo && matchInfo.participantIdentities; // array of 10 people

    // gets the stats of each participants (team, firstblood, etc)
    const matchParticipantsStats = matchInfo && matchInfo.participants; // array of 10 peoples stats

    // should be 10 because 10 players
    const participantsLength = matchParticipantsStats && matchParticipantsStats.length;

    // gets the summoner info for the name entered
    const playerInfo = this.state.data && this.state.data.summonerInfo;

    // gets summoner name
    const playerName = playerInfo && playerInfo.name;

    // gets the summoner player match info
    const currentPlayerInfo = matchParticipants && matchParticipants.filter(players => {
      const pInfo = players.player;
      const pName = pInfo.summonerName;

      return pName === playerName;  
    });

    // team 1 highest
    let t1HighestKDA = 0;
    let t1HighestKDAPlayerId;
    let t1HighestKDAPlayerName;
    let t1HighestKDAChampionId;

    //team 2 highest
    let t2HighestKDA = 0;
    let t2HighestKDAPlayerId;
    let t2HighestKDAPlayerName;
    let t2HighestKDAChampionId;

    // team 1 lowest
    let t1LowestKDA = 0;
    let t1LowestKDAPlayerId;
    let t1LowestKDAPlayerName;
    let t1LowestKDAChampionId;

    // team 2 lowest
    let t2LowestKDA = 0;
    let t2LowestKDAPlayerId;
    let t2LowestKDAPlayerName;
    let t2LowestKDAChampionId;

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

      const kda = (kills + assists) / (deaths || 1);

      //highest KDA for team 1 or team2
      if ((kda > t1HighestKDA) && i < 5) {
        t1HighestKDA = parseFloat(kda).toFixed(2);
        t1HighestKDAPlayerId = playerId;
        t1HighestKDAChampionId = championId;
        t1HighestKDAPlayerName = playerName;
      } else if ((kda > t2HighestKDA) && i >= 5) {
        t2HighestKDA = parseFloat(kda).toFixed(2);
        t2HighestKDAPlayerId = playerId;
        t2HighestKDAChampionId = championId;
        t2HighestKDAPlayerName = playerName;
      }

      //lowest KDA
      if (((kda < t1LowestKDA) || t1LowestKDA === 0) && i < 5) {
        t1LowestKDA = parseFloat(kda).toFixed(2);
        t1LowestKDAPlayerId = playerId;
        t1LowestKDAChampionId = championId;
        t1LowestKDAPlayerName = playerName;
      } else if (((kda < t2LowestKDA) || t2LowestKDA === 0) && i >= 5){
        t2LowestKDA = parseFloat(kda).toFixed(2);
        t2LowestKDAPlayerId = playerId;
        t2LowestKDAChampionId = championId;
        t2LowestKDAPlayerName = playerName;
      }

      // current player
      if (playerName === currentPlayerInfo[0].player.summonerName) {
        currentPlayerKDA = parseFloat(kda).toFixed(2);
        currentPlayerName = playerName;
        currentPlayerChampionId = championId;
      }
    }

    // get champion name of these characters
    let t1HighestKDAChamp = t1HighestKDAChampionId && this.findwhere(Object.values(champ.champ), {"id": t1HighestKDAChampionId}).name;
    let t1LowestKDAChamp = t1LowestKDAChampionId && this.findwhere(Object.values(champ.champ), {"id": t1LowestKDAChampionId}).name;
    let t2HighestKDAChamp = t2HighestKDAChampionId && this.findwhere(Object.values(champ.champ), {"id": t2HighestKDAChampionId}).name;
    let t2LowestKDAChamp = t2LowestKDAChampionId && this.findwhere(Object.values(champ.champ), {"id": t2LowestKDAChampionId}).name;
    let currentPlayerChamp = currentPlayerChampionId && this.findwhere(Object.values(champ.champ), {"id": currentPlayerChampionId}).name;

    this.setState({
      t1HighestKDAPlayer: {
        t1HighestKDA,
        t1HighestKDAChamp,
        t1HighestKDAPlayerName,
      },
      t2HighestKDAPlayer: {
        t2HighestKDA,
        t2HighestKDAChamp,
        t2HighestKDAPlayerName,
      },
      t1LowestKDAPlayer: {
        t1LowestKDA,
        t1LowestKDAChamp,
        t1LowestKDAPlayerName,
      },
      t2LowestKDAPlayer: {
        t2LowestKDA,
        t2LowestKDAChamp,
        t2LowestKDAPlayerName,
      },
      currentPlayer: {
        currentPlayerKDA,
        currentPlayerChamp,
        currentPlayerName,
      }
    })
  }

  // found this online
  findwhere(array, criteria) {
    return array.find(item => Object.keys(criteria).every(key => item[key] === criteria[key]));
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    // axios.get('/users')
    //   .then(res => res.json())
    //   .then(data => this.setState({ data}));

    axios.get(`/users/${this.state.value}`)
      .then(res => {
        this.setState({ data: res.data})
        this.calculateGame();
      });
    
    event.preventDefault();
  }

  render() {
    const currentPlayer = this.state.currentPlayer;
    const t1Highest = this.state.t1HighestKDAPlayer;
    const t2Highest = this.state.t2HighestKDAPlayer;
    const t1Lowest = this.state.t1LowestKDAPlayer;
    const t2Lowest = this.state.t2LowestKDAPlayer;

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value="Submit"/> 
        </form>
        <h1>Last match for: {currentPlayer && currentPlayer.currentPlayerName}</h1>
        <h2>Blue Side</h2>
        <div className="stats-list">
          <PlayerBox
            title={'Best Performing Player'}
            team={'team1'}
            kda={t1Highest && t1Highest.t1HighestKDA} 
            name={t1Highest && t1Highest.t1HighestKDAPlayerName}
            champion={t1Highest && t1Highest.t1HighestKDAChamp}
          />

          <PlayerBox
            title={'Worst Performing Player'}
            team={'team1'}
            kda={t1Lowest && t1Lowest.t1LowestKDA} 
            name={t1Lowest && t1Lowest.t1LowestKDAPlayerName}
            champion={t1Lowest && t1Lowest.t1LowestKDAChamp}
          />

          <PlayerBox
            title={'Your Stats'}
            team={'team1'}
            kda={currentPlayer && currentPlayer.currentPlayerKDA} 
            name={currentPlayer && currentPlayer.currentPlayerName}
            champion={currentPlayer && currentPlayer.currentPlayerChamp}
          />
        </div>

        <h2>Red Side</h2>
        <div className="stats-list">
          <PlayerBox
            title={'Best Performing Player'}
            team={'team1'}
            kda={t2Highest && t2Highest.t2HighestKDA} 
            name={t2Highest && t2Highest.t2HighestKDAPlayerName}
            champion={t2Highest && t2Highest.t2HighestKDAChamp}
          />

          <PlayerBox
            title={'Worst Performing Player'}
            team={'team1'}
            kda={t2Lowest && t2Lowest.t2LowestKDA} 
            name={t2Lowest && t2Lowest.t2LowestKDAPlayerName}
            champion={t2Lowest && t2Lowest.t2LowestKDAChamp}
          />
        </div>
      </div>
    );
  }
}

export default App;
