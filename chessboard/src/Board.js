import React, { Component } from 'react';
import Square from './Square';
import Knight from './Knight';

export default class Board extends React.Component {
  static propTypes = {
    // knightPositions: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired,
    dispatch: React.PropTypes.func,
    store: React.PropTypes.object
  };
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.renderSquare = this.renderSquare.bind(this);

  }

  handleClick (x,y){
    const {dispatch} = this.props;
    dispatch({type:"MOVE",payload:[x,y]});
      this.forceUpdate();
  }
  renderSquare(i){
    //render according to the passed in positions
    //render knight if the position matches with the knightPositions
    const x = i % 8;
    const y = Math.floor(i / 8);
    const black = (x+y)%2 === 1;
    const {store} = this.props;
    const [knightX, knightY] = store.getState();
    const piece = ((knightX===x) && (knightY===y)) ?  <Knight/>: null;
    return(
      <Square black={black}  onClick={()=>this.handleClick(x,y)} store={store} >
          {piece}
      </Square>
    );
  }


  render(){
    const squares = [];
    for (let i=0; i<64; i++){
      squares.push(this.renderSquare(i));
    }
    return(
      <div style={{width:'100%', height:'100%', display: 'flex',flexWrap: 'wrap'}}>
        {squares.map((square, i)=>(<div key={i} style={{ width: '12.5%', height: '12.5%'}}>{square}</div>))}
      </div>
    );
  }
}