import React from 'react';
const {PRIVATE_KEY, ADDRESS_HEX, ADDRESS_BASE58} = require('../util/config');
const tronWebBuilder = require('../util/tronWebBuilder');
const assertThrow = require('../util/assertThrow');
const GetNowBlock = require('../util/GetNowBlock');
const BlockLib = require('../util/BlockLib');
const broadcaster = require('../util/broadcaster');
const wait = require('../util/wait');
const TronWeb = tronWebBuilder.TronWeb;
const Plugin = tronWebBuilder.Plugin;

const util = require('util');
const chai = require('chai');
const assert = chai.assert;
let tronWeb = tronWebBuilder.createInstance();

async function pluginGetNowBlock() {
  console.log(`${'*'.repeat(30)}\nTronWeb.version: ${tronWebBuilder.TronWeb.version}\n${'*'.repeat(30)}`);
  assert.instanceOf(tronWeb.plugin, Plugin);

  const someParameter = 'someValue'
  let result = tronWeb.plugin.register(GetNowBlock, {
    someParameter
  })
  console.log("result: ",JSON.stringify(result,null,2))
  assert.isTrue(result.skipped.includes('_parseToken'))
  assert.isTrue(result.plugged.includes('getCurrentBlock'))
  assert.isTrue(result.plugged.includes('getLatestBlock'))

  result = await tronWeb.trx.getCurrentBlock()
  assert.isTrue(result.fromPlugin)
  assert.equal(result.blockID.length, 64)
  assert.isTrue(/^00000/.test(result.blockID))

  result = await tronWeb.trx.getSomeParameter()
  assert.equal(result, someParameter)
}

async function pluginBlockLib() {
  let result = tronWeb.plugin.register(BlockLib)
  console.log("result: ",JSON.stringify(result,null,2))
  assert.equal(result.libs[0], 'BlockLib')
  result = await tronWeb.blockLib.getCurrent()
  console.log("result: ",JSON.stringify(result,null,2))
  assert.isTrue(result.fromPlugin)
  assert.equal(result.blockID.length, 64)
  assert.isTrue(/^00000/.test(result.blockID))

  /*tronWeb.plugin.register(BlockLib)
  return new Promise(resolve => {
    tronWeb.blockLib.getCurrent((err, result) => {
      assert.isTrue(result.fromPlugin)
      assert.equal(result.blockID.length, 64)
      assert.isTrue(/^00000/.test(result.blockID))
      resolve()
    })
  })*/

  let tronWeb2 = tronWebBuilder.createInstance({disablePlugins: true});
  result = tronWeb2.plugin.register(BlockLib);
  assert.isTrue(typeof result.error === 'string');
}

async function pluginTestAll(){
  console.log("pluginTestAll start")
  await pluginGetNowBlock();
  await pluginBlockLib();
  console.log("pluginTestAll end")
}

export{
  pluginTestAll
}
