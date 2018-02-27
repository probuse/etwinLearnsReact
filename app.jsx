var PLAYERS = [
  {
    names: "Jim Robbins",
    score: 45,
    id: 1
  },
  {
    names: "Tim Ferriss",
    score: 77,
    id: 2
  },
  {
    names: "etwin Himself",
    score: 23,
    id: 3
  },
  {
    names: "Henge Phil",
    score: 34,
    id: 4
  }
]

var nextId = 5;

class Stopwatch extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      previousTime: 0,
      elapsedTime: 0
    };
    this.onStop = this.onStop.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onTick = this.onTick.bind(this);
  }
   
  componentDidMount() {
   this.interval = setInterval(this.onTick, 100);
  }
  
  componentWillUnmount() {
   clearInterval(this.interval);
  }

  onTick() {
    if (this.state.running) {
      const now = Date.now();
      this.setState({
        previousTime: now,
	elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
      });
    }
  }

  onStop() {
    console.log('running onStop')
    this.setState({running: false});
  }
  onStart() {
    this.setState({
      running: true,
      previousTime: Date.now()
    });
  }
  onReset() {
  }

  render() {
    
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
	<div className="stopwatch-time">0</div>
	{ this.state.running ? 
	  <button onClick={this.onStop}>Stop</button> 
	  : 
	  <button onClick={this.onStart}>Start</button> 
	}
	<button onClick={this.onReset}>Reset</button>
      </div>
    );
  }
}

class AddPlayerForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
    this.onNameChange = this.onNameChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  }

  onNameChange(e) {
    this.setState(
      {
        name: e.target.value 
      } 
    );
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({name: ""})
  }

  render() {
    return(
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
	  <input type="text" value={this.state.name} onChange={this.onNameChange}/>
	  <input type="submit" value="Add Player" />
	</form>
      </div>
    );
  }
}

function Stats(props) {
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce(function(total, player) {
    return total + player.score;
  }, 0);

  return(
    <table className="stats">
      <tbody>
        <tr>
	  <td>Players:</td>
	  <td>{totalPlayers}</td>
	</tr>
	<tr>
	  <td>Total Points</td>
	  <td>{totalPoints}</td>
	</tr>
      </tbody>
    </table>
  );
}
 
Stats.propTypes = {
  players: React.PropTypes.array.isRequired,
};

function Header(props) {
  return(
    <div className="header">
      <Stats players={props.players}/>
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired,
}

function Player(props) {
   return(
      <div className="player">
        <div className="player-name">
          <a className="remove-player" onClick={props.onRemove}>X</a>
          {props.names}
        </div>
        <div className="player-score">
          <Counter score={props.score} onChange={props.onScoreChange}/> 
        </div>
      </div>
    );
} 

Player.propTypes = {
  names: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired,
}


function Counter(props) {
   return(
     <div className="counter">
       <button className="counter-action decrement" onClick={function() {props.onChange(-1);}}> - </button>
       <div className="counter-score">{props.score}</div>
       <button className="counter-action increment" onClick={function() {props.onChange(1)}}> + </button>
     </div>
    );
}

Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

class Application extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      players: this.props.initialPlayers,
    }
    this.onPlayerAdd = this.onPlayerAdd.bind(this);
  }
  
  onScoreChange(index, delta) {
    this.state.players[index].score += delta;
    this.setState(this.state);
  }
  
  onPlayerAdd(name) {
    this.state.players.push({
      names: name,
      score: 0,
      id: nextId,
    });
    this.setState(this.state);
    nextId += 1;
  }
  
  onRemovePlayer(index) {
    this.state.players.splice(index, 1);
    this.setState(this.state);
  }

  render() {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players}/>
        <div className="players">
          {this.state.players.map(function(player, index) {
	    return(
	      <Player
	        onScoreChange={function(delta) {this.onScoreChange(index, delta)}.bind(this)}
		onRemove={function() {this.onRemovePlayer(index)}.bind(this)}
	        names={player.names}  
		score={player.score} 
		key={player.id}/>
	    ); 
	  }.bind(this))}
        </div>
	<AddPlayerForm onAdd={this.onPlayerAdd}/>
      </div>
    );
  }
}

Application.propTypes = {
  title: React.PropTypes.string,
  initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
    names: React.PropTypes.string.isRequired,
    score: React.PropTypes.number.isRequired,
    id: React.PropTypes.number.isRequired,
  })).isRequired,
}

Application.defaultProps = {
  title: "Scoreboard",
}
ReactDOM.render(
  <Application initialPlayers={PLAYERS}/>,
  document.getElementById('container')
);
