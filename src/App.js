import logo from './logo.svg';
import React from 'react';
import './App.css';

import {abiTestAll} from './test/mainChain/abi.test.js';
import {accountsTestAll} from './test/mainChain/accounts.test';
import {bytesTestAll} from './test/mainChain/bytes.test';
import {codeTestAll} from './test/mainChain/code.test';
import {eventTestAll} from './test/mainChain/event.test';
import {indexTestAll} from './test/mainChain/index.test';
import {methodTestAll} from './test/mainChain/method.test';
import {pluginTestAll} from './test/mainChain/plugin.test';
import {providersTestAll} from './test/mainChain/providers.test';
import {transactionBuilderTestAll} from './test/mainChain/transactionBuilder.test.js';
import {trxTestAll} from './test/mainChain/trx.test';
import {fallbackTestAll} from './test/mainChain/fallback.test';
import trongridTest from './test/mainChain/trongrid.test';
import {multiSignTestAll} from './test/mainChain/multiSign.test.js';
import {isConstantCallTestAll} from './test/mainChain/isConstantCall.test.js';
import {contractTypesTestAll} from './test/mainChain/contractTypes.test.js';
import {typedDataAll} from './test/mainChain/typedData.test.js';
import {eip712TestAll} from './test/mainChain/eip712Test.test.js';
import {transactionTestAll} from './test/mainChain/transaction.test.js';
import {signVisibleTestAll} from './test/mainChain/signVisible.test.js';
import tronWebBuilder from './test/util/tronWebBuilder.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  test = async () => {
    /** need SIDE_CHAIN environment
     *  Use react default domain name in the browser
     */
    // await abiTestAll();//Yes 6.0.0 done
    // await accountsTestAll(); //Yes 6.0.0 done 需要学习
    // await bytesTestAll();//Yes 6.0.0 done
    // await codeTestAll();//Yes   6.0.0:传错参数类型期待报错，但是没有报错
    // await contractTypesTestAll();//Yes  6.0.0 done
    // await eip712TestAll();//Yes  6.0.0 done
    // await fallbackTestAll();//Yes  6.0.0 done
    // await isConstantCallTestAll(); //Yes 6.0.0 done
    // await methodTestAll();//Yes 6.0.0 done
    // await multiSignTestAll();//Yes  6.0.0 done
    // await pluginTestAll();//yes  pulgin 6.0.0 done 还需要研究学习
    // await providersTestAll();//Yes 6.0.0 done
    // await transactionBuilderTestAll(); //6.0.0 done
    // await trxTestAll();  //6.0.0 left await broadcastHex()
    // await typedDataAll();//Yes  6.0.0 done
    // await transactionTestAll();  //6.0.0 done
    // await signVisibleTestAll();//Yes 6.0.0 done

    //sideChain cases
    /* await feelimitTest.feelimitTestAll();//yes
       await multiSignTestSide.multiSignTestAll();//yes
       await trc721Test.trc721TestAll();// yes
       await trc20Test.trc20TestAll();//
       await trc10Test.trc10TestAll();//
       await trxTestSide.trxTestAll(); */

    /** need nile environment
     *  Use react default domain name in the browser
     */
    // await eventTestAll();//yes
    // await indexTestAll();//yes

    /** need fullHost: TEST_TRON_GRID_API environment
     *  The environment is not available, this use case ignores
     *  Use http://trongrid.myservice.com domain name in the browser
     */
    // await trongridTest.trongridTestAll();   // 运行时会有很多url返回401用例
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
