import React from 'react';
import Config from '../util/config.js'
const {FULL_NODE_API, PRIVATE_KEY, ADDRESS_HEX, ADDRESS_BASE58} = Config;
import tronWebBuilder from '../util/tronWebBuilder.js';
import assertThrow from '../util/assertThrow.js';
import broadcaster from '../util/broadcaster.js';
import wait from '../util/wait.js';
import { assert } from 'chai';
import util from 'util';

const TronWeb = tronWebBuilder.TronWeb;

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
