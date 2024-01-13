import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Board from './components/Board';
import Button from '@material-ui/core/Button';

const getIJ =  [{i:0,j:0},{i:0,j:1},{i:0,j:2},{i:1,j:0},{i:1,j:1},{i:1,j:2},{i:2,j:0},{i:2,j:1},{i:2,j:2}];
const checkTurn = "It's Your Turn";

function App() {
  const [board, setBoard] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
  const [msg, setMsg] = useState("It's Your Turn");
  const [count, setCount] = useState(-2);
  const [countmax, setCountmax] = useState(4);
  const [ai, setAi] = useState('X');
  const [human, setHuman] = useState('O');
  const [SCORE,setScore] = useState({'X': 1, 'O': -1, TIE: 0});

  const startNewGame = () => {
    setBoard([['', '', ''], ['', '', ''], ['', '', '']]);
    setMsg("It's Your Turn");
    setCount(-2);
    setCountmax(4);
    setAi('X');
    setHuman('O');
    setScore({'X': 1, 'O': -1, TIE: 0});
    
  };

  const handleClick = (e) => {
    const { i, j } = getIJ[e];
    if(count===-1 || count===-2 || msg!==checkTurn || board[i][j]!=='') return;
    const newBoard = [...board];
    newBoard[i][j] = human;
    setBoard(newBoard);
    setCount(count + 1);

    handleWinner();
    console.log(count);

    if (count < countmax) {
      aiTurn();
    }
  };

  const handleWinner = () => {
    const winner = checkWin(board);
  
    switch (winner) {
      case ai:
        setMsg("AI Win");
        break;
      case human:
        setMsg("You Beat AI");
        break;
      case 'TIE':
        setMsg("Match Draw");
        break;
      default:
        // No winner yet
    }
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
    
    setTimeout(() => {
      setBoard(newBoard);
      setCount(count + 1);
      handleWinner();
  
      if (count === 9) {
        setMsg("Start New Game");
      }
    }, 2000);

  };

  const aiFirst = () =>{
    setCountmax(5);
    setCount(0);
    aiTurn();
  }
  const xHuman = () =>{
    setCount(-1);
    setHuman('X');
    setAi('O');
    setScore({'X': -1, 'O': 1, TIE: 0});
  }

  let style={
    btn:{
      textAlign:"center",
      margin:"auto",
      background:"#d7aeff",
      color:"#3e2655",
      fontSize:"larger",
      fontWeight:"600"
    }
  }
    

  return (
    <div style={{padding: 5, display: 'flex'}} >
      <div style={{width:'60%'}}>
        <Container  maxWidth="sm">
          <Typography variant="h2" align="center"  gutterBottom> TicTacToe </Typography>
          <Board board={board} handleClick = {handleClick} />
          <Typography style={{color:"rgb(226 209 209)", margin:"10px",textAlign:"center"}} variant="h4" component="h4" > {msg} </Typography>
        </Container>
      </div>      
            
          
      <div style={{ display:'flex', flexDirection:'column' ,width:'30%', margin:'auto'}}>
            <div style={{margin:'auto', padding:'60px'}} >

                {count===-2 && <Typography variant="h5" align="center"  gutterBottom> Choose your weapon: X or O! </Typography>}
                <div style={{display: 'flex'}}>
                  {count===-2 && <Button style={style.btn} variant="contained" onClick={()=>{setCount(-1);}} >O</Button>}
                  {count===-2 &&<Button style={style.btn} variant="contained" onClick={xHuman} >X</Button>}
                </div>

                {count===-1 && <Typography variant="h5" align="center"  gutterBottom> Choose First Move </Typography>}
                <div style={{display: 'flex'}}>
                  {count===-1 && <Button style={style.btn} variant="contained" onClick={()=>{setCount(0);}} >Me</Button>}
                  {count===-1 &&<Button style={style.btn} variant="contained" onClick={aiFirst} >AI</Button>}
                </div>

                
            </div>

          <Button style={style.btn} variant="contained" onClick={startNewGame} >NewGame</Button>
      </div>
        
    </div>
  )
}

export default App;

