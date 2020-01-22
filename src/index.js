import React from 'react';
import ReactDOM from 'react-dom';
import templates_data from './game_templates.json'
import { Button, Table, Form, Row, Col } from 'react-bootstrap';
import './index.css';
// import { CharacterAssignmentForm } from './Steps'

class CharacterAssignmentDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.action(this.props.role, event, this.props.id);
  }

  render() {
    return (
      <select onChange={this.handleChange}>
        <option value="0">-</option>
        {
          this.props.candidates.map(c => {
            return <option value={c}>{c}</option>;
          })
        }
      </select>
    )
  }
}




class Infobox extends React.Component {
  render() {
    return (
      <div> <p>该游戏包含以下角色：
        {this.props.value.map(pair => {
          return (<strong> {pair[1]}名{pair[0]} </strong>)
        })}
      </p>
      </div>
    )
  }
}



class GameSelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "value": "default0",
      "selected": false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit() {
    this.setState({"selected": true});
    this.props.action(this.state.value);
  }

  render() {
    const selectedValue = this.state.value;
    const selectedData = this.props.data.find(function(e) {
      return e.name === selectedValue;
    })
    const displayName = selectedData.display_name
    var characters = selectedData.characters.map(c => {
      return [c.display_name, c.number];
    });

    return (
      <form>
          {
            this.state.selected && (
              <h4>已经选择 {displayName} 作为游戏设置</h4>
            )
          }
          {
            !this.state.selected && (
              <div>
                <label>
                  选择游戏模板：
                </label><br></br>
                <select value={this.state.value} onChange={this.handleChange}>
                  {
                    this.props.data.map(element => {
                      return <option value={element.name}>{element.display_name}</option>;
                    })
                  }
                </select>
                <Button onClick={this.handleSubmit} variant="primary">确认</Button>
              </div>

            )

          }
        
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
    return (
      <Table striped bordered hover responsive="md">
        <thead>
          <tr>
            <th>号码</th>
            <th>姓名</th>
            <th>角色</th>
            <th>阵营</th>
            <th>技能</th>
            <th>事件</th>
            <th>警徽</th>
          </tr>
        </thead>
        <tbody>
          {
            playerIds.map(pid => {
              return <PlayerRow playerId={pid} />;
            })
          }
          
        </tbody>
      </Table>
    )
  }
}


// class GameStep extends React.Component {

// }


class DayNightStage extends React.Component {
  render() {
    var dayNightMsg = ""
    if (this.props.number === 0) {
      dayNightMsg = "准备阶段"
    } else if (this.props.stage === "day") {
      dayNightMsg = "第" + this.props.number + "天"
    } else {
      dayNightMsg = "第" + this.props.number + "夜"
    }

    return (
      <h3>{dayNightMsg}</h3>
    )
  }
}


class GameStagePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "stage": 'day',
      "number": 0,
      "current_step": "prepare"
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAssignment = this.handleAssignment.bind(this);

  }

  handleSubmit() {
    this.props.action();
  }

  handleAssignment(values) {
    this.props.rolehandler(values);
  }

  render() {
    return (
      <div className=".sidebar-item">
        <div className="sidebar-sticky">
          <DayNightStage stage={this.state.stage} number={this.state.number} />
          <Button onClick={this.handleSubmit} variant="primary">下一步</Button>
        </div>
      </div>

    )
  }
}


class CharacterAssignmentForm extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        "confirmed": false,
        
      }
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(role, event, id) {
    this.props.action(role, event.target.value, id);
  }

  handleSubmit() {

    if (!this.state.confirmed) {
      this.props.confirm();
    }
    this.setState({"confirmed": true});
  }
  
  render() {
    return (
      <div>
        <h3>角色分配</h3>
          <Form>
            <Form.Row>
              {
                this.props.roles.map(role => {
                  if (role.name !== "villager") {
                    return (
                      <div><Form.Label>{role.display_name}</Form.Label>
                      {
                        Array.from(
                          Array(role.number).keys())
                          .map((i) => {
                            return <CharacterAssignmentDropdown 
                              candidates={this.props.candidates}
                              action={this.handleChange}
                              role={role.name}
                              id={i}
                            />
                        })
                      }
                      <Button onClick={this.handleSubmit} variant="primary">确认</Button>
                      </div>
                      )
                  }
                })
              }
            
          </Form.Row>
        </Form>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "nplayers":  12,
      "shift": 'day',
      "number": 0,
      "currentStep": "prepare",
      "roles": {},
      "rolePlayers": {},
      "unassignedPlayers": [],
      "playerStatus": []
    };

    this.handleGameSelect = this.handleGameSelect.bind(this);                                     
    this.handleRoleAssignment = this.handleRoleAssignment.bind(this);
    this.handleRoleAssignmentConfirm = this.handleRoleAssignmentConfirm.bind(this);
    this.updatePlayerRoles = this.updatePlayerRoles.bind(this);
  }

  updatePlayerRoles() {
    console.log(this.state.rolePlayers)
  }

  handleGameSelect(value) {
    var data = this.props.templates.find(e => {
      return e.name === value
    })
    this.setState({template: data});
    this.setState({nplayers: data.total_players});
    this.setState({unassignedPlayers: Array.from(
      Array(data.total_players).keys())
      .map(k => {return k + 1})})
    var roles = {};
    var rolePlayers = this.state.rolePlayers;                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    data.characters.forEach(character => {
      roles[character.name] = character.display_name
      if (character.name !== "villager") {
        rolePlayers[character.name] = Array(character.number);
      }
      
    });
    this.setState({"roles": roles});
    this.setState({"rolePlayers": rolePlayers});
  }

  handleRoleAssignment(role, playerId, id) {
    var rolePlayers = this.state.rolePlayers;
    rolePlayers[role][id] = parseInt(playerId);
    this.setState({rolePlayers: rolePlayers});
  }

  handleRoleAssignmentConfirm() {
    var uniqueValues = new Set(Object.values(this.state.rolePlayers).flat());
    var validNumber = this.state.nplayers - parseInt(this.state.template.characters.find((c) => {
      return c.name === "villager"
    }).number)
    if (uniqueValues.size === validNumber && !("-" in uniqueValues) ) {
      var villagerIds = this.state.unassignedPlayers.filter(id => {
        return !(Array.from(uniqueValues).includes(id))});
      var rolePlayers = this.state.rolePlayers;
      rolePlayers['villagers'] = villagerIds
      this.setState({"rolePlayers": rolePlayers});
      this.updatePlayerRoles();
    } else {
      alert("输入玩家号码有误，请重新选择")
    }

  }

  handleNextStep() {

  }

  render() {
    var templatesData = this.props.templates;
    let characterAssignmentForm;
    if (this.state.template) {
      characterAssignmentForm = <CharacterAssignmentForm 
        roles={this.state.template.characters}
        action={this.handleRoleAssignment}
        confirm={this.handleRoleAssignmentConfirm}
        candidates={this.state.unassignedPlayers} />;
    } else {
      characterAssignmentForm = <Row></Row>;
    }
    return (
      <div className="game">
        <h1>狼人杀裁判小助手</h1>
        <br></br>
        <div className="game-select-box">
          <GameSelectBox data={templatesData} action={this.handleGameSelect} />
          {characterAssignmentForm}
        </div>
        <div className="game-board">
          <Board nplayers={this.state.nplayers} status={this.state.playerStatus}/>
        </div>
        <div className="game-process">
          <GameStagePanel rolehandler={this.handleRoleAssignment}/>
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
