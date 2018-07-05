import React, { Component } from 'react';
import Tree from 'react-d3-tree';
//import Tree from './D3/Tree/index.js';
// import { layout, select, behavior, event } from 'd3';


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
    const svgStyleObj3 = {
      fill: '#ed7bf7',
      fontSize: '40',
    }

    //
    const styles = {
      // links: svgStyleObj,
      nodes: {
        node: {
          circle: svgStyleObj2,
          name: svgStyleObj,
          attributes: svgStyleObj,
        },
        leafNode: {
          circle: svgStyleObj3,
          name: svgStyleObj,
          attributes: svgStyleObj2,
        },
      },
    };
    const { treeData, storeTreeData, onMouseOver, onMouseOverStore, onMouseOutStore } = this.props;

    return (
      <div id="treeWrapper" style={{width:'98%', height:'95%'}}>
        {this.props.treeData && <Tree data={treeData} styles={styles} onMouseOver={onMouseOver}/> }
        {this.props.storeTreeData && <Tree data={storeTreeData} styles={styles} onMouseOverStore={onMouseOverStore} onMouseOutStore={onMouseOutStore}/>}
      </div>
    );
  }
}


export default D3Tree;