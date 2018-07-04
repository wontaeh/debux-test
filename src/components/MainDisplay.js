import React, { Component } from 'react';
import ChartWindow from './ChartWindow';
import InfoWindow from './InfoWindow';
import LogWindow from './LogWindow';

class MainDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateAndProps: []
    };
  }

  onMouseOver = (nodeId, evt) => {
    const propObjs = {
      Component: nodeId.name,
      State: nodeId.state,
      Props: nodeId.props,
    }
    this.setState({
      stateAndProps: [propObjs]
    });
  }

  onMouseOverStore = (nodeId, evt) => {
    const propObjs = {};
    const detailInfo = nodeId.detail;
    if(detailInfo) {
      for(let key in detailInfo) {
        propObjs[key] = detailInfo[key];
      }
    } else {
      propObjs.name = nodeId.name;
    }
    this.setState({
      stateAndProps: [propObjs]
    });
  }

  render() {
    return (
      <div>
        <div className="rowCols">
          <ChartWindow treeType='Components:' treeData={this.props.treeData} onMouseOver={this.onMouseOver} dropDownHandleClick={this.props.dropDownHandleClick}/>
          <ChartWindow treeType='Store:' storeData={this.props.storeData} onMouseOverStore={this.onMouseOverStore} dropDownHandleClick={this.props.dropDownHandleClick}/>
        </div>
        <div className="rowCols">
          <InfoWindow allStateAndPropsData={this.state.stateAndProps}/>
          <LogWindow/>
        </div>
      </div>
    );
  }
}

export default MainDisplay;