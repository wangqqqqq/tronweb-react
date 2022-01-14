import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY,FULL_NODE_API,SOLIDITY_NODE_API,EVENT_API,SIDE_CHAIN,FEE_LIMIT,SUN_NETWORK} = require('../util/config');
const testDeployRevert = require('../util/contracts').testDeployRevert;
const testTriggerError = require('../util/contracts').testTriggerError;
const trc20Contract = require('../util/contracts').trc20Contract;
const tronWebBuilder = require('../util/tronWebBuilder');
const abiV2Test2t= require('../util/contracts').abiV2Test2;
const TronWeb = tronWebBuilder.TronWeb;
const HttpProvider = TronWeb.providers.HttpProvider;
const BigNumber = require('bignumber.js');
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;
const util = require('util');


async function constructor(){
  const tronWeb = tronWebBuilder.createInstance();
  assert.instanceOf(tronWeb, TronWeb);
  let keys = Object.keys(tronWeb);
  let values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key]));
  }
}

async function rejectCreateAnInstance(){
  let fullNode = new HttpProvider(FULL_NODE_API);
  assert.throws(() => new TronWeb(
      fullNode
  ), 'Invalid solidity node provided');

  fullNode = FULL_NODE_API;
  let eventServer = EVENT_API;
  assert.throws(() => new TronWeb({
    fullNode,
    eventServer
  }), 'Invalid solidity node provided');

  fullNode = FULL_NODE_API;
  eventServer = EVENT_API;
  let privateKey = PRIVATE_KEY;
  assert.throws(() => new TronWeb({
    fullNode,
    eventServer,
    privateKey
  }), 'Invalid solidity node provided');

  let solidityNode = SOLIDITY_NODE_API;
  assert.throws(() => new TronWeb({
    solidityNode
  }), 'Invalid full node provided');

  solidityNode = SOLIDITY_NODE_API;
  eventServer = EVENT_API;
  assert.throws(() => new TronWeb({
    solidityNode,
    eventServer
  }), 'Invalid full node provided');

  solidityNode = SOLIDITY_NODE_API;
  privateKey = PRIVATE_KEY;
  assert.throws(() => new TronWeb({
    solidityNode,
    privateKey
  }), 'Invalid full node provided');

  solidityNode = SOLIDITY_NODE_API;
  eventServer = EVENT_API;
  privateKey = PRIVATE_KEY;
  assert.throws(() => new TronWeb({
    solidityNode,
    eventServer,
    privateKey
  }), 'Invalid full node provided');

  eventServer = EVENT_API;
  assert.throws(() => new TronWeb({
    eventServer
  }), 'Invalid full node provided');

  privateKey = PRIVATE_KEY;
  assert.throws(() => new TronWeb({
    privateKey
  }), 'Invalid full node provided');

  eventServer = EVENT_API;
  privateKey = PRIVATE_KEY;
  assert.throws(() => new TronWeb({
    eventServer,
    privateKey
  }), 'Invalid full node provided');

  solidityNode = new HttpProvider(SOLIDITY_NODE_API);
  assert.throws(() => new TronWeb(
      '$' + FULL_NODE_API,
      solidityNode
  ), 'Invalid URL provided to HttpProvider');

  fullNode = new HttpProvider(FULL_NODE_API);
  assert.throws(() => new TronWeb(
      fullNode,
      '$' + SOLIDITY_NODE_API
  ), 'Invalid URL provided to HttpProvider');

  fullNode = new HttpProvider(FULL_NODE_API);
  solidityNode = new HttpProvider(SOLIDITY_NODE_API);
  assert.throws(() => new TronWeb(
      fullNode,
      solidityNode,
      '$' + EVENT_API
  ), 'Invalid URL provided to HttpProvider');

  fullNode = new HttpProvider(FULL_NODE_API);
  solidityNode = new HttpProvider(SOLIDITY_NODE_API);
  eventServer = SIDE_CHAIN.eventServer;
  assert.throws(() => new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      '$' + PRIVATE_KEY
  ), 'Invalid private key provided');

  fullNode = new HttpProvider(SIDE_CHAIN.fullNode);
  solidityNode = new HttpProvider(SIDE_CHAIN.solidityNode);
  assert.throws(() => new TronWeb(
      fullNode,
      solidityNode,
      false,
      {
        fullNode: '$' + SIDE_CHAIN.sideOptions.fullNode,
        mainGatewayAddress: SIDE_CHAIN.sideOptions.mainGatewayAddress,
        sideGatewayAddress: SIDE_CHAIN.sideOptions.sideGatewayAddress,
        sideChainId: SIDE_CHAIN.sideOptions.sideChainId
      }
  ), 'Invalid URL provided to HttpProvider');

  fullNode = new HttpProvider(SIDE_CHAIN.fullNode);
  solidityNode = new HttpProvider(SIDE_CHAIN.solidityNode);
  eventServer = SIDE_CHAIN.eventServer;
  assert.throws(() => new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      {
        fullNode: SIDE_CHAIN.sideOptions.fullNode,
        solidityNode: '$' + SIDE_CHAIN.sideOptions.solidityNode,
        mainGatewayAddress: SIDE_CHAIN.sideOptions.mainGatewayAddress,
        sideGatewayAddress: SIDE_CHAIN.sideOptions.sideGatewayAddress,
        sideChainId: SIDE_CHAIN.sideOptions.sideChainId
      }
  ), 'Invalid URL provided to HttpProvider');

  fullNode = new HttpProvider(SIDE_CHAIN.fullNode);
  solidityNode = new HttpProvider(SIDE_CHAIN.solidityNode);
  eventServer = SIDE_CHAIN.eventServer;
  assert.throws(() => new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      {
        fullNode: SIDE_CHAIN.sideOptions.fullNode,
        solidityNode: SIDE_CHAIN.sideOptions.solidityNode,
        eventServer: '$' + SIDE_CHAIN.sideOptions.eventServer,
        mainGatewayAddress: SIDE_CHAIN.sideOptions.mainGatewayAddress,
        sideGatewayAddress: SIDE_CHAIN.sideOptions.sideGatewayAddress,
        sideChainId: SIDE_CHAIN.sideOptions.sideChainId
      }
  ), 'Invalid URL provided to HttpProvider');

  fullNode = new HttpProvider(SIDE_CHAIN.fullNode);
  solidityNode = new HttpProvider(SIDE_CHAIN.solidityNode);
  eventServer = SIDE_CHAIN.eventServer;
  assert.throws(() => new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      '$' + PRIVATE_KEY,
      {
        fullNode: SIDE_CHAIN.sideOptions.fullNode,
        solidityNode: SIDE_CHAIN.sideOptions.solidityNode,
        eventServer: '$' + SIDE_CHAIN.sideOptions.eventServer,
        mainGatewayAddress: SIDE_CHAIN.sideOptions.mainGatewayAddress,
        sideGatewayAddress: SIDE_CHAIN.sideOptions.sideGatewayAddress,
        sideChainId: SIDE_CHAIN.sideOptions.sideChainId
      }
  ), 'Invalid private key provided');
}

async function createAnInstance(){
  let fullNode = FULL_NODE_API;
  let solidityNode = SOLIDITY_NODE_API;
  let eventServer = EVENT_API;
  let privateKey = PRIVATE_KEY;
  let tronWeb = new TronWeb({
    fullNode,
    solidityNode,
    eventServer,
    privateKey
  });
  assert.equal(tronWeb.defaultPrivateKey, privateKey);
  let keys = Object.keys(tronWeb);
  let values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key]));
  }

  fullNode = new HttpProvider(FULL_NODE_API);
  solidityNode = new HttpProvider(SOLIDITY_NODE_API);
  eventServer = EVENT_API;
  tronWeb = new TronWeb(
      fullNode,
      solidityNode,
      eventServer
  );
  assert.equal(tronWeb.defaultPrivateKey, false);
  keys = Object.keys(tronWeb);
  values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key]));
  }

  fullNode = FULL_NODE_API;
  solidityNode = SOLIDITY_NODE_API;
  privateKey = PRIVATE_KEY;
  tronWeb = new TronWeb({
    fullNode,
    solidityNode,
    privateKey
  });
  assert.equal(tronWeb.eventServer, false);
  assert.equal(tronWeb.defaultPrivateKey, privateKey);
  keys = Object.keys(tronWeb);
  values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key]));
  }

  fullNode = new HttpProvider(FULL_NODE_API);
  solidityNode = new HttpProvider(SOLIDITY_NODE_API);
  tronWeb = new TronWeb(
      fullNode,
      solidityNode
  );
  assert.equal(tronWeb.eventServer, false);
  keys = Object.keys(tronWeb);
  values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key]));
  }

  fullNode = new HttpProvider(SIDE_CHAIN.fullNode);
  solidityNode = new HttpProvider(SIDE_CHAIN.solidityNode);
  eventServer = SIDE_CHAIN.eventServer;
  tronWeb = new TronWeb({
    fullNode,
    solidityNode,
    eventServer
  }, SIDE_CHAIN.sideOptions);
  assert.equal(tronWeb.defaultPrivateKey, false);
  keys = Object.keys(tronWeb);
  values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key]));
  }

  fullNode = new HttpProvider(SIDE_CHAIN.fullNode);
  solidityNode = new HttpProvider(SIDE_CHAIN.solidityNode);
  eventServer = SIDE_CHAIN.eventServer;
  tronWeb = new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      {
        fullNode: SIDE_CHAIN.sideOptions.fullNode,
        solidityNode: SIDE_CHAIN.sideOptions.solidityNode,
        eventServer: SIDE_CHAIN.sideOptions.eventServer,
        mainGatewayAddress: SIDE_CHAIN.sideOptions.mainGatewayAddress,
        sideGatewayAddress: SIDE_CHAIN.sideOptions.sideGatewayAddress,
        sideChainId: SIDE_CHAIN.sideOptions.sideChainId
      }
  );
  assert.equal(tronWeb.defaultPrivateKey, false);
  keys = Object.keys(tronWeb);
  values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key]));
  }

  fullNode = new HttpProvider(SIDE_CHAIN.fullNode);
  solidityNode = new HttpProvider(SIDE_CHAIN.solidityNode);
  eventServer = SIDE_CHAIN.eventServer;
  tronWeb = new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      {
        fullHost: SIDE_CHAIN.sideOptions.fullNode,
        mainGatewayAddress: SIDE_CHAIN.sideOptions.mainGatewayAddress,
        sideGatewayAddress: SIDE_CHAIN.sideOptions.sideGatewayAddress,
        sideChainId: SIDE_CHAIN.sideOptions.sideChainId
      }
  );
  assert.equal(tronWeb.defaultPrivateKey, false);
  keys = Object.keys(tronWeb);
  values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key]));
  }

  fullNode = new HttpProvider(SIDE_CHAIN.fullNode);
  solidityNode = new HttpProvider(SIDE_CHAIN.solidityNode);
  tronWeb = new TronWeb(
      fullNode,
      solidityNode,
      false,
      {
        fullNode: SIDE_CHAIN.sideOptions.fullNode,
        solidityNode: SIDE_CHAIN.sideOptions.solidityNode,
        eventServer: SIDE_CHAIN.sideOptions.eventServer,
        mainGatewayAddress: SIDE_CHAIN.sideOptions.mainGatewayAddress,
        sideGatewayAddress: SIDE_CHAIN.sideOptions.sideGatewayAddress,
        sideChainId: SIDE_CHAIN.sideOptions.sideChainId
      }
  );
  assert.equal(tronWeb.eventServer, false);
  keys = Object.keys(tronWeb);
  values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key]));
  }

  fullNode = new HttpProvider(SIDE_CHAIN.fullNode);
  solidityNode = new HttpProvider(SIDE_CHAIN.solidityNode);
  tronWeb = new TronWeb(
      fullNode,
      solidityNode,
      false,
      {
        fullNode: SIDE_CHAIN.sideOptions.fullNode,
        solidityNode: SIDE_CHAIN.sideOptions.solidityNode,
        mainGatewayAddress: SIDE_CHAIN.sideOptions.mainGatewayAddress,
        sideGatewayAddress: SIDE_CHAIN.sideOptions.sideGatewayAddress,
        sideChainId: SIDE_CHAIN.sideOptions.sideChainId
      }
  );
  assert.equal(tronWeb.eventServer, false);
  keys = Object.keys(tronWeb);
  values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key]));
  }

}

async function createAnInstance2(){
  const {fullNode, solidityNode, eventServer, sideOptions} = SIDE_CHAIN;
  const privateKey = PRIVATE_KEY;
  const tronWeb = new TronWeb({
    fullNode,
    solidityNode,
    eventServer,
    privateKey
  }, sideOptions);
  assert.equal(tronWeb.defaultPrivateKey, privateKey);
  let keys = Object.keys(tronWeb);
  let values = Object.values(tronWeb);
  for(let key in keys){
    console.log(util.inspect(keys[key])+' : ' + util.inspect(values[key],true,null,true));
  }
}

async function version(){
  const tronWeb = tronWebBuilder.createInstance();

  assert.equal(typeof tronWeb.version, 'string');
  assert.equal(typeof TronWeb.version, 'string');
  assert.equal(typeof tronWeb.fullnodeVersion, 'string');
}

async function setDefaultBlock(){
  let tronWeb = tronWebBuilder.createInstance();
  tronWeb.setDefaultBlock(1);
  assert.equal(tronWeb.defaultBlock, 1);

  tronWeb = tronWebBuilder.createInstance();
  tronWeb.setDefaultBlock(-2);
  assert.equal(tronWeb.defaultBlock, 2);

  tronWeb = tronWebBuilder.createInstance();
  tronWeb.setDefaultBlock(0);
  assert.equal(tronWeb.defaultBlock, 0);

  tronWeb = tronWebBuilder.createInstance();
  tronWeb.setDefaultBlock();
  assert.equal(tronWeb.defaultBlock, false);

  tronWeb = tronWebBuilder.createInstance();
  tronWeb.setDefaultBlock('earliest');
  assert.equal(tronWeb.defaultBlock, 'earliest');

  tronWeb = tronWebBuilder.createInstance();
  tronWeb.setDefaultBlock('latest');
  assert.equal(tronWeb.defaultBlock, 'latest');

  tronWeb = tronWebBuilder.createInstance();
  assert.throws(() => tronWeb.setDefaultBlock(10.2), 'Invalid block ID provided');

  tronWeb = tronWebBuilder.createInstance();
  assert.throws(() => tronWeb.setDefaultBlock('test'), 'Invalid block ID provided');
}

async function setPrivateKey(done){
  let tronWeb = new TronWeb(FULL_NODE_API, SOLIDITY_NODE_API, EVENT_API);
  tronWeb.setPrivateKey(PRIVATE_KEY);
  assert.equal(tronWeb.defaultPrivateKey, PRIVATE_KEY);
  assert.equal(tronWeb.defaultAddress.hex, ADDRESS_HEX);
  assert.equal(tronWeb.defaultAddress.base58, ADDRESS_BASE58);

  tronWeb = new TronWeb(FULL_NODE_API, SOLIDITY_NODE_API, EVENT_API);
  assert.throws(() => tronWeb.setPrivateKey('test'), 'Invalid private key provided');

  // TODO
  /*tronWeb = tronWebBuilder.createInstance();
  tronWeb.on('privateKeyChanged', privateKey => {
    done(
        assert.equal(privateKey, PRIVATE_KEY)
    );
  });
  tronWeb.setPrivateKey(PRIVATE_KEY);*/
}

async function setAddress(){
  let tronWeb = tronWebBuilder.createInstance();
  tronWeb.setAddress(ADDRESS_HEX);
  assert.equal(tronWeb.defaultAddress.hex, ADDRESS_HEX);
  assert.equal(tronWeb.defaultAddress.base58, ADDRESS_BASE58);

  tronWeb = tronWebBuilder.createInstance();
  tronWeb.setAddress(ADDRESS_BASE58);
  assert.equal(tronWeb.defaultAddress.hex, ADDRESS_HEX);
  assert.equal(tronWeb.defaultAddress.base58, ADDRESS_BASE58);

  tronWeb = tronWebBuilder.createInstance();
  assert.equal(tronWeb.defaultPrivateKey, PRIVATE_KEY);
  tronWeb.setAddress(
      ADDRESS_HEX.substr(0, ADDRESS_HEX.length - 1) + '8'
  );
  assert.equal(tronWeb.defaultPrivateKey, false);
  assert.equal(tronWeb.defaultAddress.hex, '415624c12e308b03a1a6b21d9b86e3942fac1ab928');
  assert.equal(tronWeb.defaultAddress.base58, 'THph9K2M2nLvkianrMGswRhz5hjRqD2ova');

  tronWeb = tronWebBuilder.createInstance();
  tronWeb.setAddress(ADDRESS_BASE58);
  assert.equal(tronWeb.defaultPrivateKey, PRIVATE_KEY);

  // TODO
  /*tronWeb = tronWebBuilder.createInstance();
  tronWeb.on('addressChanged', ({hex, base58}) => {
    done(
        assert.equal(hex, ADDRESS_HEX) &&
        assert.equal(base58, ADDRESS_BASE58)
    );
  });
  tronWeb.setAddress(ADDRESS_BASE58);*/
}

async function isValidProvider(){
  let tronWeb = tronWebBuilder.createInstance();
  const provider = new HttpProvider(FULL_NODE_API);
  assert.equal(tronWeb.isValidProvider(provider), true);

  tronWeb = tronWebBuilder.createInstance();
  assert.equal(tronWeb.isValidProvider('test'), false);
}

async function setFullNode(){
  let tronWeb = tronWebBuilder.createInstance();
  let provider = new HttpProvider(FULL_NODE_API);
  tronWeb.setFullNode(provider);
  assert.equal(tronWeb.fullNode, provider);

  tronWeb = tronWebBuilder.createInstance();
  provider = FULL_NODE_API;
  tronWeb.setFullNode(provider);
  assert.equal(tronWeb.fullNode.host, provider);

  assert.throws(() => {
    tronWebBuilder.createInstance().setFullNode(true)
  }, 'Invalid full node provided');

  assert.throws(() => {
    tronWebBuilder.createInstance().setFullNode('example.')
  }, 'Invalid URL provided to HttpProvider');
}

async function setSolidityNode(){
  let tronWeb = tronWebBuilder.createInstance();
  let provider = new HttpProvider(SOLIDITY_NODE_API);
  tronWeb.setSolidityNode(provider);
  assert.equal(tronWeb.solidityNode, provider);

  tronWeb = tronWebBuilder.createInstance();
  provider = SOLIDITY_NODE_API;
  tronWeb.setSolidityNode(provider);
  assert.equal(tronWeb.solidityNode.host, provider);

  assert.throws(() => {
    tronWebBuilder.createInstance().setSolidityNode(true)
  }, 'Invalid solidity node provided');

  assert.throws(() => {
    tronWebBuilder.createInstance().setSolidityNode('_localhost')
  }, 'Invalid URL provided to HttpProvider');
}

async function setEventServer(){
  let tronWeb = tronWebBuilder.createInstance();
  const eventServer = EVENT_API;
  tronWeb.setEventServer(eventServer);
  assert.equal(tronWeb.eventServer.host, eventServer);

  tronWeb = tronWebBuilder.createInstance();
  tronWeb.setEventServer(false);
  assert.equal(tronWeb.eventServer, false);

  tronWeb = tronWebBuilder.createInstance();
  assert.throws(() => {
    tronWeb.setEventServer('test%20')
  }, 'Invalid URL provided to HttpProvider');

  tronWeb = tronWebBuilder.createInstance();
  assert.throws(() => {
    tronWeb.setEventServer({})
  }, 'Invalid event server provided');
}

async function currentProviders(){
  let tronWeb = tronWebBuilder.createInstance();
  const providers = tronWeb.currentProviders();
  const tronWebSide = tronWebBuilder.createInstanceSide();
  const providersSide = tronWebSide.currentProviders();
  assert.equal(providers.fullNode.host, FULL_NODE_API);
  assert.equal(providers.solidityNode.host, SOLIDITY_NODE_API);
  assert.equal(providers.eventServer.host, EVENT_API);
  assert.equal(providersSide.fullNode.host, SIDE_CHAIN.fullNode);
  assert.equal(providersSide.solidityNode.host, SIDE_CHAIN.solidityNode);
  assert.equal(providersSide.eventServer.host, SIDE_CHAIN.eventServer);
}

async function sha3AndToHex(){
  let input = 'casa';
  let expected = '0xc4388c0eaeca8d8b4f48786df8517bc8ca379e8cf9566af774448e46e816657d';
  assert.equal(TronWeb.sha3(input), expected);

  input = true;
  expected = '0x1';
  assert.equal(TronWeb.toHex(input), expected);

  input = false;
  expected = '0x0';
  assert.equal(TronWeb.toHex(input), expected);

  input = BigNumber('123456.7e-3');
  expected = '0x7b.74ea4a8c154c985f06f7';
  assert.equal(TronWeb.toHex(input), expected);

  input = new BigNumber(89273674656);
  expected = '0x14c9202ba0';
  assert.equal(TronWeb.toHex(input), expected);

  input = BigNumber('23e89');
  expected = '0x1210c23ede2d38fed455e938516db71cfaf3ec4a1c8f3fa92f98a60000000000000000000000';
  assert.equal(TronWeb.toHex(input), expected);

  input = {address: 'TTRjVyHu1Lv3DjBPTgzCwsjCvsQaHKQcmN'};
  expected = '0x7b2261646472657373223a225454526a56794875314c7633446a425054677a4377736a4376735161484b51636d4e227d';
  assert.equal(TronWeb.toHex(input), expected);

  input = [1, 2, 3];
  expected = '0x5b312c322c335d';
  assert.equal(TronWeb.toHex(input), expected);

  input = 'salamon';
  expected = '0x73616c616d6f6e';
  assert.equal(TronWeb.toHex(input), expected);

  input = '';
  expected = '0x';
  assert.equal(TronWeb.toHex(input), expected);

  input = ' ';
  expected = '0x20';
  assert.equal(TronWeb.toHex(input), expected);

  input = '0x73616c616d6f6e';
  expected = '0x73616c616d6f6e';
  assert.equal(TronWeb.toHex(input), expected);

  input = 24354;
  expected = '0x5f22';
  assert.equal(TronWeb.toHex(input), expected);

  input = -423e-2;
  expected = '-0x4.3ae147ae147ae147ae14';
  assert.equal(TronWeb.toHex(input), expected);

  assert.throws(() => {
    TronWeb.toHex(TronWeb)
  }, 'The passed value is not convertible to a hex string');
}

async function utf8(){
  let input = '0x73616c616d6f6e';
  let expected = 'salamon';
  assert.equal(TronWeb.toUtf8(input), expected);

  input = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
  expected = '机械及行业设备';
  assert.equal(TronWeb.toUtf8(input), expected);

  input = 'salamon';
  assert.throws(() => {
    TronWeb.toUtf8(input, true)
  }, 'The passed value is not a valid hex string');

  input = 'salamon';
  expected = '0x73616c616d6f6e';
  assert.equal(TronWeb.fromUtf8(input), expected);
  input = '机械及行业设备';
  expected = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
  assert.equal(TronWeb.fromUtf8(input), expected);

  assert.throws(() => {
    TronWeb.fromUtf8([])
  }, 'The passed value is not a valid utf-8 string');
}

async function ascii(){
  let input = '0x73616c616d6f6e';
  let expected = 'salamon';
  assert.equal(TronWeb.toAscii(input), expected);
  input = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
  expected = 'æºæ¢°åè¡ä¸è®¾å¤';
  // 'f\u001c:f"0e\u000f\nh!\fd8\u001ah.>e$\u0007';
  assert.equal(TronWeb.toAscii(input), expected);

  input = 'salamon';
  assert.throws(() => {
    TronWeb.toAscii(input)
  }, 'The passed value is not a valid hex string');

  input = 'salamon';
  expected = '0x73616c616d6f6e';
  assert.equal(TronWeb.fromAscii(input), expected);

  input = 'æºæ¢°åè¡ä¸è®¾å¤';
  expected = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
  assert.equal(TronWeb.fromAscii(input), expected);

  assert.throws(() => {
    TronWeb.fromAscii([])
  }, 'The passed value is not a valid utf-8 string');
}

async function toBigNumber(){
  let input = '0x73616c61';
  let expected = 1935764577;
  assert.equal(TronWeb.toBigNumber(input).toNumber(), expected);

  input = 1935764577;
  expected = 1935764577;
  assert.equal(TronWeb.toBigNumber(input).c[0], expected);

  input = '89384775883766237763193576457709388576373';
  expected = [8938477588376, 62377631935764, 57709388576373];
  assert.equal(TronWeb.toBigNumber(input).c[0], expected[0]);
  assert.equal(TronWeb.toBigNumber(input).c[1], expected[1]);
  assert.equal(TronWeb.toBigNumber(input).c[2], expected[2]);
}

async function decimal(){
  let input = '0x73616c61';
  let expected = 1935764577;
  assert.equal(TronWeb.toDecimal(input), expected);

  input = 1935764577;
  expected = 1935764577;
  assert.equal(TronWeb.toDecimal(input), expected);

  input = '89384775883766237763193576457709388576373';
  expected = 8.938477588376623e+40;
  assert.equal(TronWeb.toDecimal(input), expected);

  input = 1935764577;
  expected = '0x73616c61';
  assert.equal(TronWeb.fromDecimal(input), expected);

  input = -1935764577;
  expected = '-0x73616c61';
  assert.equal(TronWeb.fromDecimal(input), expected);
}

async function sun(){
  let input = 324;
  let expected = 324e6;
  assert.equal(TronWeb.toSun(input), expected);

  input = 3245e6;
  expected = 3245;
  assert.equal(TronWeb.fromSun(input), expected);
}

async function isAddress(){
  let input = 'TYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUG';
  assert.equal(TronWeb.isAddress(input), true);

  input = 'TYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUs';
  assert.equal(TronWeb.isAddress(input), false);

  input = 'TYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUG89';
  assert.equal(TronWeb.isAddress(input), false);

  input = 'aYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUG';
  assert.equal(TronWeb.isAddress(input), false);

  input = '4165cfbd57fa4f20687b2c33f84c4f9017e5895d49';
  assert.equal(TronWeb.isAddress(input), true);

  input = '0x65cfbd57fa4f20687b2c33f84c4f9017e5895d49';
  assert.equal(TronWeb.isAddress(input), false);

  input = '4165cfbd57fa4f20687b2c33f84c4f9017e589';
  assert.equal(TronWeb.isAddress(input), false);

  input = '4165cfbd57fa4f20687b2c33f84c4f9017e5895d4998';
  assert.equal(TronWeb.isAddress(input), false);
}

async function isConnected(){
  setTimeout(10000)

  const tronWeb = tronWebBuilder.createInstance();
  const isConnected = await tronWeb.isConnected();
  console.log("isConnected:"+util.inspect(isConnected,true,null,true))
  assert.isTrue(isConnected.fullNode);
  assert.isTrue(isConnected.solidityNode);
  if (!SUN_NETWORK) {  // As https://testhttpapi.tronex.io/healthcheck is 404
    assert.isTrue(isConnected.eventServer);
  }
}

async function utils(){
  const tronWeb = tronWebBuilder.createInstance();
  assert.isTrue(tronWeb.utils.isValidURL('https://some.example.com:9090/casa?qe=3'))
  assert.isTrue(tronWeb.utils.isValidURL('www.example.com/welcome'))
  assert.isTrue(tronWeb.utils.isValidURL('http:/some.example.com'))
  assert.isFalse(tronWeb.utils.isValidURL(['http://example.com']))

  assert.isTrue(tronWeb.utils.isArray([]));
  assert.isTrue(tronWeb.utils.isArray([[2], {a: 3}]));
  assert.isFalse(tronWeb.utils.isArray({}));
  assert.isFalse(tronWeb.utils.isArray("Array"));

  assert.isTrue(tronWeb.utils.isJson('[]'));
  assert.isTrue(tronWeb.utils.isJson('{"key":"value"}'));
  assert.isTrue(tronWeb.utils.isJson('"json"'));
  assert.isFalse(tronWeb.utils.isJson({}));
  assert.isFalse(tronWeb.utils.isJson("json"));

  assert.isTrue(tronWeb.utils.isBoolean(true));
  assert.isTrue(tronWeb.utils.isBoolean('a' == []));
  assert.isFalse(tronWeb.utils.isBoolean({}));
  assert.isFalse(tronWeb.utils.isBoolean("json"));

  const bigNumber = BigNumber('1234565432123456778765434456777')
  assert.isTrue(tronWeb.utils.isBigNumber(bigNumber));
  assert.isFalse(tronWeb.utils.isBigNumber('0x09e80f665949b63b39f3850127eb29b55267306b69e2104c41c882e076524a1c'));
  assert.isFalse(tronWeb.utils.isBigNumber({}));
  assert.isFalse(tronWeb.utils.isBigNumber("json"));

  assert.isTrue(tronWeb.utils.isString('str'));
  assert.isTrue(tronWeb.utils.isString(13..toString()));
  assert.isFalse(tronWeb.utils.isString(2));

  assert.isTrue(tronWeb.utils.isFunction(new Function()));
  assert.isTrue(tronWeb.utils.isFunction(() => {
  }));
  assert.isTrue(tronWeb.utils.isFunction(tronWeb.utils.isFunction));
  assert.isFalse(tronWeb.utils.isFunction({function: new Function}));

  let input = '0x1';
  let expected = true;
  assert.equal(tronWeb.utils.isHex(input), expected);

  input = '0x0';
  expected = true;
  assert.equal(tronWeb.utils.isHex(input), expected);

  input = '0x73616c616d6f6e';
  expected = true;
  assert.equal(tronWeb.utils.isHex(input), expected);

  input = '73616c616d6f';
  expected = true;
  assert.equal(tronWeb.utils.isHex(input), expected);

  input = '0x73616c616d6fsz';
  expected = false;
  assert.equal(tronWeb.utils.isHex(input), expected);

  input = 'x898989';
  expected = false;
  assert.equal(tronWeb.utils.isHex(input), expected);

  assert.equal(tronWeb.toHex(''),"0x");
  assert.equal(tronWeb.toHex('  '),"0x2020");
  assert.equal(tronWeb.toHex('we '),"0x776520");
  assert.equal(tronWeb.toHex('we we'),"0x7765207765");
  assert.equal(tronWeb.toHex('we we    we'),"0x7765207765202020207765");
  assert.equal(tronWeb.toHex(true),"0x1");
  assert.equal(tronWeb.toHex(1234),"0x4d2");
  assert.equal(tronWeb.toHex(" 1234 "),"0x4d2");
  assert.equal(tronWeb.toHex("12x"),"0x313278");
  assert.equal(tronWeb.toHex("x34"),"0x783334");
  assert.equal(tronWeb.toHex("12 34"),"0x3132203334");
  assert.equal(tronWeb.toHex(),"0x0");

  assert.isTrue(tronWeb.utils.isInteger(2345434));
  assert.isTrue(tronWeb.utils.isInteger(-234e4));
  assert.isFalse(tronWeb.utils.isInteger(3.4));
  assert.isFalse(tronWeb.utils.isInteger('integer'));

  assert.isTrue(tronWeb.utils.hasProperty({p: 2}, 'p'));
  assert.isFalse(tronWeb.utils.hasProperty([{p: 2}], 'p'));
  assert.isFalse(tronWeb.utils.hasProperty({a: 2}, 'p'));

  assert.isTrue(tronWeb.utils.hasProperties({p: 2, s: 2}, 'p', 's'));
  assert.isFalse(tronWeb.utils.hasProperties({p: 2, s: 2}, 'p', 'q'));

  const event = {
    block_number: 'blockNumber',
    block_timestamp: 'blockTimestamp',
    contract_address: 'contractAddress',
    event_name: 'eventName',
    transaction_id: 'transactionId',
    result: 'result',
    resource_Node: 'resourceNode'
  }
  expected = {
    block: 'blockNumber',
    timestamp: 'blockTimestamp',
    contract: 'contractAddress',
    name: 'eventName',
    transaction: 'transactionId',
    result: 'result',
    resourceNode: 'resourceNode'
  }
  const mapped = tronWeb.utils.mapEvent(event)
  for(let key in mapped) {
    assert.equal(mapped[key], expected[key])
  }

  assert.equal(tronWeb.utils.padLeft('09e80f', '0', 12), '00000009e80f');
  assert.equal(tronWeb.utils.padLeft(3.4e3, '0', 12), '000000003400');

  const string = '0x' + Buffer.from('some string').toString('hex');
  const hash = tronWeb.utils.ethersUtils.sha256(string);
  assert.equal(hash, '0x61d034473102d7dac305902770471fd50f4c5b26f6831a56dd90b5184b3c30fc');
}

async function fromPrivateKey(){
  const tronWeb = tronWebBuilder.createInstance();
  assert.equal(tronWeb.address.fromPrivateKey("12"),tronWeb.address.fromPrivateKey("123"));
  assert.equal(tronWeb.address.fromPrivateKey("12"),tronWeb.address.fromPrivateKey("124"));
  assert.equal(tronWeb.address.fromPrivateKey("12"),tronWeb.address.fromPrivateKey("0012"));
  assert.equal(tronWeb.address.fromPrivateKey("12"),'TM1XDVgwZUqPfQT1PTA7DszUE7Nw7DU7d1');
  assert.equal(tronWeb.address.fromPrivateKey("012"),'TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC');
  assert.equal(tronWeb.address.fromPrivateKey("0"),false);
  assert.equal(tronWeb.address.fromPrivateKey("0x124"),false);
  assert.equal(tronWeb.address.fromPrivateKey("0dbdfa83d48bc9dfa823479234ccf9db2b34c9f89724ad8979243e987e9de243"),'TPiNqcyhxY2xVMfMRUQ3d5qyaq8EdFuQkh');
  assert.equal(ADDRESS_BASE58,tronWeb.address.fromPrivateKey(PRIVATE_KEY));
  assert.equal(tronWeb.address.fromPrivateKey(PRIVATE_KEY+"1"),tronWeb.address.fromPrivateKey(PRIVATE_KEY));
  assert.equal(tronWeb.address.fromPrivateKey(PRIVATE_KEY+"10"),'TEMfXbLCs7Ag2fjAFrWkNJP8tPrDSV9Rrz');
  assert.equal(tronWeb.address.fromPrivateKey("0"+PRIVATE_KEY+"1"),'TEipNR4EDbNJpsAa4DnHSFGHakXd38XhFp');

  console.log("----Turn on strict mode----")
  assert.equal('TGUrzpAScgJy9tyrrPJ6woywvf2eBSw5yv',tronWeb.address.fromPrivateKey("123",true));
  assert.equal(tronWeb.address.fromPrivateKey("0123",true),tronWeb.address.fromPrivateKey("123",true));
  assert.equal('TM1XDVgwZUqPfQT1PTA7DszUE7Nw7DU7d1',tronWeb.address.fromPrivateKey("12",true));
  assert.equal(tronWeb.address.fromPrivateKey("012",true),tronWeb.address.fromPrivateKey("12",true));
  assert.equal(tronWeb.address.fromPrivateKey("012",true),tronWeb.address.fromPrivateKey("0000012",true));
  assert.equal('THzAGBe4vTuVjnobg2TCb3uUL34Y7yU945',tronWeb.address.fromPrivateKey("124",true));
  assert.equal(tronWeb.address.fromPrivateKey("0124",true),tronWeb.address.fromPrivateKey("124",true));
  assert.equal(ADDRESS_BASE58,tronWeb.address.fromPrivateKey(PRIVATE_KEY,true));
  assert.equal(tronWeb.address.fromPrivateKey(PRIVATE_KEY+"1",true),tronWeb.address.fromPrivateKey("0"+PRIVATE_KEY+"1",true));
  assert.equal(tronWeb.address.fromPrivateKey(PRIVATE_KEY+"10",true),'TEMfXbLCs7Ag2fjAFrWkNJP8tPrDSV9Rrz');
  assert.equal(tronWeb.address.fromPrivateKey("0"+PRIVATE_KEY+"1",true),'TEipNR4EDbNJpsAa4DnHSFGHakXd38XhFp');
  assert.equal(tronWeb.address.fromPrivateKey("0",true),false);
  assert.equal(tronWeb.address.fromPrivateKey("0x124",true),false);
  assert.equal(tronWeb.address.fromPrivateKey("0dbdfa83d48bc9dfa823479234ccf9db2b34c9f89724ad8979243e987e9de243",true),'TPiNqcyhxY2xVMfMRUQ3d5qyaq8EdFuQkh');
}

async function abiV2Test2(){
  const tronWeb = tronWebBuilder.createInstance();

  // nile SaiValuesAggregator
  const contractInstance2 = await tronWeb.contract(abiV2Test2t.abi,"41E38397ADACF9C723C06CE1F5E2E1E84CA487D07D");
  const res = await contractInstance2.aggregateCDPValues('0x000000000000000000000000000000000000000000000000000000000000016a').call();
  contractInstance2.aggregateCDPValues('0x000000000000000000000000000000000000000000000000000000000000016a').call((err, data)=>{
    console.log("data:"+data)
    assert.equal(data.toString(),res.toString())
  });
  console.log("res:"+res)
  assert.equal(res[1],'4104001be68322c0c3640c6a1384c891697b53c231')
  assert.equal(res[2],false)
  const array = res[3]
  assert.equal(parseInt(array[0],10),9999999999000000000000)
  assert.equal(parseInt(array[1],10),800000000000000000000)
  assert.equal(parseInt(array[2],10),788074048671296707459)
  assert.isTrue(parseInt(array[3],10) > 0)
  assert.equal(parseInt(array[4],10),0)
  assert.equal(parseInt(array[5],10),0)
  assert.equal(parseInt(array[6],10),0)
  assert.isTrue(parseInt(array[7],10) > 0)
}

async function indexTestAll(){
  console.log("indexTestAll start")
  await constructor();
  await rejectCreateAnInstance();
  await createAnInstance();
  await createAnInstance2();
  await version();
  await setDefaultBlock();
  await setPrivateKey();
  await setAddress();
  await isValidProvider();
  await setFullNode();
  await setSolidityNode();
  await setEventServer();
  await currentProviders();
  await sha3AndToHex();
  await utf8();
  await ascii();
  await toBigNumber();
  await decimal();
  await sun();
  await isAddress();
  await isConnected();
  await utils();
  await fromPrivateKey();
  await abiV2Test2();
  console.log("indexTestAll end")
}

export{
  indexTestAll
}
