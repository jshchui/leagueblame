import React, { Component } from 'react';

class PlayerBox extends Component {
    
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="stats-list__box">
        <h2>{this.props.title}</h2>
        <p className="stats-list__kda">
          {this.props.kda} 
          <span className="stats-list__kda-text">kda</span>
        </p>
        <p className="stats-list__player">{this.props.name}</p>
        <p>{this.props.champion}</p>
      </div>
    )
  }
}

export default PlayerBox;