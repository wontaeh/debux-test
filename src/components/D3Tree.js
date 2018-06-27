import React, { Component } from 'react';
import Tree from 'react-d3-tree';
// import { layout, select, behavior, event } from 'd3';


class D3Tree extends Component {
  constructor(props) {
    super(props);
    Tree.defaultProps.orientation = 'vertical'
    // this.createD3Tree = this.createD3Tree.bind(this);
  }

  //   componentDidMount() {
  //     this.createD3Tree()
  //  }
  //   componentDidUpdate() {
  //     this.createD3Tree()
  //  }
  //   createD3Tree(treeData) {
  //   }
    

  
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
  
    console.log('Data: ', this.props.treeData);
    return (
      <div id="treeWrapper" style={{width:'98%', height:'95%'}}>
        {this.props.treeData && <Tree data={this.props.treeData} styles={styles}/> }
      </div>
    );
  }
}


export default D3Tree;