import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import D3Tree from '../components/D3Tree';
import InfoWindow from '../components/InfoWindow';
import LogWindow from '../components/LogWindow';
import '../styles/App.css';
import NavBar from '../components/NavBar';
import ChartWindow from '../components/ChartWindow';
import MainDisplay from '../components/MainDisplay';

let curData;
//styles
document.body.style = 'background: #242d3d;';
chrome.devtools.panels.create(
  'debux-test',
  null, // icon
  'devtools.html',
  () => {
    const port = chrome.extension.connect({ name: 'debux-test' });
    port.postMessage({
      name: 'connect',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
    port.onMessage.addListener((msg) => {
      if (!msg.data) return; // abort if data not present, or if not of type object
      if (typeof msg !== 'object') return;
      curData = msg; // assign global data object
    });
  }
);

// Create React App Component
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null, 
      storeHistory: [],
      stateAndProps: []
    };
  }

  makePropsData = (data, arr) => {
    if (data.name === undefined) return;
    const propObjs = {
      Component: data.name,
      State: data.state,
      Props: data.props,
    }
    if (data.isDOM) {
      data.children.forEach(child => {
        this.makePropsData(child, arr);
      });
    } else {
      arr.push(propObjs);
      data.children.forEach(child => {
        this.makePropsData(child, arr);
      });
    }
  }
  
  makeTreeData = (data, arr) => {
    if (data.name === undefined) return;
    const newObj = {
      name: data.name,
      children: [],
      id: data.id,
      isDOM: data.isDOM,
      state: data.state,
      props: data.props,
    };
    arr.push(newObj);
    data.children.forEach((child) => {
      this.makeTreeData(child, newObj.children);
    });

  }

  filterDOM = (data, arr) => {
    if (data.name === undefined) return;
    const newObj = {
      name: data.name,
      children: [],
      id: data.id,
      isDOM: data.isDOM,
      state: data.state,
      props: data.props,
    };

    if (data.isDOM) {
      data.children.forEach((child) => {
        this.filterDOM(child, arr);
      });
    } else {
      arr.push(newObj);
      data.children.forEach((child) => {
        this.filterDOM(child, newObj.children);
      });
    }
  }

  // Using react global hook store prop
  storeDataToTree = (data, arr) => {
    let storeStart = {
      name : 'Store',
      children : []
    };
    let keys = Object.keys(data);
    keys.forEach((prop)=> {
      let child = [];
      this.recStore(data[prop], child);
      let newObj = {
        name: prop,
        children: child
      }
      storeStart.children.push(newObj);
    });
    arr.push(storeStart);
  }

  recStore = (obj, child) => {
    if(!obj) return;
    if(typeof obj === 'object' && !Array.isArray(obj)) {
      for(let key in obj) {
        if(Array.isArray(obj[key])) {
          let newObj = {
            name: '',
            children: []
          };
          obj[key].forEach((el)=>{
            let newObj2 = {
              name: key,
              children: [],
              detail: el,
            }
            if(typeof el === 'object') {
              this.recStore(el, newObj2.children);
            }
            newObj.children.push(newObj2);
          });
          child.push(newObj);
        } else if(typeof obj[key] === 'object') {

        } else {
          let newObj = {
            name: key,
            children: [],
            detail: {},
          };
          newObj.detail[key] = obj[key]; 
          child.push(newObj);
        }
      }
    }
  }

  handleClick = (str) => {
    clearInterval(this.update);
    this.update = setInterval( () => this.updateTree(str), 100);
  }

  dropDownHandleClick = () => {
    console.log("Drop Down Handle Click Was Clicked");
  }

  updateTree = (str) => {
    if(curData) {
      if(curData.data) {
        let updateData = curData.data[0];
        let treeData = [];
        if(str === 'dom') this.makeTreeData(updateData, treeData);
        else if(str === 'component') this.filterDOM(updateData, treeData);
        else this.filterDOM(updateData, treeData);
        if(treeData.length) {
          this.setState({
            data: treeData,
          });
        }
      }
      if(curData.store){
        let storeData = [];
        // if(str === 'store') this.storeDataToTree(curData.store, storeData);
        this.storeDataToTree(curData.store, storeData);
        if(storeData.length) {
          this.setState({
            storeHistory: storeData
          });
        }
      }
    }
  }

  componentDidMount = () => {
    this.update = setInterval( () => this.updateTree(), 100);
  }
  componentWillUnmount() {
    clearInterval(this.update);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.state) !== JSON.stringify(nextState);
  }

  render() {
    return (
      <div className='appWindow'>
        <NavBar/>
        <button className="button" onClick={()=>this.handleClick('dom')}>DOMs</button>
        <span> </span>
        <button className="button" onClick={()=>this.handleClick('component')}>Components</button>
        {/* <span> </span>
        <button className="button" onClick={()=>this.handleClick('store')}>Store</button>
        <span> </span>
        <button className="button" onClick={this.handleClick.bind(this, 'props')}>Show Props</button> */}
        <MainDisplay treeData={this.state.data} dropDownHandleClick={this.dropDownHandleClick} storeData={this.state.storeHistory} dropDownHandleClick={this.dropDownHandleClick} />
        {/* <div className="rowCols">
          <ChartWindow treeType='Components:' treeData={this.state.data} onMouseOver={this.onMouseOver} dropDownHandleClick={this.dropDownHandleClick}/>
          <ChartWindow treeType='Store:' storeData={this.state.storeHistory} onMouseOverStore={this.onMouseOverStore} onMouseOutStore={this.onMouseOutStore} dropDownHandleClick={this.dropDownHandleClick}/>
        </div>
        <div className="rowCols">
          <InfoWindow allStateAndPropsData={this.state.stateAndProps}/>
          <LogWindow/>
        </div> */}
        <br />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
