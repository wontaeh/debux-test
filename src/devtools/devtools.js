import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import App from '../components/App';
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
      storeHistory: [],
      props: null,
    };
  }

    //////
    makePropsData = (data, arr) => {
      console.log('data in props func: ', data);
      if (data.name === undefined) return;
      const propObjs = {
        name: data.name,
        attributes: {
          props: data.props,
          state: data.state
        }
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
      console.log('final array: ', arr);
    }
    /////
  
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
          console.log(el);
          let newObj = {};
          for(let prop in el) {
            if(typeof el[prop] === 'string') newObj.name = el[prop];
          }
          // newObj.name = JSON.stringify(el);
          child.push(newObj);
        })
      }
    }
  }

  // Using react global hook store porp
  // storeDataToTree = (data, arr) => {
  //   console.log('storeData in storeDataToTree: ', data);
  //   let storeStart = {
  //     name : 'Store',
  //     children : []
  //   };
  //   let keys = Object.keys(data);
  //   keys.forEach((prop)=> {
  //     let child = [];
  //     this.recStore(data[prop], child);
  //     let newObj = {
  //       name: prop,
  //       children: child
  //     }
  //     storeStart.children.push(newObj);
  //   });
  //   arr.push(storeStart);
  // }

  // recStore = (obj, child) => {
  //   if(!obj || !obj.children) return;
  //   let newObj = {
  //     name: '',
  //     children: [],
  //     attributes: {}
  //   };
  //   for(let prop in obj){
  //     if(!Array.isArray(obj[prop])) {
  //       newObj.attributes[prop] = JSON.stringify(obj[prop]);
  //     } 
  //   }
  //   child.push(newObj);
  //   for(let prop in obj){
  //     if(Array.isArray(obj[prop])) {
  //       obj[prop].forEach((obj2)=>{
  //         this.recStore(obj2, newObj.children)
  //       });
  //     }
  //   }

  // }

  ////////////////

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
    if(curData.data) {
      let updateData = curData.data[0];
      let treeData = [];
      console.log('REDUX-STORE: ', curData.reduxStore); //checking if we are getting the redux store
      let updatedStore = curData.reduxStore;

      console.log('before makeTreeData - Data: ', updateData);
      if(str === 'dom') this.makeTreeData(updateData, treeData);
      if(str === 'component') this.filterDOM(updateData, treeData);
      //
      let propsData = [];
      if(str === 'props') this.makePropsData(updateData, propsData);
      //
      if(treeData.length) {
        this.setState({
          data: treeData,
          // storeHistory: updatedStore
        });
      }
      if(propsData.length) {
        this.setState({
          props: propsData
        });
      }
    }
    // if(curData.reduxStore) {
    //   let updatedStore = curData.reduxStore;
    //   let temp = updatedStore[updatedStore.length - 1][1];
    //   let storeData = [];
    //   if(str === 'store') this.storeDataToTree(temp, storeData);
    //   console.log('storeDataToTree: ', storeData);
    //   if(storeData.length) {
    //     this.setState({
    //       storeHistory: storeData
    //     });
    //   }
    // }

    if(curData.store){
      let storeData = [];
      let temp = curData.store;
      console.log('curData.store: ', curData.store);
      if(str === 'store') this.storeDataToTree(curData.store, storeData);
      console.log('after function storeData: ', storeData);
      if(storeData.length) {
        this.setState({
          storeHistory: storeData
        });
      }
    }
  }

  onMouseOver = (nodeId, evt) => {
    console.log("nodeId: ", nodeId, " evt: ", evt);
  }

  render() {

    return (
      
      <div className='test'>
        <NavBar/>
        <button className="button" onClick={()=>this.handleClick('dom')}>DOMs</button>
        <span> </span>
        <button className="button" onClick={()=>this.handleClick('component')}>Components</button>
        <span> </span>
        <button className="button" onClick={()=>this.handleClick('store')}>Store</button>
        <span> </span>
        <button className="button" onClick={this.handleClick.bind(this, 'props')}>Show Props</button>
        <div className="rowCols">
        <ChartWindow treeType='Components:' treeData={this.state.data} onMouseOver={this.onMouseOver}/>
        <ChartWindow treeType='Store:' storeData={this.state.storeHistory} onMouseOver={this.onMouseOver}/>
        </div>
        <InfoWindow propsData={this.state.props}/>
        <br />
      </div>
    );
  }
}



ReactDOM.render(
  <App />,
  document.getElementById('root')
);

