import logo from './logo.svg';
import React from 'react';
import './App.css';


// import TronWeb from './tronweb/src/index.js'
const TronWeb = require('tronweb')
// const TronWeb = require('./tronweb/dist/TronWeb.node');
const abiTest = require('./test/mainChain/abi.test');
const base58Test = require('./test/mainChain/base58.test');
const bytesTest = require('./test/mainChain/bytes.test');
const codeTest = require('./test/mainChain/code.test');
const eventTest = require('./test/mainChain/event.test');
const indexTest = require('./test/mainChain/index.test');
const methodTest = require('./test/mainChain/method.test');
const pluginTest = require('./test/mainChain/plugin.test');
const providersTest = require('./test/mainChain/providers.test');
const transactionBuilderTest = require('./test/mainChain/transactionBuilder.test');
const trxTestMain = require('./test/mainChain/trx.test');
const fallbackTest = require('./test/mainChain/fallback.test');
const ztronTest = require('./test/mainChain/ztron.test');
const ztron2Test = require('./test/mainChain/ztron2.test');
const trongridTest = require('./test/mainChain/trongrid.test');
const multiSignTestMain = require('./test/mainChain/multiSign.test.js');
const feelimitTest = require('./test/sideChain/feelimit.test');
const multiSignTestSide = require('./test/sideChain/multiSign.test.js');
const trc10Test = require('./test/sideChain/trc10.test.js');
const trc20Test = require('./test/sideChain/trc20.test.js');
const trc721Test = require('./test/sideChain/trc721.test.js');
const trxTestSide = require('./test/sideChain/trx.test.js');
const tronWebBuilder = require('./test/util/tronWebBuilder');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  test = async () => {
    await multiSignTestSide.multiSignTestAll(); // completed
    // await trxTestSide.trxTestAll(); // completed
    // await trc721Test.trc721TestAll(); // completed
    // await trc20Test.trc20TestAll(); // completed
    // await trc10Test.trc10TestAll(); // completed
    // await multiSignTest.feelimitTestAll(); //
    // await feelimitTest.feelimitTestAll(); // completed
    // await abiTest.abiTestAll(); // completed
    // await base58Test.base58TestAll(); // completed
    // await bytesTest.bytesTestAll(); // completed
    // await codeTest.codeTestAll(); // completed
    // await eventTest.eventTestAll(); // completed
    // await indexTest.indexTestAll(); // completed
    // await methodTest.methodTestAll(); // completed
    // await pluginTest.pluginTestAll(); // completed
    // await providersTest.providersTestAll(); // completed
   // await transactionBuilderTest.transactionBuilderTestAll(); // completed
   //  await trxTestMain.trxTestAll(); // completed
   //  await fallbackTest.fallbackTestAll(); // completed
   //   await trongridTest.trongridTestAll(); // completed
    // await ztronTest.ztronTestAll(); // completed
    // await ztron2Test.ztron2TestAll(); // completed

    console.log("success all")
  }

  async componentDidMount() {
    window.tronWeb1 = tronWebBuilder.createInstance();
    await this.test();
  }

  send = e => {};

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              Learn React
            </a>
          </header>
        </div>
    );
  }
}

export default App;
