import React from 'react';
import ReactDOM from 'react-dom';
import templates_data from './game_templates.json'
import { Button, Table, Form, Row } from 'react-bootstrap';
import './index.css';
// import { CharacterAssignmentForm } from './Steps'

class CharacterAssignmentDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.action(event);
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



class CharacterAssignmentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          "candidates": this.props.candidates,
          "confirmed": false,
          "selected": []
        }
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        var selected = this.state.selected;
        selected.push(event.target.value);
        this.setState({"selected": selected});
        var candidates = this.state.candidates.filter(x => !this.state.selected.includes(x));
        
        this.setState({"candidates": candidates})
    }

    handleSubmit() {
      this.setState({"confirmed": true});
      this.props.action(this.state.selected);
    }
    
    render() {
      var roles = Array.from(Array(this.props.number).keys());
      return (
        <div>
            <Form>
            <Row>
              <Form.Group controlId="ControlSelect1">
                <Form.Label>{this.props.display_name}</Form.Label>
                {
                  roles.map(c => {
                    return <CharacterAssignmentDropdown 
                      candidates={this.state.candidates}
                      action={this.handleChange}
                    />
                  })
                    
                }
              </Form.Group>
            </Row>
            <Button onClick={this.handleSubmit} variant="primary">确认</Button>
            </Form>
        </div>
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
            <th>事件</th>
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

  handleAssignment(value) {
    console.log(value)
  }

  render() {
    return (
      <div className=".sidebar-item">
        <div className="sidebar-sticky">
          <DayNightStage stage={this.state.stage} number={this.state.number} />
          <CharacterAssignmentForm display_name="狼人" number={2} candidates={[1,2,3,4]} action={this.handleAssignment} />
          <Button onClick={this.handleSubmit} variant="primary">下一步</Button>
        </div>
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
      "current_step": "prepare"
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

  handleNextStep() {

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
        <div className="game-process">
          <GameStagePanel />
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
