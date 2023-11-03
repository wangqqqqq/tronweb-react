import React from 'react';
const {FULL_NODE_API, PRIVATE_KEY, ADDRESS_HEX, ADDRESS_BASE58} = require('../util/config');
const testRevertContract = require('../util/contracts').testRevert;
const testSetValContract = require('../util/contracts').testSetVal;
const testEmptyAbi = require('../util/contracts').testEmptyAbi;
const tronWebBuilder = require('../util/tronWebBuilder');
const assertThrow = require('../util/assertThrow');
const broadcaster = require('../util/broadcaster');
const wait = require('../util/wait');
const TronWeb = tronWebBuilder.TronWeb;
const util = require('util');
const chai = require('chai');
const assert = chai.assert;
let tronWeb = tronWebBuilder.createInstance();

async function constructor() {
  let provider = new tronWebBuilder.providers.HttpProvider(FULL_NODE_API);
  assert.instanceOf(provider, tronWebBuilder.providers.HttpProvider);
  provider = new tronWebBuilder.providers.HttpProvider
  ('www.exaple.com');
  assert.instanceOf(provider, tronWebBuilder.providers.HttpProvider);

  assert.throws(() => new tronWebBuilder.providers.HttpProvider(
      '$' + FULL_NODE_API
  ), 'Invalid URL provided to HttpProvider');

  assert.throws(() => new tronWebBuilder.providers.HttpProvider(
      '_localhost'
  ), 'Invalid URL provided to HttpProvider');

  assert.throws(() => new tronWebBuilder.providers.HttpProvider(
      [FULL_NODE_API]
  ), 'Invalid URL provided to HttpProvider');
}

async function setStatusPage() {
  const provider = new tronWebBuilder.providers.HttpProvider(FULL_NODE_API);
  const statusPage = '/status';
  provider.setStatusPage(statusPage);
  assert.equal(provider.statusPage, statusPage);
}

async function isConnected() {
  let provider = new tronWebBuilder.providers.HttpProvider(FULL_NODE_API);
  assert.isTrue(await provider.isConnected('/wallet/getnowblock'));
  // below test will blocked by CORS policy(跨域访问).
  /*provider = new tronWebBuilder.providers.HttpProvider('https://google.com');
  assert.isFalse(await provider.isConnected('/wallet/getnowblock'));*/
}

async function request() {
  let provider = new tronWebBuilder.providers.HttpProvider(FULL_NODE_API);
  const result = await provider.request('/wallet/getnowblock');
  assert.equal(result.blockID.length, 64);

  provider = new tronWebBuilder.providers.HttpProvider(FULL_NODE_API);
  await assertThrow(provider.request('/wallet/getnowblock'),
      'Request failed with status code 404');
}

async function providersTestAll(){
  console.log("providersTestAll start")
  await constructor();
  await setStatusPage();
  await isConnected();
  await request();
  console.log("providersTestAll end")
}

export{
  providersTestAll
}
