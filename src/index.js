import React from 'react';
import ReactDOM from 'react-dom';
import templates from './game_templates.json'
import './index.css';
import { realpathSync } from 'fs';

// var headers = [
//   "号码", "姓名", "角色", "技能", "死亡情况", "警徽"
// ];

// var players = [
//   ["1", "Player1", "", "", "", ""],
//   ["2", "Player2", "", "", "", ""],
//   ["3", "Player3", "", "", "", ""],
//   ["4", "Player4", "", "", "", ""],
//   ["5", "Player5", "", "", "", ""],
//   ["6", "Player6", "", "", "", ""],
//   ["7", "Player7", "", "", "", ""],
//   ["8", "Player8", "", "", "", ""],
//   ["9", "Player9", "", "", "", ""],
//   ["10", "Player10", "", "", "", ""],
//   ["11", "Player11", "", "", "", ""],
//   ["12", "Player12", "", "", "", ""]
// ];

class Infobox extends React.Component {
  render() {
    return (
      <p> 该游戏包含以下角色：<br></br>
        {this.props.value.map(pair => {
          return (<ul><strong>{pair[0]}</strong> {pair[1]}名</ul>)
        })}
      </p>
    )
  }
}



class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "data": templates,
      "value": "default0",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  renderInfobox(value) {
    var characters = this.state.data.find(function(e) {
      return e.name === value;
    }).characters.map(c => {
      return [c.display_name, c.number];
    });
    return <Infobox value={characters} />
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.renderInfobox(event.target.value);
  }

  handleSubmit(event) {
    
  }

  render() {
    return (
      <form>
        <label>
          选择游戏模板：
          <br></br>
          <select value={this.state.value} onChange={this.handleChange}>
            {
              this.state.data.map(element => {
                return <option value={element.name}>{element.display_name}</option>;
              })
            }
          </select>
        </label>
        <br />
        {this.renderInfobox(this.state.value)}
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {/* TODO */}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Template />,
  document.getElementById('root')
);
