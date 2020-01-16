import React from 'react';
import { Button, Form} from 'react-bootstrap';

// class WolfHunt extends React.Component {
//     render() {
//       return (
//         <div> <p>该游戏包含以下角色：
//           {this.props.value.map(pair => {
//             return (<strong> {pair[1]}名{pair[0]} </strong>)
//           })}
//         </p>
//         </div>
//       )
//     }
// }


class CharacterAssignmentDropdown extends React.Component {
  render() {
    return (
      <Form.Control as="select">
        {
          this.props.candidates.map(c => {
            return <option>{c}</option>
          })
        }
      </Form.Control>
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

            <Form.Group controlId="ControlSelect1">
            <Form.Label>{this.props.display_name}</Form.Label>
              {
                roles.map(c => {
                  return <CharacterAssignmentDropdown 
                    candidates={this.state.candidates}
                    onChange={this.handleChange}
                  />
                })
                  
              }
                
            </Form.Group>
            <Button onClick={this.handleSubmit} variant="primary">确认</Button>
            </Form>
        </div>
      )
    }
}
