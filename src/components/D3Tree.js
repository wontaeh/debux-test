/*  ************************************************************************
 * Created by Wontae Han, Alejandro Romero, Shafayat Alam and Jeff Schrock.
 * Copyright © 2018 De-Bux. All rights reserved.
 **************************************************************************/
import React, { Component } from 'react';
import Tree from 'react-d3-tree';

class D3Tree extends Component {
  constructor(props) {
    super(props);
    Tree.defaultProps.orientation = 'vertical'
    this.state = {};
  }
  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: dimensions.height / 10
      }
    });
  }
  
  render() {
    const styles = {
      nodes: {
        node: {
          circle: {
            fill: '#75b766',
            fontSize: '20',
          },
          name: {
            fill: '#90d9ed',
            fontSize: '20',
          },
          attributes: {
            fill: '#90d9ed',
            fontSize: '20',
          },
        },
        leafNode: {
          circle: {
            fill: '#ed7bf7',
            fontSize: '20',
          },
          name: {
            fill: '#90d9ed',
            fontSize: '20',
          },
          attributes: {
            fill: '#75b766',
            fontSize: '20',
          },
        },
      },
    };
    const { treeData, storeTreeData, onMouseOver, onMouseOverStore, onMouseOutStore } = this.props;
    return (
      <div class="treeWrapper" style={{width:'100%', height:'399px'}} ref={tc => (this.treeContainer = tc)}>
        {this.props.treeData && 
          <Tree 
            data={treeData} 
            styles={styles} 
            onMouseOver={onMouseOver}
            translate={this.state.translate}
            nodeSize={{
              x:150,
              y:150
            }}
            scaleExtent={{
              min: 0.1, 
              max: 1
            }}
            zoom={0.5}
          />}
        {this.props.storeTreeData && 
          <Tree 
            data={storeTreeData} 
            styles={styles} 
            onMouseOver={onMouseOverStore}
            translate={this.state.translate}
            nodeSize={{
              x:150,
              y:150
            }}
            scaleExtent={{
              min: 0.1, 
              max: 1
            }}
            zoom={0.5}
          />}
      </div>
    );
  }
}

export default D3Tree;