import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, FEE_LIMIT} = require('../util/config');
const testDeployRevert = require('../util/contracts').testDeployRevert;
const testTriggerError = require('../util/contracts').testTriggerError;
const tronWebBuilder = require('../util/tronWebBuilder');
const broadcaster = require('../util/broadcaster');
const wait = require('../util/wait');
const assert = require('assert');
const util = require('util');

async function encode58(){
    const tronWeb = tronWebBuilder.createInstance();

    let input = Buffer.from('0xbf7e698', 'utf-8');
    let expected = 'cnTsZgYWJRAw';

    assert.equal(tronWeb.utils.base58.encode58(input), expected);

    input = [30, 78, 62, 66, 37, 65, 36, 39, 38];
    expected = 'PNfgHhpd9fqF';

    assert.equal(tronWeb.utils.base58.encode58(input), expected);

    input = '0xbf7e698';
    expected = 'BLw3T83';

    assert.equal(tronWeb.utils.base58.encode58(input), expected);

    input = '12354345';
    expected = '3toVqjxtiu2q';

    assert.equal(tronWeb.utils.base58.encode58(input), expected);


    assert.equal(tronWeb.utils.base58.encode58([]), '');
    assert.equal(tronWeb.utils.base58.encode58('some string'), '');
    assert.equal(tronWeb.utils.base58.encode58({key: 1}), '1');
}

async function decode58(){
    const tronWeb = tronWebBuilder.createInstance();

    const input = 'cnTsZgYWJRAw';
    const expected = Buffer.from('0xbf7e698', 'utf-8');

    const decoded = tronWeb.utils.base58.decode58(input)

    assert.equal(Buffer.compare(expected, Buffer.from(decoded, 'utf-8')), 0);


    assert.equal(JSON.stringify(tronWeb.utils.base58.decode58('')), "[]");
    assert.equal(JSON.stringify(tronWeb.utils.base58.decode58('1')), "[0]");
}

async function base58TestAll(){
    console.log("base58TestAll start")
    encode58();
    decode58();
    console.log("base58TestAll end")
}

export{
    base58TestAll
}