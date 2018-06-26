import React, { Component } from 'react';
import Tree from 'react-d3-tree';

class D3Tree extends Component {
  constructor(props) {
    super(props);
    Tree.defaultProps.orientation = 'vertical'

  }
  
  render() {
    console.log('Data: ', this.props.treeData);
    return (
      <div id="treeWrapper" style={{width: '98%', height: '95%'}}>
        {this.props.treeData && <Tree data={this.props.treeData} /> }
      </div>
    );
  }
}


export default D3Tree;