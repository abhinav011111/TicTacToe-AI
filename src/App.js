import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Board from './components/Board';
import Button from '@material-ui/core/Button';

const ai = 'X';
const human = 'O';
const SCORE = {
  X: 1,
  O: -1,
  TIE: 0
};
const getIJ =  [{i:0,j:0},{i:0,j:1},{i:0,j:2},{i:1,j:0},{i:1,j:1},{i:1,j:2},{i:2,j:0},{i:2,j:1},{i:2,j:2}];

function App() {
  const [board, setBoard] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
  const [msg, setMsg] = useState("It's Your Turn");
  const [count, setCount] = useState(0);
  const [newGame, setNewGame] = useState(false);

  const handleClick = (e) => {
    const { i, j } = getIJ[e];
    if(msg!=="It's Your Turn" || board[i][j]!=='') return;
    const newBoard = [...board];
    newBoard[i][j] = human;
    setBoard(newBoard);
    setCount(count + 1);

    handleWinner();
    console.log(count);

    if (count < 4) {
      aiTurn();
    }
  };

  const handleWinner = () => {
    const winner = checkWin(board);
  
    switch (winner) {
      case ai:
        setMsg("AI Win");
        setNewGame(true);
        break;
      case human:
        setMsg("You Beat AI");
        setNewGame(true);
        break;
      case 'TIE':
        setMsg("Match Draw");
        setNewGame(true);
        break;
      default:
        // No winner yet
    }
  };
  

  const startNewGame = () => {
    setBoard([['', '', ''], ['', '', ''], ['', '', '']]);
    setMsg("It's Your Turn");
    setCount(0);
    setNewGame(false);
  };

  const checkWin = (board) => {
    let winner = null;
    let blank = 0;
  
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === board[i][1] && board[i][0] === board[i][2] && board[i][0] !== '') {
        winner = board[i][0];
        break;
      } else if (board[0][i] === board[1][i] && board[0][i] === board[2][i] && board[0][i] !== '') {
        winner = board[0][i];
        break;
      }
    }
  
    if (board[0][0] === board[1][1] && board[2][2] === board[1][1] && board[1][1] !== '') {
      winner = board[0][0];
    }
  
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[2][0] !== '') {
      winner = board[2][0];
    }
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') blank++;
      }
    }
  
    if (blank === 0 && winner === null) return 'TIE';
    else return winner;
  };
  
  const minmax = (board, isMaximizing) => {
    const result = checkWin(board);
    if (result != null) return SCORE[result];
  
    let bestScore = isMaximizing ? -Infinity : Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = isMaximizing ? ai : human;
          const score = minmax(board, !isMaximizing);
          board[i][j] = '';
          bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
      }
    }
  
    return bestScore;
  };

  const bestMove = (board) => {
    let bestScore = -Infinity;
    let _i=null, _j=null;
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = ai;
          const score = minmax(board, false);
          board[i][j] = '';
          if (bestScore < score) {
            bestScore = score;
            _i = i;
            _j = j;
          }
        }
      }
    }
  
    return { i: _i, j: _j };
  };

  const aiTurn = () => {
    const { i, j } = bestMove(board);
    const newBoard = [...board];
    newBoard[i][j] = ai;
    setBoard(newBoard);
    setCount(count + 1);

    handleWinner();

    if (count === 9) {
      setMsg("Start New Game");
    }
  };

  let style={
    btn:{
      textAlign:"center",
      margin:"10px auto",
      background:"#d7aeff",
      color:"#3e2655",
      fontSize:"larger",
    fontWeight:"600"
    }
  }
    

  return (
    <div style={{padding: 70 }} >
        <Container  maxWidth="sm">
          <Typography variant="h2" align="center"  gutterBottom> TicTacToe </Typography>
          <div>
            <Board board={board} handleClick = {handleClick} />
            <Typography style={{color:"rgb(226 209 209)", margin:"20px",textAlign:"center"}} variant="h4" component="h4" > {msg} </Typography>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          {newGame?<Button style={style.btn} variant="contained" onClick={startNewGame} >NewGame</Button>:''}
          </div>
        </Container>
    </div>
  )
}

export default App;

