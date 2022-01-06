import logo from './logo.svg';
import React from 'react';
import './App.css';


// import TronWeb from './tronweb/src/index.js'
// const TronWeb = require('tronweb')
const TronWeb = require('./tronweb/dist/TronWeb.node');
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
const isConstantCall = require('./test/mainChain/isConstantCall.test.js');
const contractTypes = require('./test/mainChain/contractTypes.test.js');
const tronWebBuilder = require('./test/util/tronWebBuilder');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  test = async () => {
    /** need SIDE_CHAIN environment
     *  Use react default domain name in the browser
     */
    await multiSignTestMain.multiSignTestAll();
    // await multiSignTestSide.multiSignTestAll();
    // await isConstantCall.isConstantCallTestAll();
    // await contractTypes.contractTypesTestAll();
    // await trxTestSide.trxTestAll();
    // await trc721Test.trc721TestAll();
    // await trc20Test.trc20TestAll();
    // await trc10Test.trc10TestAll();
    // await feelimitTest.feelimitTestAll();
    // await abiTest.abiTestAll();
    // await base58Test.base58TestAll();
    // await bytesTest.bytesTestAll();
    // await codeTest.codeTestAll();
    // await methodTest.methodTestAll();
    // await pluginTest.pluginTestAll();
    // await providersTest.providersTestAll();
   // await transactionBuilderTest.transactionBuilderTestAll();
   //  await trxTestMain.trxTestAll();
   //  await fallbackTest.fallbackTestAll();


    /** need nile environment
     *  Use react default domain name in the browser
     */
    // await eventTest.eventTestAll();
    // await indexTest.indexTestAll();

    /** need fullHost: TEST_TRON_GRID_API environment
     *  Use http://trongrid.myservice.com domain name in the browser
     */
    // await trongridTest.trongridTestAll();    运行时会有很多url返回401用例
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
