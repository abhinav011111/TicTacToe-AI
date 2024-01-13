import React from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

  const style={
      paper:{
           height:"150px",
        //    margin:"auto",
           
          textAlign:"center",
          background: "rgb(183, 159, 209)",
          color: "#2a325f",
          lineHeight: "1.5"
      }
  }
function Board(props) {
    // let Board = ['','','','','','','','',''];
    let board = [...props.board[0],...props.board[1],...props.board[2]].map((e,index)=>(
        <Grid  item xs={4} sm={4} key={index}>
            <div onClick={()=>props.handleClick(index)} >
                <Typography variant="h1" style={style.paper}  >
                    {e}
                </Typography>
            </div>
        </Grid>

    ));
    return (
        <div>
            <Grid container spacing={1}>
                {board}
            </Grid>
        </div>
    )
}
;
export default Board;
