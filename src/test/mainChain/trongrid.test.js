import React from 'react';
import Config from '../util/config.js'
const {ADDRESS_HEX, ADDRESS_BASE58, FULL_NODE_API, SOLIDITY_NODE_API, PRIVATE_KEY, SIDE_CHAIN, SUN_NETWORK} = Config;
import tronWebBuilder from '../util/tronWebBuilder.js';
import broadcaster from '../util/broadcaster.js';
const TronWeb = tronWebBuilder.TronWeb;
const HttpProvider = tronWebBuilder.providers.HttpProvider;
const jwt = require('jsonwebtoken');
const {
  TEST_TRON_GRID_API,
  TEST_TRON_HEADER_API_KEY,
  TEST_TRON_HEADER_API_KEY2,
  TEST_TRON_HEADER_API_JWT_KEY,
  TEST_TRON_HEADER_JWT_ID,
  TEST_TRON_HEADER_JWT_PRIVATE_KEY
} = Config;
import util from 'util';
import chai from 'chai';
const assert = chai.assert;
const expect = chai.expect;
const eventContractAddress="TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"

async function headersTEST_TRON_HEADER_API_KEYNormal(){
  // headers:TEST_TRON_HEADER_API_KEY
  const tronWeb = tronWebBuilder.createInstance({
    headers: { "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY },
  });
  console.log("tronWeb:"+util.inspect(TEST_TRON_HEADER_API_KEY,true,null,true))
  // console.log("tronWeb:"+util.inspect(tronWeb,true,null,true))

  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );

  let account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");
  console.log("account:"+util.inspect(account,true,null,true))

  let events = await tronWeb.event.getEventsByContractAddress(
      eventContractAddress
  );
  assert.equal(typeof events, "object");
  assert.isTrue(events.length > 5 );
  console.log("events:"+util.inspect(events,true,null,true))
  console.log("execute headersTEST_TRON_HEADER_API_KEYNormal success")
}

async function headersAndEventHeadersTEST_TRON_HEADER_API_KEYNormal(){
  const tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
    headers: { "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY },
    eventHeaders: { "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY2 },
  });

  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY2
  );

  const account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");

  let events = await tronWeb.event.getEventsByContractAddress(
      eventContractAddress
  );
  assert.equal(typeof events, "object");
  assert.isTrue(events.length > 5 );
  console.log("execute headersAndEventHeadersTEST_TRON_HEADER_API_KEYNormal success")
}

async function setHeaderTEST_TRON_HEADER_API_KEYNormal(){
  const tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      undefined
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      undefined
  );
  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('No apikey in header')
  }
  try {
    await tronWeb.event.getEventsByContractAddress(
        eventContractAddress
    );
  } catch (error) {
    assert.equal(error.statusCode, 401);
    expect(JSON.stringify(error.error)).to.have.string('No apikey in header')
  }

  // setHeader:TEST_TRON_HEADER_API_KEY
  tronWeb.setHeader({ "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  const account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");
  let events = await tronWeb.event.getEventsByContractAddress(
      eventContractAddress
  );
  assert.equal(typeof events, "object");
  assert.isTrue(events.length > 5 );
  console.log("events:"+util.inspect(events,true,null,true))
  console.log("execute setHeaderTEST_TRON_HEADER_API_KEYNormal success")
}

async function setFullNodeHeaderTEST_TRON_HEADER_API_KEYNormal(){
  const tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
  });
  tronWeb.setFullNodeHeader({
    "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY,
  });

  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      undefined
  );

  const account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");

  try {
    await tronWeb.event.getEventsByContractAddress(
        eventContractAddress
    );
  } catch (error) {
    assert.equal(error.statusCode, 401);
    expect(JSON.stringify(error.error)).to.have.string('No apikey in header')
  }
}

async function setEventHeaderTEST_TRON_HEADER_API_KEYNormal(){
  const tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
  });
  tronWeb.setEventHeader({
    "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY,
  });

  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      undefined
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );

  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('No apikey in header')
  }

  let events = await tronWeb.event.getEventsByContractAddress(
      eventContractAddress
  );
  assert.equal(typeof events, "object");
  console.log("events:"+util.inspect(events,true,null,true))
  assert.isTrue(events.length > 5 );
  console.log("execute setFullNodeHeaderTEST_TRON_HEADER_API_KEYNormal success")
}

async function headersFAKE_KEY_valid_key(){
  // headers:FAKE_KEY
  const FAKE_KEY = "ABCEDF";
  let tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
    headers: { "TRON-PRO-API-KEY": FAKE_KEY },
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      FAKE_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      FAKE_KEY
  );
  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('ApiKey not exists')
  }
  try {
    await tronWeb.event.getEventsByContractAddress(
        eventContractAddress
    );
  } catch (error) {
    assert.equal(error.statusCode, 401);
    expect(JSON.stringify(error.error)).to.have.string('ApiKey not exists')
  }

  // headers:EMPTY_KEY
  const EMPTY_KEY = "";
  tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
    headers: { "TRON-PRO-API-KEY": EMPTY_KEY },
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      EMPTY_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      EMPTY_KEY
  );
  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('ApiKey not exists')
  }
  try {
    await tronWeb.event.getEventsByContractAddress(
        eventContractAddress
    );
  } catch (error) {
    assert.equal(error.statusCode, 401);
    expect(JSON.stringify(error.error)).to.have.string('ApiKey not exists')
  }
  console.log("execute headersFAKE_KEY_valid_key success")
}

async function headersFAKE_KEY_valid_keyEventHeadersTEST_TRON_HEADER_API_KEY(){
  // headers:FAKE_KEY,eventHeaders:TEST_TRON_HEADER_API_KEY
  const FAKE_KEY = "ABCEDF";
  let tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
    headers: { "TRON-PRO-API-KEY": FAKE_KEY },
    eventHeaders: { "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY },
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      FAKE_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('ApiKey not exists')
  }
  let events = await tronWeb.event.getEventsByContractAddress(
      eventContractAddress
  );
  assert.equal(typeof events, "object");
  assert.isTrue(events.length > 5 );
  console.log("events:"+util.inspect(events,true,null,true))

  // headers:TEST_TRON_HEADER_API_KEY,eventHeaders:EMPTY_KEY
  const EMPTY_KEY = "";
  tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
    headers: { "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY },
    eventHeaders: { "TRON-PRO-API-KEY": EMPTY_KEY }
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      EMPTY_KEY
  );
  let account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");
  try {
    await tronWeb.event.getEventsByContractAddress(
        eventContractAddress
    );
  } catch (error) {
    assert.equal(error.statusCode, 401);
    expect(JSON.stringify(error.error)).to.have.string('ApiKey not exists')
  }
  console.log("execute headersFAKE_KEY_valid_keyEventHeadersTEST_TRON_HEADER_API_KEY success")
}

async function headersTEST_TRON_HEADER_API_KEYEventHeadersFAKE_KEY_valid_key(){
  const FAKE_KEY = "ABCEDF";
  const tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
    headers: { "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY },
    eventHeaders: { "TRON-PRO-API-KEY": FAKE_KEY },
  });

  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      FAKE_KEY
  );

  const account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");

  try {
    await tronWeb.event.getEventsByContractAddress(
        eventContractAddress
    );
  } catch (error) {
    assert.equal(error.statusCode, 401);
    expect(JSON.stringify(error.error)).to.have.string('ApiKey not exists')
  }
  console.log("execute headersTEST_TRON_HEADER_API_KEYEventHeadersFAKE_KEY_valid_key success")
}

async function setHeaderFAKE_KEY_valid_key(){
  // headers:TEST_TRON_HEADER_API_KEY
  const tronWeb = tronWebBuilder.createInstance({
    headers: { "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY },
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  let account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");
  let tx = await tronWeb.event.getEventsByContractAddress(
      eventContractAddress
  );
  assert.equal(typeof tx, "object");

  // setHeader:FAKE_KEY
  const FAKE_KEY = "ABCEDF";
  tronWeb.setHeader({ "TRON-PRO-API-KEY": FAKE_KEY });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      FAKE_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      FAKE_KEY
  );
  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('ApiKey not exists')
  }
  try {
    await tronWeb.event.getEventsByContractAddress(
        eventContractAddress
    );
  } catch (error) {
    assert.equal(error.statusCode, 401);
    expect(JSON.stringify(error.error)).to.have.string('ApiKey not exists')
  }

  // setHeader:EMPTY_KEY
  const EMPTY_KEY = "";
  tronWeb.setHeader({ "TRON-PRO-API-KEY": EMPTY_KEY });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      EMPTY_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      EMPTY_KEY
  );
  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('ApiKey not exists')
  }
  try {
    await tronWeb.event.getEventsByContractAddress(
        eventContractAddress
    );
  } catch (error) {
    assert.equal(error.statusCode, 401);
    expect(JSON.stringify(error.error)).to.have.string('ApiKey not exists')
  }
  console.log("execute setHeaderFAKE_KEY_valid_key success")
}

async function setFullNodeHeaderFAKE_KEY_valid_key(){
  // headers:TEST_TRON_HEADER_API_KEY
  const tronWeb = tronWebBuilder.createInstance({
    headers: { "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY },
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  let account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");
  let tx = await tronWeb.event.getEventsByContractAddress(
      eventContractAddress
  );
  assert.equal(typeof tx, "object");

  // setFullNodeHeader:FAKE_KEY
  const FAKE_KEY = "ABCEDF";
  tronWeb.setFullNodeHeader({
    "TRON-PRO-API-KEY": FAKE_KEY,
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      FAKE_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('ApiKey not exists')
  }
  tx = await tronWeb.event.getEventsByContractAddress(
      eventContractAddress
  );
  assert.equal(typeof tx, "object");

  // setFullNodeHeader:EMPTY_KEY
  const EMPTY_KEY = "";
  tronWeb.setFullNodeHeader({
    "TRON-PRO-API-KEY": EMPTY_KEY,
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      EMPTY_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('ApiKey not exists')
  }
  tx = await tronWeb.event.getEventsByContractAddress(
      eventContractAddress
  );
  assert.equal(typeof tx, "object");
  console.log("execute setFullNodeHeaderFAKE_KEY_valid_key success")
}

async function setEventHeaderFAKE_KEY_valid_key(){
  // headers:TEST_TRON_HEADER_API_KEY
  const tronWeb = tronWebBuilder.createInstance({
    headers: { "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_KEY },
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  let account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");
  let tx = await tronWeb.event.getEventsByContractAddress(
      eventContractAddress
  );
  assert.equal(typeof tx, "object");

  // setEventHeader:FAKE_KEY
  const FAKE_KEY = "ABCEDF";
  tronWeb.setEventHeader({
    "TRON-PRO-API-KEY": FAKE_KEY,
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      FAKE_KEY
  );
  account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");
  try {
    await tronWeb.event.getEventsByContractAddress(
        eventContractAddress
    );
  } catch (error) {
    assert.equal(error.statusCode, 401);
    expect(JSON.stringify(error.error)).to.have.string('ApiKey not exists')
  }

  // setEventHeader:EMPTY_KEY
  const EMPTY_KEY = "";
  tronWeb.setEventHeader({
    "TRON-PRO-API-KEY": EMPTY_KEY,
  });
  assert.equal(
      tronWeb.fullNode.headers["TRON-PRO-API-KEY"],
      TEST_TRON_HEADER_API_KEY
  );
  assert.equal(
      tronWeb.eventServer.headers["TRON-PRO-API-KEY"],
      EMPTY_KEY
  );
  account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");
  try {
    await tronWeb.event.getEventsByContractAddress(
        eventContractAddress
    );
  } catch (error) {
    assert.equal(error.statusCode, 401);
    expect(JSON.stringify(error.error)).to.have.string('ApiKey not exists')
  }
  console.log("execute setEventHeaderFAKE_KEY_valid_key success")
}

async function testTronGridJwtKey(){
  let token = jwt.sign(
      { aud: "trongrid.io" },
      TEST_TRON_HEADER_JWT_PRIVATE_KEY,
      {
        header: {
          alg: "RS256",
          typ: "JWT",
          kid: TEST_TRON_HEADER_JWT_ID,
        },
      }
  );
  let tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
    headers: {
      "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_JWT_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  try {
  const account = await tronWeb.trx.getAccount();
  assert.equal(typeof account, "object");
  } catch (error) {
    console.log("error:"+util.inspect(error.response.data,true,null,true))

  }

  // setHeader:aud: "trongrid.iohgj"
  token = jwt.sign(
      { aud: "trongrid.iohgj" },
      TEST_TRON_HEADER_JWT_PRIVATE_KEY,
      {
        header: {
          alg: "RS256",
          typ: "JWT",
          kid: TEST_TRON_HEADER_JWT_ID,
        },
      }
  );
  tronWeb.setHeader({
    "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_JWT_KEY,
    Authorization: `Bearer ${token}`,
  });
  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('invalid request due to settings')
  }

  // exp: 0
  token = jwt.sign(
      {
        exp: 0,
        aud: "trongrid.io",
      },
      TEST_TRON_HEADER_JWT_PRIVATE_KEY,
      {
        header: {
          alg: "RS256",
          typ: "JWT",
          kid: TEST_TRON_HEADER_JWT_ID,
        },
      }
  );
  tronWeb = tronWebBuilder.createInstance({
    fullHost: TEST_TRON_GRID_API,
    headers: {
      "TRON-PRO-API-KEY": TEST_TRON_HEADER_API_JWT_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    await tronWeb.trx.getAccount();
  } catch (error) {
    assert.equal(error.response.status, 401);
    expect(JSON.stringify(error.response.data)).to.have.string('invalid request due to settings')
  }
  console.log("execute testTronGridJwtKey success")
}

async function trongridTestAll(){
  console.log("trongridTestAll start")
  await headersTEST_TRON_HEADER_API_KEYNormal();
  await headersAndEventHeadersTEST_TRON_HEADER_API_KEYNormal();
  await setHeaderTEST_TRON_HEADER_API_KEYNormal();
  await setFullNodeHeaderTEST_TRON_HEADER_API_KEYNormal();
  await setEventHeaderTEST_TRON_HEADER_API_KEYNormal();
  await headersFAKE_KEY_valid_key();
  await headersFAKE_KEY_valid_keyEventHeadersTEST_TRON_HEADER_API_KEY();
  await headersTEST_TRON_HEADER_API_KEYEventHeadersFAKE_KEY_valid_key();
  await setHeaderFAKE_KEY_valid_key();
  await setFullNodeHeaderFAKE_KEY_valid_key();
  await setEventHeaderFAKE_KEY_valid_key();
  await testTronGridJwtKey();
  console.log("trongridTestAll end")
}

export{
  trongridTestAll
}
