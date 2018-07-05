/*  ************************************************************************
 * Created by Wontae Han, Alejandro Romero, Shafayat Alam and Jeff Schrock.
 * Copyright © 2018 De-Bux. All rights reserved.
 **************************************************************************/
import React, { Component } from 'react';
import Tree from 'react-d3-tree';

class D3Tree extends Component {
  constructor(props) {
    super(props);
    // Tree.defaultProps.orientation = 'vertical'
  }
  
  render() {
    const svgStyleObj = {
      fill: '#90d9ed',
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

    const styles = {
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
    console.log('props treeData: ', treeData);
    return (
      <div id="treeWrapper" style={{width:'98%', height:'95%'}}>
        {this.props.treeData && <Tree data={treeData} styles={styles} onMouseOver={onMouseOver}/> }
        {this.props.storeTreeData && <Tree data={storeTreeData} styles={styles} onMouseOver={onMouseOverStore}/>}
      </div>
    );
  }
}


export default D3Tree;