import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import D3Tree from '../components/D3Tree';
import InfoWindow from '../components/InfoWindow';
import '../styles/App.css';
import NavBar from '../components/NavBar';
import ChartWindow from '../components/ChartWindow';


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



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null, 
      storeHistory: []
    };
  }
  
  makeTreeData = (data, arr) => {
    if (data.name === undefined) return;
    const newObj = {
      name: data.name,
      children: [],
      id: data.id,
      isDOM: data.isDOM,
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

  storeDataToTree = (data, arr) => {
    console.log('storeData in storeDataToTree: ', data);
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
    for(let prop in obj) {
      if(Array.isArray(obj[prop])) {
        obj[prop].forEach((el)=>{
          let newObj = {};
          newObj.name = el.text;
          child.push(newObj);
        })
      }
    }
  }

  handleClick = (str) => {
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
    console.log('Data: ',curData);
    if(curData.data) {
      let updateData = curData.data[0];
      let treeData = [];
      console.log('REDUX-STORE: ', curData.reduxStore); //checking if we are getting the redux store
      let updatedStore = curData.reduxStore;

      console.log('before makeTreeData - Data: ', updateData);
      if(str === 'dom') this.makeTreeData(updateData, treeData);
      if(str === 'component') this.filterDOM(updateData, treeData);

      if(treeData.length) {
        this.setState({
          data: treeData,
          // storeHistory: updatedStore
        });
      }
    }
    if(curData.reduxStore) {
      let updatedStore = curData.reduxStore;
      let temp = updatedStore[updatedStore.length - 1][1];
      let storeData = [];
      if(str === 'store') this.storeDataToTree(temp, storeData);
      console.log('storeDataToTree: ', storeData);
      if(storeData.length) {
        this.setState({
          storeHistory: storeData
        });
      }
    }

  }
  render() {

    let storeVersions = null;
    if (this.state.storeHistory) {
      storeVersions = (
        <ul>
          {this.state.storeHistory.map((store, index) => {
            return <li key={index}>Updated Store: {JSON.stringify(store[1], null, 2)}</li> 
          })}
        </ul>
      );
    }
    return (
      
      <div className='test'>
        {storeVersions}
        <NavBar/>
        <button className="button" onClick={()=>this.handleClick('dom')}>DOMs</button>
        <span> </span>
        <button className="button" onClick={()=>this.handleClick('component')}>Components</button>
        <span> </span>
        <button className="button" onClick={()=>this.handleClick('store')}>Store</button>
        <div className="rowCols">
        <ChartWindow treeType='Components:' treeData={this.state.data}/>
        <ChartWindow treeType='Store:' storeData={this.state.storeHistory}/>
        </div>
        <InfoWindow/>
        <br />
      </div>
    );
  }
}



ReactDOM.render(
  <App />,
  document.getElementById('root')
);

