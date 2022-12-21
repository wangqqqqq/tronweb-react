import React from 'react';
const {PRIVATE_KEY} = require('../util/config');
const tronWebBuilder = require('../util/tronWebBuilder');
const tronWeb = tronWebBuilder.createInstance();
const wait = require('../util/wait');
const assert = require('assert');
const util = require('util');

/**
 * Need to execute java-tron2.HttpTestSmartContract001.test2DeployContract() to get transaction
 */
async function signVisibleWithCreateSmartContract(){
  var priKey = "0011f3c751ae6f03910c1d85aad94fba4e365a70e0f46b8367491fcfa92a9bf1";
  let transaction1 ={"visible":false,"txID":"0b774012c0fb871da12ce445defc180d59497308857648e93bb810335af0ef3a","contract_address":"41b57b7c674b673a6a8dcc25ac14a5dd7d60f1261f","raw_data":{"contract":[{"parameter":{"value":{"token_id":1000657,"owner_address":"4168d11638cb5b664033bf253a28247672b3bb9170","call_token_value":100000,"new_contract":{"bytecode":"6080604052d3600055d2600155346002556101418061001f6000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305c24200811461005b5780633be9ece71461008157806371dc08ce146100aa575b600080fd5b6100636100b2565b60408051938452602084019290925282820152519081900360600190f35b6100a873ffffffffffffffffffffffffffffffffffffffff600435166024356044356100c0565b005b61006361010d565b600054600154600254909192565b60405173ffffffffffffffffffffffffffffffffffffffff84169082156108fc029083908590600081818185878a8ad0945050505050158015610107573d6000803e3d6000fd5b50505050565bd3d2349091925600a165627a7a72305820a2fb39541e90eda9a2f5f9e7905ef98e66e60dd4b38e00b05de418da3154e7570029","consume_user_resource_percent":100,"name":"transferTokenContract","origin_address":"4168d11638cb5b664033bf253a28247672b3bb9170","abi":{"entrys":[{"outputs":[{"type":"trcToken"},{"type":"uint256"},{"type":"uint256"}],"payable":true,"name":"getResultInCon","stateMutability":"Payable","type":"Function"},{"payable":true,"inputs":[{"name":"toAddress","type":"address"},{"name":"id","type":"trcToken"},{"name":"amount","type":"uint256"}],"name":"TransferTokenTo","stateMutability":"Payable","type":"Function"},{"outputs":[{"type":"trcToken"},{"type":"uint256"},{"type":"uint256"}],"payable":true,"name":"msgTokenValueAndTokenIdTest","stateMutability":"Payable","type":"Function"},{"payable":true,"stateMutability":"Payable","type":"Constructor"}]},"origin_energy_limit":11111111111111,"call_value":5000}},"type_url":"type.googleapis.com/protocol.CreateSmartContract"},"type":"CreateSmartContract"}],"ref_block_bytes":"dca5","ref_block_hash":"18c400b6524fb6c9","expiration":1671538413000,"fee_limit":1000000000,"timestamp":1671538354727},"raw_data_hex":"0a02dca5220818c400b6524fb6c940c89bd0fbd2305ad805081e12d3050a30747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e437265617465536d617274436f6e7472616374129e050a154168d11638cb5b664033bf253a28247672b3bb917012fc040a154168d11638cb5b664033bf253a28247672b3bb91701adb010a381a0e676574526573756c74496e436f6e2a0a1a08747263546f6b656e2a091a0775696e743235362a091a0775696e743235363002380140040a501a0f5472616e73666572546f6b656e546f22141209746f416464726573731a0761646472657373220e120269641a08747263546f6b656e22111206616d6f756e741a0775696e743235363002380140040a451a1b6d7367546f6b656e56616c7565416e64546f6b656e4964546573742a0a1a08747263546f6b656e2a091a0775696e743235362a091a0775696e743235363002380140040a0630013801400422e0026080604052d3600055d2600155346002556101418061001f6000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305c24200811461005b5780633be9ece71461008157806371dc08ce146100aa575b600080fd5b6100636100b2565b60408051938452602084019290925282820152519081900360600190f35b6100a873ffffffffffffffffffffffffffffffffffffffff600435166024356044356100c0565b005b61006361010d565b600054600154600254909192565b60405173ffffffffffffffffffffffffffffffffffffffff84169082156108fc029083908590600081818185878a8ad0945050505050158015610107573d6000803e3d6000fd5b50505050565bd3d2349091925600a165627a7a72305820a2fb39541e90eda9a2f5f9e7905ef98e66e60dd4b38e00b05de418da3154e757002928882730643a157472616e73666572546f6b656e436f6e747261637440c7e3d28eb0c30218a08d0620d1893d70a7d4ccfbd23090018094ebdc03"}
  ;
  let transaction2 ={"visible":true,"txID":"7bf025acc86faf5797a6fa575e7a42b3420a48032808b2fc7fff7ca6e0c768d6","contract_address":"410bd7854629c6b4cc9098dd42dff70c998ad5d165","raw_data":{"contract":[{"parameter":{"value":{"token_id":1000657,"owner_address":"TKXRkcdnLmMQnd8LrX61oQwHRSEt9wMt3s","call_token_value":100000,"new_contract":{"bytecode":"6080604052d3600055d2600155346002556101418061001f6000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305c24200811461005b5780633be9ece71461008157806371dc08ce146100aa575b600080fd5b6100636100b2565b60408051938452602084019290925282820152519081900360600190f35b6100a873ffffffffffffffffffffffffffffffffffffffff600435166024356044356100c0565b005b61006361010d565b600054600154600254909192565b60405173ffffffffffffffffffffffffffffffffffffffff84169082156108fc029083908590600081818185878a8ad0945050505050158015610107573d6000803e3d6000fd5b50505050565bd3d2349091925600a165627a7a72305820a2fb39541e90eda9a2f5f9e7905ef98e66e60dd4b38e00b05de418da3154e7570029","consume_user_resource_percent":100,"name":"transferTokenContract","origin_address":"TKXRkcdnLmMQnd8LrX61oQwHRSEt9wMt3s","abi":{"entrys":[{"outputs":[{"type":"trcToken"},{"type":"uint256"},{"type":"uint256"}],"payable":true,"name":"getResultInCon","stateMutability":"Payable","type":"Function"},{"payable":true,"inputs":[{"name":"toAddress","type":"address"},{"name":"id","type":"trcToken"},{"name":"amount","type":"uint256"}],"name":"TransferTokenTo","stateMutability":"Payable","type":"Function"},{"outputs":[{"type":"trcToken"},{"type":"uint256"},{"type":"uint256"}],"payable":true,"name":"msgTokenValueAndTokenIdTest","stateMutability":"Payable","type":"Function"},{"payable":true,"stateMutability":"Payable","type":"Constructor"}]},"origin_energy_limit":11111111111111,"call_value":5000}},"type_url":"type.googleapis.com/protocol.CreateSmartContract"},"type":"CreateSmartContract"}],"ref_block_bytes":"dca5","ref_block_hash":"18c400b6524fb6c9","expiration":1671538413000,"fee_limit":1000000000,"timestamp":1671538354798},"raw_data_hex":"0a02dca5220818c400b6524fb6c940c89bd0fbd2305ad805081e12d3050a30747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e437265617465536d617274436f6e7472616374129e050a154168d11638cb5b664033bf253a28247672b3bb917012fc040a154168d11638cb5b664033bf253a28247672b3bb91701adb010a381a0e676574526573756c74496e436f6e2a0a1a08747263546f6b656e2a091a0775696e743235362a091a0775696e743235363002380140040a501a0f5472616e73666572546f6b656e546f22141209746f416464726573731a0761646472657373220e120269641a08747263546f6b656e22111206616d6f756e741a0775696e743235363002380140040a451a1b6d7367546f6b656e56616c7565416e64546f6b656e4964546573742a0a1a08747263546f6b656e2a091a0775696e743235362a091a0775696e743235363002380140040a0630013801400422e0026080604052d3600055d2600155346002556101418061001f6000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305c24200811461005b5780633be9ece71461008157806371dc08ce146100aa575b600080fd5b6100636100b2565b60408051938452602084019290925282820152519081900360600190f35b6100a873ffffffffffffffffffffffffffffffffffffffff600435166024356044356100c0565b005b61006361010d565b600054600154600254909192565b60405173ffffffffffffffffffffffffffffffffffffffff84169082156108fc029083908590600081818185878a8ad0945050505050158015610107573d6000803e3d6000fd5b50505050565bd3d2349091925600a165627a7a72305820a2fb39541e90eda9a2f5f9e7905ef98e66e60dd4b38e00b05de418da3154e757002928882730643a157472616e73666572546f6b656e436f6e747261637440c7e3d28eb0c30218a08d0620d1893d70eed4ccfbd23090018094ebdc03"}
  ;

  // broadcast transaction
  let signedTransaction = await tronWeb.trx.sign(
      transaction1, priKey, false,false,false);
  console.log("signedTransaction1: "+util.inspect(signedTransaction,true,null,true))

  let result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(3);
  console.log("result1: "+util.inspect(result,true,null,true))

  signedTransaction = await tronWeb.trx.sign(
      transaction2, priKey, false,false,false);
  console.log("signedTransaction2: "+util.inspect(signedTransaction,true,null,true))

  result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(3);
  console.log("result2: "+util.inspect(result,true,null,true))
}

/**
 * Need to execute java-tron2.HttpTestSmartContract001.test1DeployContract()&test3TriggerContract() to get transaction
 */
async function signVisibleWithTriggerSmartContract(){
  var priKey = "e32a58550610c6a30a77d2dbc45a2d537f71e20dc0e6faf45750443e04af28a8";
  let transaction1 ={"result":{"result":true},"transaction":{"visible":true,"txID":"8132d3191dfb7e2b223181cbe76e1fc8a2803be37683027e29792945c053d1b7","raw_data":{"contract":[{"parameter":{"value":{"data":"3be9ece7000000000000000000000000cb50400eb5144a17cfd4c2752717a392edb3a77400000000000000000000000000000000000000000000000000000000000f44cf0000000000000000000000000000000000000000000000000000000000000001","token_id":1000655,"owner_address":"TC6XM5865pPYriRYezRQsEaHjch9QquH6T","call_token_value":20,"contract_address":"TMdSVQ1jDE6zRX1W7HTiUWkWh5PS1azZvx","call_value":10},"type_url":"type.googleapis.com/protocol.TriggerSmartContract"},"type":"TriggerSmartContract"}],"ref_block_bytes":"dc68","ref_block_hash":"f1a156e5c6be91cb","expiration":1671538218000,"fee_limit":1000000000,"timestamp":1671538160499},"raw_data_hex":"0a02dc682208f1a156e5c6be91cb4090a8c4fbd2305ad701081f12d2010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e7472616374129c010a154117527a1b217013a3c173d4bbf7c0499fd9f9a8701215417fe4732b834011db9519fa8128ab0a983b936b95180a22643be9ece7000000000000000000000000cb50400eb5144a17cfd4c2752717a392edb3a77400000000000000000000000000000000000000000000000000000000000f44cf0000000000000000000000000000000000000000000000000000000000000001281430cf893d70f3e6c0fbd23090018094ebdc03"}}
  ;
  let transaction2 ={"result":{"result":true},"transaction":{"visible":false,"txID":"cac73fc7fe0af8feeb972a582113a3bac2f1b3d82db2af49bcbc5724a632aad4","raw_data":{"contract":[{"parameter":{"value":{"data":"3be9ece7000000000000000000000000cb50400eb5144a17cfd4c2752717a392edb3a77400000000000000000000000000000000000000000000000000000000000f44cf0000000000000000000000000000000000000000000000000000000000000001","token_id":1000655,"owner_address":"4117527a1b217013a3c173d4bbf7c0499fd9f9a870","call_token_value":20,"contract_address":"417fe4732b834011db9519fa8128ab0a983b936b95","call_value":10},"type_url":"type.googleapis.com/protocol.TriggerSmartContract"},"type":"TriggerSmartContract"}],"ref_block_bytes":"dc68","ref_block_hash":"f1a156e5c6be91cb","expiration":1671538218000,"fee_limit":1000000000,"timestamp":1671538160553},"raw_data_hex":"0a02dc682208f1a156e5c6be91cb4090a8c4fbd2305ad701081f12d2010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e7472616374129c010a154117527a1b217013a3c173d4bbf7c0499fd9f9a8701215417fe4732b834011db9519fa8128ab0a983b936b95180a22643be9ece7000000000000000000000000cb50400eb5144a17cfd4c2752717a392edb3a77400000000000000000000000000000000000000000000000000000000000f44cf0000000000000000000000000000000000000000000000000000000000000001281430cf893d70a9e7c0fbd23090018094ebdc03"}}
  ;

  // broadcast transaction
  let signedTransaction = await tronWeb.trx.sign(
      transaction1.transaction, priKey, false,false,false);
  console.log("signedTransaction1: "+util.inspect(signedTransaction,true,null,true))

  let result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(3);
  console.log("result1: "+util.inspect(result,true,null,true))

  signedTransaction = await tronWeb.trx.sign(
      transaction2.transaction, priKey, false,false,false);
  console.log("signedTransaction2: "+util.inspect(signedTransaction,true,null,true))

  result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(3);
  console.log("result2: "+util.inspect(result,true,null,true))
}

/**
 * Need to execute java-tron2.HttpTestSendCoin001.test1SendCoin() to get transaction
 */
async function signVisibleWithSendcoin(){
  var transaction1 ={"visible":true,"txID":"56053e52cc5e1bab239370b1200f4ce0f11104ae654d472be2dbac4982473aa4","raw_data":{"contract":[{"parameter":{"value":{"amount":1000,"owner_address":"THph9K2M2nLvkianrMGswRhz5hjSA9fuH7","to_address":"TH259qVrYb3TEpY236A411DWkuwnTUC9yo"},"type_url":"type.googleapis.com/protocol.TransferContract"},"type":"TransferContract"}],"ref_block_bytes":"dc40","ref_block_hash":"30704b44b8a38ea9","expiration":1671538092000,"timestamp":1671538033920},"raw_data_hex":"0a02dc40220830704b44b8a38ea940e0cfbcfbd2305a66080112620a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412310a15415624c12e308b03a1a6b21d9b86e3942fac1ab92b1215414d53939ef34a2be5150a21bdff4a39312416f30218e80770808ab9fbd230"}
  ;
  var transaction2 ={"visible":false,"txID":"82cadefc637121722a8b63a0796d6f3818c7f443756914236dbf2660e5963687","raw_data":{"contract":[{"parameter":{"value":{"amount":1000,"owner_address":"415624c12e308b03a1a6b21d9b86e3942fac1ab92b","to_address":"414d53939ef34a2be5150a21bdff4a39312416f302"},"type_url":"type.googleapis.com/protocol.TransferContract"},"type":"TransferContract"}],"ref_block_bytes":"dc40","ref_block_hash":"30704b44b8a38ea9","expiration":1671538092000,"timestamp":1671538034015},"raw_data_hex":"0a02dc40220830704b44b8a38ea940e0cfbcfbd2305a66080112620a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412310a15415624c12e308b03a1a6b21d9b86e3942fac1ab92b1215414d53939ef34a2be5150a21bdff4a39312416f30218e80770df8ab9fbd230"}
  ;

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