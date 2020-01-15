import React from 'react';
import ReactDOM from 'react-dom';
import templates_data from './game_templates.json'
import './index.css';
import { Button, Table} from 'react-bootstrap';

// var headers = [
//   "号码", "姓名", "角色", "技能", "死亡情况", "警徽"
// ];


class Infobox extends React.Component {
  render() {
    return (
      <div> <p>该游戏包含以下角色：</p>
        {this.props.value.map(pair => {
          return (<strong> {pair[1]}名{pair[0]} </strong>)
        })}
      </div>
    )
  }
}



class GameSelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "value": "default0"
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit() {
    this.props.action(this.state.value);
  }

  render() {
    const selectedValue = this.state.value;
    var characters = this.props.data.find(function(e) {
      return e.name === selectedValue;
    }).characters.map(c => {
      return [c.display_name, c.number];
    });

    return (
      <form>
        <label>
          选择游戏模板：
          <br></br>
          <select value={this.state.value} onChange={this.handleChange}>
            {
              this.props.data.map(element => {
                return <option value={element.name}>{element.display_name}</option>;
              })
            }
          </select>
          <Button onClick={this.handleSubmit} variant="primary">确认</Button>
        </label>
        <br />
        <Infobox value={characters}/>
        
      </form>
    );
  }
}

class PlayerRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "character": "",
      "death": "存活",
      "badge": false
    };
  }

  render() {
    return (
      <tr>
  <td id={"player-" + this.props.playerId + "-id"}>{this.props.playerId}</td>
        <td><input type="text" value={this.props.playerId + "号玩家"}></input></td>
        <td>{this.state.character}</td>
        <td>{}</td>
        <td>{}</td>
        <td>{this.state.death}</td>
        <td>{this.state.badge ? "*": ""}</td>
      </tr>
    )
    
  }
}


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  render() {
    const nPlayer = this.props.nplayers;
    var playerIds = Array.from(Array(nPlayer).keys()).map(k => {return k + 1});
    console.log(playerIds)
    return (
      <Table striped bordered hover responsive="md">
        <thead>
          <tr>
            <th>号码</th>
            <th>姓名</th>
            <th>角色</th>
            <th>阵营</th>
            <th>技能</th>
            <th>存活情况</th>
            <th>警徽</th>
          </tr>
        </thead>
        <tbody>
          {
            playerIds.map(pid => {
              return <PlayerRow playerId={pid}/>;
            })   
          }
          
        </tbody>
      </Table>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "nplayers":  12
    };

    this.handleGameSelect = this.handleGameSelect.bind(this);
  }

  handleGameSelect(value) {
    var data = this.props.templates.find(e => {
      return e.name === value
    })
    this.setState({template: data});
    this.setState({nplayers: data.total_players})

  }

  render() {
    var templatesData = this.props.templates;
    return (
      <div className="game">
        <h1>狼人杀裁判小助手</h1>
        <br></br>
        <div className="game-select-box">
          <GameSelectBox data={templatesData} action={this.handleGameSelect} />
        </div>
        <div className="game-board">
          <Board nplayers={this.state.nplayers} />
        </div>
        <div className="game-info">
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game templates={templates_data}/>,
  document.getElementById('root')
);
