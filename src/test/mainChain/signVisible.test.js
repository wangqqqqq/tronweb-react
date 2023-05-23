import React from 'react';
const {
    ADDRESS_HEX,
    ADDRESS_BASE58,
    UPDATED_TEST_TOKEN_OPTIONS,
    WITNESS_ACCOUNT,
    WITNESS_KEY,
    PRIVATE_KEY,
    getTokenOptions,
    isProposalApproved,
    TOKEN_ID,
    FEE_LIMIT
} = require('../util/config');
const tronWebBuilder = require('../util/tronWebBuilder');
const tronWeb = tronWebBuilder.createInstance();
const wait = require('../util/wait');
const assert = require('assert');
const util = require('util');
const {testRevert, testConstant, arrayParam, tronToken, testAddressArray, trcTokenTest070, trcTokenTest059, funcABIV2, funcABIV2_2, funcABIV2_3, funcABIV2_4, abiV2Test1, testSetVal, testEmptyAbi} = require('../util/contracts');

let contract1;
let contract2;

/**
 * Need to execute java-tron2.HttpTestSmartContract001.test2DeployContract() to get transaction
 */
async function signVisibleWithCreateSmartContract(){
  /*var priKey = "0011f3c751ae6f03910c1d85aad94fba4e365a70e0f46b8367491fcfa92a9bf1";
  let transaction1 ={"visible":false,"txID":"0b774012c0fb871da12ce445defc180d59497308857648e93bb810335af0ef3a","contract_address":"41b57b7c674b673a6a8dcc25ac14a5dd7d60f1261f","raw_data":{"contract":[{"parameter":{"value":{"token_id":1000657,"owner_address":"4168d11638cb5b664033bf253a28247672b3bb9170","call_token_value":100000,"new_contract":{"bytecode":"6080604052d3600055d2600155346002556101418061001f6000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305c24200811461005b5780633be9ece71461008157806371dc08ce146100aa575b600080fd5b6100636100b2565b60408051938452602084019290925282820152519081900360600190f35b6100a873ffffffffffffffffffffffffffffffffffffffff600435166024356044356100c0565b005b61006361010d565b600054600154600254909192565b60405173ffffffffffffffffffffffffffffffffffffffff84169082156108fc029083908590600081818185878a8ad0945050505050158015610107573d6000803e3d6000fd5b50505050565bd3d2349091925600a165627a7a72305820a2fb39541e90eda9a2f5f9e7905ef98e66e60dd4b38e00b05de418da3154e7570029","consume_user_resource_percent":100,"name":"transferTokenContract","origin_address":"4168d11638cb5b664033bf253a28247672b3bb9170","abi":{"entrys":[{"outputs":[{"type":"trcToken"},{"type":"uint256"},{"type":"uint256"}],"payable":true,"name":"getResultInCon","stateMutability":"Payable","type":"Function"},{"payable":true,"inputs":[{"name":"toAddress","type":"address"},{"name":"id","type":"trcToken"},{"name":"amount","type":"uint256"}],"name":"TransferTokenTo","stateMutability":"Payable","type":"Function"},{"outputs":[{"type":"trcToken"},{"type":"uint256"},{"type":"uint256"}],"payable":true,"name":"msgTokenValueAndTokenIdTest","stateMutability":"Payable","type":"Function"},{"payable":true,"stateMutability":"Payable","type":"Constructor"}]},"origin_energy_limit":11111111111111,"call_value":5000}},"type_url":"type.googleapis.com/protocol.CreateSmartContract"},"type":"CreateSmartContract"}],"ref_block_bytes":"dca5","ref_block_hash":"18c400b6524fb6c9","expiration":1671538413000,"fee_limit":1000000000,"timestamp":1671538354727},"raw_data_hex":"0a02dca5220818c400b6524fb6c940c89bd0fbd2305ad805081e12d3050a30747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e437265617465536d617274436f6e7472616374129e050a154168d11638cb5b664033bf253a28247672b3bb917012fc040a154168d11638cb5b664033bf253a28247672b3bb91701adb010a381a0e676574526573756c74496e436f6e2a0a1a08747263546f6b656e2a091a0775696e743235362a091a0775696e743235363002380140040a501a0f5472616e73666572546f6b656e546f22141209746f416464726573731a0761646472657373220e120269641a08747263546f6b656e22111206616d6f756e741a0775696e743235363002380140040a451a1b6d7367546f6b656e56616c7565416e64546f6b656e4964546573742a0a1a08747263546f6b656e2a091a0775696e743235362a091a0775696e743235363002380140040a0630013801400422e0026080604052d3600055d2600155346002556101418061001f6000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305c24200811461005b5780633be9ece71461008157806371dc08ce146100aa575b600080fd5b6100636100b2565b60408051938452602084019290925282820152519081900360600190f35b6100a873ffffffffffffffffffffffffffffffffffffffff600435166024356044356100c0565b005b61006361010d565b600054600154600254909192565b60405173ffffffffffffffffffffffffffffffffffffffff84169082156108fc029083908590600081818185878a8ad0945050505050158015610107573d6000803e3d6000fd5b50505050565bd3d2349091925600a165627a7a72305820a2fb39541e90eda9a2f5f9e7905ef98e66e60dd4b38e00b05de418da3154e757002928882730643a157472616e73666572546f6b656e436f6e747261637440c7e3d28eb0c30218a08d0620d1893d70a7d4ccfbd23090018094ebdc03"}
  ;
  let transaction2 ={"visible":true,"txID":"7bf025acc86faf5797a6fa575e7a42b3420a48032808b2fc7fff7ca6e0c768d6","contract_address":"410bd7854629c6b4cc9098dd42dff70c998ad5d165","raw_data":{"contract":[{"parameter":{"value":{"token_id":1000657,"owner_address":"TKXRkcdnLmMQnd8LrX61oQwHRSEt9wMt3s","call_token_value":100000,"new_contract":{"bytecode":"6080604052d3600055d2600155346002556101418061001f6000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305c24200811461005b5780633be9ece71461008157806371dc08ce146100aa575b600080fd5b6100636100b2565b60408051938452602084019290925282820152519081900360600190f35b6100a873ffffffffffffffffffffffffffffffffffffffff600435166024356044356100c0565b005b61006361010d565b600054600154600254909192565b60405173ffffffffffffffffffffffffffffffffffffffff84169082156108fc029083908590600081818185878a8ad0945050505050158015610107573d6000803e3d6000fd5b50505050565bd3d2349091925600a165627a7a72305820a2fb39541e90eda9a2f5f9e7905ef98e66e60dd4b38e00b05de418da3154e7570029","consume_user_resource_percent":100,"name":"transferTokenContract","origin_address":"TKXRkcdnLmMQnd8LrX61oQwHRSEt9wMt3s","abi":{"entrys":[{"outputs":[{"type":"trcToken"},{"type":"uint256"},{"type":"uint256"}],"payable":true,"name":"getResultInCon","stateMutability":"Payable","type":"Function"},{"payable":true,"inputs":[{"name":"toAddress","type":"address"},{"name":"id","type":"trcToken"},{"name":"amount","type":"uint256"}],"name":"TransferTokenTo","stateMutability":"Payable","type":"Function"},{"outputs":[{"type":"trcToken"},{"type":"uint256"},{"type":"uint256"}],"payable":true,"name":"msgTokenValueAndTokenIdTest","stateMutability":"Payable","type":"Function"},{"payable":true,"stateMutability":"Payable","type":"Constructor"}]},"origin_energy_limit":11111111111111,"call_value":5000}},"type_url":"type.googleapis.com/protocol.CreateSmartContract"},"type":"CreateSmartContract"}],"ref_block_bytes":"dca5","ref_block_hash":"18c400b6524fb6c9","expiration":1671538413000,"fee_limit":1000000000,"timestamp":1671538354798},"raw_data_hex":"0a02dca5220818c400b6524fb6c940c89bd0fbd2305ad805081e12d3050a30747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e437265617465536d617274436f6e7472616374129e050a154168d11638cb5b664033bf253a28247672b3bb917012fc040a154168d11638cb5b664033bf253a28247672b3bb91701adb010a381a0e676574526573756c74496e436f6e2a0a1a08747263546f6b656e2a091a0775696e743235362a091a0775696e743235363002380140040a501a0f5472616e73666572546f6b656e546f22141209746f416464726573731a0761646472657373220e120269641a08747263546f6b656e22111206616d6f756e741a0775696e743235363002380140040a451a1b6d7367546f6b656e56616c7565416e64546f6b656e4964546573742a0a1a08747263546f6b656e2a091a0775696e743235362a091a0775696e743235363002380140040a0630013801400422e0026080604052d3600055d2600155346002556101418061001f6000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305c24200811461005b5780633be9ece71461008157806371dc08ce146100aa575b600080fd5b6100636100b2565b60408051938452602084019290925282820152519081900360600190f35b6100a873ffffffffffffffffffffffffffffffffffffffff600435166024356044356100c0565b005b61006361010d565b600054600154600254909192565b60405173ffffffffffffffffffffffffffffffffffffffff84169082156108fc029083908590600081818185878a8ad0945050505050158015610107573d6000803e3d6000fd5b50505050565bd3d2349091925600a165627a7a72305820a2fb39541e90eda9a2f5f9e7905ef98e66e60dd4b38e00b05de418da3154e757002928882730643a157472616e73666572546f6b656e436f6e747261637440c7e3d28eb0c30218a08d0620d1893d70eed4ccfbd23090018094ebdc03"}
  ;*/
  const newAccount = await tronWeb.createAccount();
  const constructorFuncABI = trcTokenTest070.abi[0]
  let params = tronWeb.utils.abi.encodeParamsV2ByABI(constructorFuncABI, [newAccount.address.hex, TOKEN_ID, 123]);
  params = params.slice(2)
  console.log("params: ",params);
  let data = {
       owner_address: ADDRESS_BASE58,
       abi: trcTokenTest070.abi,
       bytecode: trcTokenTest070.bytecode,
       name: "TestAddressArray",
       parameter: params,
       call_value: 321,
       token_id:TOKEN_ID,
       call_token_value:1e3,
       fee_limit: FEE_LIMIT,
       origin_energy_limit: 10e6,
       consume_user_resource_percent: 100,
       visible: true
  };
  const transaction1 = await tronWeb.fullNode.request('wallet/deploycontract', data, 'post');
  console.log('TronGrid ', JSON.stringify(transaction1, null, 2));

  data = {
         owner_address: ADDRESS_HEX,
         abi: trcTokenTest070.abi,
         bytecode: trcTokenTest070.bytecode,
         name: "TestAddressArray",
         parameter: params,
         call_value: 321,
         token_id:TOKEN_ID,
         call_token_value:1e3,
         fee_limit: FEE_LIMIT,
         origin_energy_limit: 10e6,
         consume_user_resource_percent: 100,
         visible: false
    };
    const transaction2 = await tronWeb.fullNode.request('wallet/deploycontract', data, 'post');
    console.log('TronGrid ', JSON.stringify(transaction2, null, 2));

  // broadcast transaction
  let signedTransaction = await tronWeb.trx.sign(
      transaction1, PRIVATE_KEY, false,false,false);
  console.log("signedTransaction1: "+util.inspect(signedTransaction,true,null,true))

  let result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(3);
  console.log("result1: "+util.inspect(result,true,null,true))
  contract1 = result.transaction.contract_address;

  signedTransaction = await tronWeb.trx.sign(
      transaction2, PRIVATE_KEY, false,false,false);
  console.log("signedTransaction2: "+util.inspect(signedTransaction,true,null,true))

  result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(3);
  contract2 = result.transaction.contract_address;
  console.log("result2: "+util.inspect(result,true,null,true))
  console.log("signVisibleWithCreateSmartContract end")
}

/**
 * Need to execute java-tron2.HttpTestSmartContract001.test1DeployContract()&test3TriggerContract() to get transaction
 */
async function signVisibleWithTriggerSmartContract(){
  console.log("contract1: ", contract1);
  let contract1_b58 = tronWeb.address.fromHex(contract1);
  console.log("contract2: ", contract2);
  const newAccount = await tronWeb.createAccount();
  const transferToFuncABI = trcTokenTest070.abi[1]
  let params = tronWeb.utils.abi.encodeParamsV2ByABI(transferToFuncABI, [newAccount.address.hex, TOKEN_ID, 123]);
  params = params.slice(2)

  let data = {
      owner_address: ADDRESS_BASE58,
      contract_address: contract1_b58,
      function_selector: 'TransferTokenTo(address,trcToken,uint256)',
      parameter:params,
      fee_limit: FEE_LIMIT,
      call_value: 321,
      call_token_value: 1000,
      token_id: 1000001,
      visible:true
  }
  const transaction1 = await tronWeb.fullNode.request('wallet/triggersmartcontract', data, 'post');
  console.log('TronGrid transaction1: ', JSON.stringify(transaction1, null, 2));

  data = {
    owner_address: ADDRESS_HEX,
    contract_address: contract2,
    function_selector: 'TransferTokenTo(address,trcToken,uint256)',
    parameter:params,
    fee_limit: FEE_LIMIT,
    call_value: 321,
    call_token_value: 1000,
    token_id: 1000001,
    visible:false
  }
  const transaction2 = await tronWeb.fullNode.request('wallet/triggersmartcontract', data, 'post');
  console.log('TronGrid transaction2', JSON.stringify(transaction2, null, 2));

  // broadcast transaction
  let signedTransaction = await tronWeb.trx.sign(
      transaction1.transaction, PRIVATE_KEY, false,false,false);
  console.log("signedTransaction1: "+util.inspect(signedTransaction,true,null,true))

  let result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(3);
  console.log("result1: "+util.inspect(result,true,null,true))

  signedTransaction = await tronWeb.trx.sign(
      transaction2.transaction, PRIVATE_KEY, false,false,false);
  console.log("signedTransaction2: "+util.inspect(signedTransaction,true,null,true))

  result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(3);
  console.log("result2: "+util.inspect(result,true,null,true))
  console.log("signVisibleWithTriggerSmartContract end")
}

/**
 * Need to execute java-tron2.HttpTestSendCoin001.test1SendCoin() to get transaction
 */
async function signVisibleWithSendcoin(){
  const newAccount = await tronWeb.createAccount();
  let data = {
      owner_address: ADDRESS_BASE58,
      to_address: newAccount.address.base58,
      amount: 10,
      visible: true,
  };
  const transaction1 = await tronWeb.fullNode.request('wallet/createtransaction', data, 'post');

  data = {
    owner_address: ADDRESS_HEX,
    to_address: newAccount.address.hex,
    amount: 20,
    visible: false,
  };
  const transaction2 = await tronWeb.fullNode.request('wallet/createtransaction', data, 'post');

  // broadcast transaction
  let signedTransaction = await tronWeb.trx.sign(
      transaction1, PRIVATE_KEY, false,false,false);
  console.log("signedTransaction1: "+util.inspect(signedTransaction,true,null,true))

  let result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(3);
  console.log("result1: "+util.inspect(result,true,null,true))

  signedTransaction = await tronWeb.trx.sign(
      transaction2, PRIVATE_KEY, false,false,false);
  console.log("signedTransaction2: "+util.inspect(signedTransaction,true,null,true))

  result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(3);
  console.log("result2: "+util.inspect(result,true,null,true))
  console.log("signVisibleWithSendcoin end")

}

async function signVisibleTestAll(){
  console.log("signVisibleTestAll start")
  await signVisibleWithCreateSmartContract();
  await signVisibleWithTriggerSmartContract();
  await signVisibleWithSendcoin();
  console.log("signVisibleTestAll end")
}

export{
  signVisibleTestAll
}