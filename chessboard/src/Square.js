import React, { Component } from 'react';
import Knight from './Knight';

export default class Square extends Component {

  render(){
    const {black} = this.props;
    const fill = black? 'black':'white';
    const stroke = black? 'white':'black';
     return (<div style={{background:fill, color: stroke, width:'100%', height:'100%'}} onClick={this.props.onClick}>
        {this.props.children}
      </div>);
  }
}