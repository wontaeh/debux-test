import React, { Component } from 'react';
import Tree from 'react-d3-tree';

class D3Tree extends Component {
  constructor(props) {
    super(props);
    // Tree.defaultProps.orientation = 'vertical'

  }
  
  render() {
    const svgStyleObj = {
      // fontColor: 'white',
      fill: '#90d9ed',
      // stroke: '#53C4C1',
      fontSize: '40',
    };
    const svgStyleObj2 = {
      fill: '#75b766',
      fontSize: '40',
    }
    const styles = {
      // links: svgStyleObj,
      nodes: {
        node: {
          circle: svgStyleObj,
          name: svgStyleObj,
          attributes: svgStyleObj,
        },
        leafNode: {
          circle: svgStyleObj2,
          name: svgStyleObj2,
          attributes: svgStyleObj2,
        },
      },
    };
    console.log('Data: ', this.props.treeData);
    return (
      <div id="treeWrapper" style={{width:'98%', height:'95%'}}>
        {this.props.treeData && <Tree data={this.props.treeData} styles={styles} onMouseOver={this.props.onMouseOver}/> }
      </div>
    );
  }
}


export default D3Tree;