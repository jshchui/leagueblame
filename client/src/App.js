import React, { Component } from 'react';
import './App.css';
import PlayerBox from './components/PlayerBox';
import champ from './champions';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.calculateGame = this.calculateGame.bind(this);
    this.getSortedTeamStats = this.getSortedTeamStats.bind(this);
    this.getAllPlayerNames = this.getAllPlayerNames.bind(this);
    this.getAllPlayerStats = this.getAllPlayerStats.bind(this);
    this.getCurrentPlayerInfo = this.getCurrentPlayerInfo.bind(this);
  }
  
  // data from backend
  data;

  // data from file
  champData;

  componentDidMount() {
    this.champData = Object.values(champ.champ);
  }

  findwhere(array, criteria) {
    return array.find(item => Object.keys(criteria).every(key => item[key] === criteria[key]));
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.get(`/users/${this.state.value}`)
      .then(res => {
        this.data = res.data;
        this.calculateGame();
        this.setState({ value: ''});
      });
  }

  getSortedTeamStats(players, playerStats, side) {
    const team = players.slice(
      (side === 'blue') ? 0 : players.length / 2, 
      (side === 'blue') ? players.length / 2 : players.length,
    )

    const teamStats = playerStats.slice(
      (side === 'blue') ? 0 : players.length / 2, 
      (side === 'blue') ? players.length / 2 : players.length,
    )

    const newTeam = [];

    for(let i = 0; i < team.length; i++) {
      const combinedPlayerData = {...team[i], ...teamStats[i]}
      newTeam.push(combinedPlayerData);
    }

    return newTeam.sort((a, b) => Number(a.kda) < Number(b.kda));
  }

  getAllPlayerNames(matchParticipants) {
    return matchParticipants.map((player) => {
      const participantId = player.participantId;
      const playerName = player.player.summonerName;
      return {
        participantId,
        playerName,
      }
    });
  }

  getAllPlayerStats(matchParticipantsStats) {
    return matchParticipantsStats.map((stats) => {
      const championId = stats.championId;
      const participantId = stats.participantId;
      const playerStats = stats.stats;

      const kills = playerStats.kills;
      const deaths = playerStats.deaths;
      const assists = playerStats.assists;
      const kda = parseFloat((kills + assists) / (deaths || 1)).toFixed(2);

      return {
        championId,
        participantId,
        kda,
      }
    });
  }

  getCurrentPlayerInfo(matchParticipants) {
    return matchParticipants.filter(players => {
      const pInfo = players.player;
      const pName = pInfo.summonerName;

      return pName === this.data.summonerInfo.name;
    });
  }

  calculateGame() {
    const matchInfo = this.data && this.data.matchData; // recent match info (gameID, participant stats and identities
    const matchParticipants = matchInfo && matchInfo.participantIdentities; // 10 players (participantId, accountId, summonerId, summonerName);
    const matchParticipantsStats = matchInfo && matchInfo.participants; // 10 players (team, firstblood, kills, etc);

    const allPlayerNames = matchParticipants && this.getAllPlayerNames(matchParticipants);
    const allPlayerStats = matchParticipantsStats && this.getAllPlayerStats(matchParticipantsStats);

    // teams sorted by KDA
    const blueTeam = allPlayerNames && allPlayerStats && this.getSortedTeamStats(allPlayerNames, allPlayerStats, 'blue');
    const redTeam = allPlayerNames && allPlayerStats && this.getSortedTeamStats(allPlayerNames, allPlayerStats, 'red');
    
    // stats for player entered
    const currentPlayerInfo = matchParticipants && this.getCurrentPlayerInfo(matchParticipants);
    let currentPlayerStats;
    if (currentPlayerInfo && currentPlayerInfo[0].participantId < 5) {
      currentPlayerStats = blueTeam.filter((stats) => {
        return stats.participantId === currentPlayerInfo[0].participantId
      });
    } else if (currentPlayerInfo && currentPlayerInfo[0].participantId >= 5) {
      currentPlayerStats = redTeam.filter((stats) => {
        return stats.participantId === currentPlayerInfo[0].participantId
      });
    }

    // get stats for players that matter
    const blueTeamHighestKDAName = blueTeam && blueTeam[0] && blueTeam[0].playerName;
    const blueTeamHighestKDA = blueTeam && blueTeam[0] && blueTeam[0].kda;
    const blueTeamHighestKDAChamp = blueTeam && blueTeam[0].championId && this.findwhere(this.champData, {"id": blueTeam[0].championId}).name;
    
    const blueTeamLowestKDA = blueTeam && blueTeam[blueTeam.length - 1] && blueTeam[blueTeam.length - 1].kda;
    const blueTeamLowestKDAName = blueTeam && blueTeam[blueTeam.length - 1] && blueTeam[blueTeam.length - 1].playerName;
    const blueTeamLowestKDAChamp = blueTeam && blueTeam[blueTeam.length - 1].championId && this.findwhere(this.champData, {"id": blueTeam[blueTeam.length - 1].championId}).name;
    
    const redTeamHighestKDAName = redTeam && redTeam[0] && redTeam[0].playerName;
    const redTeamHighestKDA = redTeam && redTeam[0] && redTeam[0].kda;
    const redTeamHighestKDAChamp = redTeam && redTeam[0].championId && this.findwhere(this.champData, {"id": redTeam[0].championId}).name;
    
    const redTeamLowestKDA = redTeam && redTeam[redTeam.length - 1] && redTeam[redTeam.length - 1].kda;
    const redTeamLowestKDAName = redTeam && redTeam[redTeam.length - 1] && redTeam[redTeam.length - 1].playerName;
    const redTeamLowestKDAChamp = redTeam && redTeam[redTeam.length - 1].championId && this.findwhere(this.champData, {"id": redTeam[redTeam.length - 1].championId}).name;

    const currentPlayerKDA = currentPlayerStats && currentPlayerStats[0] && currentPlayerStats[0].kda;
    const currentPlayerName = currentPlayerStats && currentPlayerStats[0] && currentPlayerStats[0].playerName;
    const currentPlayerChamp = currentPlayerStats && currentPlayerStats[0] && this.findwhere(this.champData, {"id": currentPlayerStats[0].championId}).name;

    this.setState({
      blueTeamHighestKDAPlayer: {
        blueTeamHighestKDA,
        blueTeamHighestKDAChamp,
        blueTeamHighestKDAName,
      },
      redTeamHighestKDAPlayer: {
        redTeamHighestKDA,
        redTeamHighestKDAChamp,
        redTeamHighestKDAName,
      },
      blueTeamLowestKDAPlayer: {
        blueTeamLowestKDA,
        blueTeamLowestKDAChamp,
        blueTeamLowestKDAName,
      },
      redTeamLowestKDAPlayer: {
        redTeamLowestKDA,
        redTeamLowestKDAChamp,
        redTeamLowestKDAName,
      },
      currentPlayer: {
        currentPlayerKDA,
        currentPlayerChamp,
        currentPlayerName,
      }
    })
  }

  render() {
    const currentPlayer = this.state.currentPlayer;
    const blueTeamHighest = this.state.blueTeamHighestKDAPlayer;
    const redTeamHighest = this.state.redTeamHighestKDAPlayer;
    const blueTeamLowest = this.state.blueTeamLowestKDAPlayer;
    const redTeamLowest = this.state.redTeamLowestKDAPlayer;

    return (
      <div className="App">
        <form className="name-field" onSubmit={this.handleSubmit}>
          <input className="name-field__text-box" type="text" value={this.state.value} onChange={this.handleChange} />
          {/* <input type="submit" value="Submit"/>  */}
        </form>
        <h1>Last match for: {currentPlayer && currentPlayer.currentPlayerName}</h1>
        <div className="stats-list stats-list--player">
          <PlayerBox
            title={'Your Stats'}
            kda={currentPlayer && currentPlayer.currentPlayerKDA} 
            name={currentPlayer && currentPlayer.currentPlayerName}
            champion={currentPlayer && currentPlayer.currentPlayerChamp}
            />
        </div>
        <h2 className="blue-title">Blue Side</h2>
        <div className="stats-list">
          <PlayerBox
            title={'Best Player'}
            kda={blueTeamHighest && blueTeamHighest.blueTeamHighestKDA} 
            name={blueTeamHighest && blueTeamHighest.blueTeamHighestKDAName}
            champion={blueTeamHighest && blueTeamHighest.blueTeamHighestKDAChamp}
          />
          <PlayerBox
            title={'Worst Player Ever'}
            kda={blueTeamLowest && blueTeamLowest.blueTeamLowestKDA} 
            name={blueTeamLowest && blueTeamLowest.blueTeamLowestKDAName}
            champion={blueTeamLowest && blueTeamLowest.blueTeamLowestKDAChamp}
          />
        </div>

        <h2 className="red-title">Red Side</h2>
        <div className="stats-list">
          <PlayerBox
            title={'Best Player'}
            kda={redTeamHighest && redTeamHighest.redTeamHighestKDA} 
            name={redTeamHighest && redTeamHighest.redTeamHighestKDAName}
            champion={redTeamHighest && redTeamHighest.redTeamHighestKDAChamp}
          />
          <PlayerBox
            title={'Worst Player Ever'}
            kda={redTeamLowest && redTeamLowest.redTeamLowestKDA} 
            name={redTeamLowest && redTeamLowest.redTeamLowestKDAName}
            champion={redTeamLowest && redTeamLowest.redTeamLowestKDAChamp}
          />
        </div>
      </div>
    );
  }
}

export default App;
