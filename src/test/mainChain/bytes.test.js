import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, FEE_LIMIT} = require('../util/config');
const testDeployRevert = require('../util/contracts').testDeployRevert;
const testTriggerError = require('../util/contracts').testTriggerError;
const tronWebBuilder = require('../util/tronWebBuilder');
const broadcaster = require('../util/broadcaster');
const wait = require('../util/wait');
const assert = require('assert');
const util = require('util');

async function byte2hexStr(){
    const tronWeb = tronWebBuilder.createInstance();

    assert.equal(tronWeb.utils.bytes.byte2hexStr(21), '15');
    assert.equal(tronWeb.utils.bytes.byte2hexStr(33), '21');
    assert.equal(tronWeb.utils.bytes.byte2hexStr(78), '4E');
    assert.equal(tronWeb.utils.bytes.byte2hexStr(156), '9C');
    assert.equal(tronWeb.utils.bytes.byte2hexStr(200), 'C8');

    assert.throws(() => {
        tronWeb.utils.bytes.byte2hexStr('15')
    }, 'Input must be a number');

    assert.throws(() => {
        tronWeb.utils.bytes.byte2hexStr(-15)
    }, 'Input must be a byte');

    assert.throws(() => {
        tronWeb.utils.bytes.byte2hexStr(1455)
    }, 'Input must be a byte');
}

async function bytesToString(){
    const tronWeb = tronWebBuilder.createInstance();

    assert.equal(tronWeb.utils.bytes.bytesToString([78, 112, 87, 69, 99, 65]), 'NpWEcA');

    assert.equal(tronWeb.utils.bytes.bytesToString([1178, 2112, 1087, 969]), 'Қࡀпω');

    assert.equal(tronWeb.utils.bytes.bytesToString('NpWEcA'), 'NpWEcA');

    assert.equal(tronWeb.utils.bytes.bytesToString('Қࡀпω'), 'Қࡀпω');
}

async function hextoString(){
    const tronWeb = tronWebBuilder.createInstance();

    assert.equal(tronWeb.utils.bytes.hextoString('af43ed56aa77'), '¯CíVªw');
    assert.equal(tronWeb.utils.bytes.hextoString('0xaf43'), '¯C');
    assert.equal(tronWeb.utils.bytes.hextoString('49206C6F7665206461726B20636F6D6564696573'), 'I love dark comedies');
}

async function byteArray2hexStr(){
    const tronWeb = tronWebBuilder.createInstance();

    assert.equal(tronWeb.utils.bytes.byteArray2hexStr([73, 32, 108, 111, 118, 101, 32, 100, 97, 114, 107, 32, 99, 111, 109, 101, 100, 105, 101, 115]), '49206C6F7665206461726B20636F6D6564696573');

    assert.throws(() => {
        tronWeb.utils.bytes.byteArray2hexStr([73, -32, 108])
    }, 'Input must be a byte');
}

async function base64EncodeToString(){
    const tronWeb = tronWebBuilder.createInstance();

    let result = tronWeb.utils.bytes.base64EncodeToString([73, 32, 108, 111, 118, 101, 32, 100, 97, 114, 107, 32, 99, 111, 109, 101, 100, 105, 101, 115]
    );

    assert.equal(result, 'SSBsb3ZlIGRhcmsgY29tZWRpZXM=');
}

async function base64DecodeFromString(){
    const tronWeb = tronWebBuilder.createInstance();

    let result = tronWeb.utils.bytes.base64DecodeFromString('SSBsb3ZlIGRhcmsgY29tZWRpZXM=');

    let string = tronWeb.utils.bytes.bytesToString(result);
    assert.equal(string, 'I love dark comedies');
}

async function bytesTestAll(){
    console.log("bytesTestAll start")
    this.byte2hexStr();
    this.bytesToString();
    this.hextoString();
    this.byteArray2hexStr();
    this.base64EncodeToString();
    this.base64DecodeFromString();
    console.log("bytesTestAll end")
}

export{
    byte2hexStr,
    bytesToString,
    hextoString,
    byteArray2hexStr,
    base64EncodeToString,
    base64DecodeFromString,
    bytesTestAll
}