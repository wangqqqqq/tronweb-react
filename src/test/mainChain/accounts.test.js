import React from 'react';
const tronWebBuilder = require('../util/tronWebBuilder');
const publicMethod = require('../util/PublicMethod');
const tronWeb = tronWebBuilder.createInstance();
const ethersWallet = tronWeb.utils.ethersUtils.ethersWallet;
const chai = require('chai');
const assert = chai.assert;
const util = require('util');
const wordlist = 'en';

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

async function generateRandomWhenParam_aPositiveInterger(){
    const tronWeb = tronWebBuilder.createInstance();

    const options = 12;
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenParam_bigParantheses(){
    const tronWeb = tronWebBuilder.createInstance();

    const options = {};
    const newAccount = await tronWeb.createRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, "m/44'/195'/0'/0/0");
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenParam_null(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'/0'/0/0";
    const newAccount = await tronWeb.utils.accounts.generateRandom();
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenPath_allNull(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'";
    const options = { path: path };
    const newAccount = await tronWeb.createRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenPath_chainAndIndexNull(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'/0'";
    const options = { path: path };
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenPath_indexNull(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'/0'/1";
    const options = { path: path };
    const newAccount = await tronWeb.createRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenPath_accountIs0AndIndexIs13(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'/0'/0/13";
    const options = { path: path };
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenPath_accountIs3AndIndexIs99(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'/3'/0/99";
    const options = { path: path };
    const newAccount = await tronWeb.createRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenPath_error1(){
    const tronWeb = tronWebBuilder.createInstance();

    const options = { path: "m/44'/60'/0'/0/0" };

    try {
        await tronWeb.utils.accounts.generateRandom(options)
    } catch (err) {
        let errMsg = err.message
        assert.notEqual(errMsg.indexOf('Invalid tron path provided'), -1)
    }
}

async function generateRandomWhenPath_error2(){
    const options = { path: 12 };

    try {
        await tronWeb.createRandom(options)
    } catch (err) {
        let errMsg = err.message
        assert.notEqual(errMsg.indexOf('Invalid tron path provided'), -1)
    }
}

async function generateRandomWhenWordlist_zh_cn(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'zh_cn';
    const path = "m/44'/195'/0'/0/13";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase, wordlist));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenWordlist_zh_tw(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'zh_tw';
    const path = "m/44'/195'/3'/0/99";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.createRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase, wordlist));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenWordlist_ko(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'ko';
    const path = "m/44'/195'/2'/0/123";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase, wordlist));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
}

async function generateRandomWhenWordlist_ja(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'ja';
    const path = "m/44'/195'/1'/1/2";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.createRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase, wordlist));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(newAccount.mnemonic.phrase+", "+newAccount.mnemonic.path+", "+newAccount.mnemonic.locale+", "+newAccount.privateKey+", "+newAccount.address)
}

async function generateRandomWhenWordlist_it(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'it';
    const path = "m/44'/195'/1'/2/3";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);
    assert.equal(newAccount.privateKey.substring(2).length, 64);
    assert.equal(newAccount.publicKey.substring(2).length, 130);
    assert.isTrue(tronWeb.utils.ethersUtils.isValidMnemonic(newAccount.mnemonic.phrase, wordlist));
    let address = tronWeb.address.fromPrivateKey(newAccount.privateKey.replace(/^0x/, ''));
    assert.equal(address, newAccount.address);
    assert.equal(tronWeb.address.toHex(address), tronWeb.address.toHex(newAccount.address));

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);
    assert.equal(newAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(newAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(newAccount.address).substring(2), ethAccount.address.substring(2));
}

async function generateRandomWhenWordlist_nonexistent(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'itsf';
    const path = "m/44'/195'/1'/2/3";
    const options = { path: path, locale: wordlist};

    try {
        await tronWeb.createRandom(options)
    } catch (err) {
        let errMsg = err.message
        assert.notEqual(errMsg.indexOf('unknown locale (argument="wordlist", value="itsf"'), -1)
    }
}

async function generateRandomWhenWordlist_emptyChar(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'/1'/2/3";
    const options = { path: path, locale: ''};

    try {
        await tronWeb.utils.accounts.generateRandom(options)
    } catch (err) {
        let errMsg = err.message
        assert.notEqual(errMsg.indexOf('unknown locale (argument="wordlist", value=""'), -1)
    }
}

async function generateAccountWithMnemonic_withCorrectPath(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'/0'/0/68";
    const options = { path: path };
    const newAccount = await tronWeb.createRandom(options);

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path);

    const tronAccount = await tronWeb.fromMnemonic(newAccount.mnemonic.phrase, path);

    assert.equal(tronAccount.mnemonic.phrase, ethAccount.mnemonic.phrase);
    assert.equal(tronAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(tronAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(tronAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(tronAccount.mnemonic.phrase+", "+tronAccount.mnemonic.path+", "+tronAccount.mnemonic.locale+", "+tronAccount.privateKey+", "+tronAccount.address)
}

async function generateAccountWithMnemonic_withTruncatedPath(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'";
    const options = { path: path };
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path);

    const tronAccount = await tronWeb.utils.accounts.generateAccountWithMnemonic(newAccount.mnemonic.phrase, path);

    assert.equal(tronAccount.mnemonic.phrase, ethAccount.mnemonic.phrase);
    assert.equal(tronAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(tronAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(tronAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(tronAccount.mnemonic.phrase+", "+tronAccount.mnemonic.path+", "+tronAccount.mnemonic.locale+", "+tronAccount.privateKey+", "+tronAccount.address)
}

async function generateAccountWithMnemonic_withPathIsNotSame(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'/0'";
    const options = { path: path };
    const newAccount = await tronWeb.createRandom(options);

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path);

    const tronAccount = await tronWeb.fromMnemonic(newAccount.mnemonic.phrase, "m/44'/195'/0'/1");

    assert.equal(tronAccount.mnemonic.phrase, ethAccount.mnemonic.phrase);
    assert.notEqual(tronAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.notEqual(tronAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    console.log(tronAccount.mnemonic.phrase+", "+tronAccount.mnemonic.path+", "+tronAccount.mnemonic.locale+", "+tronAccount.privateKey+", "+tronAccount.address)

    console.log("execute generateAccountWithMnemonic_withPathIsNotSame success")
}

async function generateAccountWithMnemonic_withPathIsNull(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'/0'/0/0";
    const options = { path: path };
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path);

    const tronAccount = await tronWeb.utils.accounts.generateAccountWithMnemonic(newAccount.mnemonic.phrase);

    assert.equal(tronAccount.mnemonic.phrase, ethAccount.mnemonic.phrase);
    assert.equal(tronAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(tronAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(tronAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(tronAccount.mnemonic.phrase+", "+tronAccount.mnemonic.path+", "+tronAccount.mnemonic.locale+", "+tronAccount.privateKey+", "+tronAccount.address)

    console.log("execute generateAccountWithMnemonic_withPathIsNull success")
}

async function generateAccountWithMnemonic_withErrorPath(){
    const tronWeb = tronWebBuilder.createInstance();

    const options = { path: "m/44'/195'/0'/0/0"};
    const newAccount = await tronWeb.createRandom(options);

    try {
        await tronWeb.fromMnemonic(newAccount.mnemonic.phrase, "m/44'/196'/1'/2/3")
    } catch (err) {
        let errMsg = err.message
        assert.notEqual(errMsg.indexOf("Invalid tron path provided"), -1)
    }

    console.log("execute generateAccountWithMnemonic_withErrorPath success")
}

async function generateAccountWithMnemonicWordlist_zh_cn(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'zh_cn';
    const path = "m/44'/195'/0'/0/13";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);

    const tronAccount = await tronWeb.utils.accounts.generateAccountWithMnemonic(newAccount.mnemonic.phrase, path, wordlist);

    assert.equal(tronAccount.mnemonic.phrase, ethAccount.mnemonic.phrase);
    assert.equal(tronAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(tronAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(tronAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(tronAccount.mnemonic.phrase+", "+tronAccount.mnemonic.path+", "+tronAccount.mnemonic.locale+", "+tronAccount.privateKey+", "+tronAccount.address)

    console.log("execute generateAccountWithMnemonicWordlist_zh_cn success")
}

async function generateAccountWithMnemonicWordlist_zh_tw(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'zh_tw';
    const path = "m/44'/195'/3'/0/99";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.createRandom(options);

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);

    const tronAccount = await tronWeb.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);

    assert.equal(tronAccount.mnemonic.phrase, ethAccount.mnemonic.phrase);
    assert.equal(tronAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(tronAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(tronAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(tronAccount.mnemonic.phrase+", "+tronAccount.mnemonic.path+", "+tronAccount.mnemonic.locale+", "+tronAccount.privateKey+", "+tronAccount.address)

    console.log("execute generateAccountWithMnemonicWordlist_zh_tw success")
}

async function generateAccountWithMnemonicWordlist_ko(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'ko';
    const path = "m/44'/195'/2'/0/123";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);

    const tronAccount = await tronWeb.utils.accounts.generateAccountWithMnemonic(newAccount.mnemonic.phrase, path, wordlist);

    assert.equal(tronAccount.mnemonic.phrase, ethAccount.mnemonic.phrase);
    assert.equal(tronAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(tronAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(tronAccount.address).substring(2), ethAccount.address.substring(2));
}

async function generateAccountWithMnemonicWordlist_ja(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'ja';
    const path = "m/44'/195'/1'/1/2";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.createRandom(options);

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);

    const tronAccount = await tronWeb.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);

    assert.equal(tronAccount.mnemonic.phrase, ethAccount.mnemonic.phrase);
    assert.equal(tronAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(tronAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(tronAccount.address).substring(2), ethAccount.address.substring(2));
    console.log(tronAccount.mnemonic.phrase+", "+tronAccount.mnemonic.path+", "+tronAccount.mnemonic.locale+", "+tronAccount.privateKey+", "+tronAccount.address)
}

async function generateAccountWithMnemonicWordlist_it(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'it';
    const path = "m/44'/195'/1'/2/3";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);

    const ethAccount = await ethersWallet.fromMnemonic(newAccount.mnemonic.phrase, path, wordlist);

    const tronAccount = await tronWeb.utils.accounts.generateAccountWithMnemonic(newAccount.mnemonic.phrase, path, wordlist);

    assert.equal(tronAccount.mnemonic.phrase, ethAccount.mnemonic.phrase);
    assert.equal(tronAccount.privateKey.substring(2), ethAccount.privateKey.substring(2));
    assert.equal(tronAccount.publicKey.substring(2), ethAccount.publicKey.substring(2));
    publicMethod.equalIgnoreCase(tronWeb.address.toHex(tronAccount.address).substring(2), ethAccount.address.substring(2));
}

async function generateAccountWithMnemonicWordlist_unmatch(){
    const tronWeb = tronWebBuilder.createInstance();

    const wordlist = 'it';
    const path = "m/44'/195'/1'/2/3";
    const options = { path: path, locale: wordlist};
    const newAccount = await tronWeb.createRandom(options);

    try {
        await tronWeb.fromMnemonic(newAccount.mnemonic.phrase, path, "en")
    } catch (err) {
        let errMsg = err.message
        assert.notEqual(errMsg.indexOf("invalid mnemonic"), -1)
    }
}

async function generateAccountWithMnemonicWordlist_nonexistent(){
    const tronWeb = tronWebBuilder.createInstance();

    const path = "m/44'/195'/1'/2/3";
    const options = { path: path};
    const newAccount = await tronWeb.utils.accounts.generateRandom(options);

    try {
        await tronWeb.utils.accounts.generateAccountWithMnemonic(newAccount.mnemonic.phrase, path, "jwerfa")
    } catch (err) {
        let errMsg = err.message
        assert.notEqual(errMsg.indexOf('unknown locale (argument="wordlist", value="jwerfa"'), -1)
    }
}

async function generateAccountWithMnemonicWordlist_isNull(){
    const tronWeb = tronWebBuilder.createInstance();

    try {
        await tronWeb.fromMnemonic()
    } catch (err) {
        let errMsg = err.message
        assert.notEqual(errMsg.indexOf("Cannot read properties of undefined (reading 'toLowerCase')"), -1)
    }
}
async function accountsTestAll(){
    console.log("accountsTestAll start")
    await encode58();
    await decode58();

    await generateRandomWhenParam_aPositiveInterger();
    await generateRandomWhenParam_bigParantheses();
    await generateRandomWhenParam_null();
    await generateRandomWhenPath_allNull();
    await generateRandomWhenPath_chainAndIndexNull();
    await generateRandomWhenPath_indexNull();
    await generateRandomWhenPath_accountIs0AndIndexIs13();
    await generateRandomWhenPath_accountIs3AndIndexIs99();
    await generateRandomWhenPath_error1();
    await generateRandomWhenPath_error2();
    await generateRandomWhenWordlist_zh_cn();
    await generateRandomWhenWordlist_zh_tw();
    await generateRandomWhenWordlist_ko();
    await generateRandomWhenWordlist_ja();
    await generateRandomWhenWordlist_it();
    await generateRandomWhenWordlist_nonexistent();
    await generateRandomWhenWordlist_emptyChar();

    await generateAccountWithMnemonic_withCorrectPath();
    await generateAccountWithMnemonic_withTruncatedPath();
    await generateAccountWithMnemonic_withPathIsNotSame();
    await generateAccountWithMnemonic_withPathIsNull();
    await generateAccountWithMnemonic_withErrorPath();
    await generateAccountWithMnemonicWordlist_zh_cn();
    await generateAccountWithMnemonicWordlist_zh_tw();
    await generateAccountWithMnemonicWordlist_ko();
    await generateAccountWithMnemonicWordlist_ja();
    await generateAccountWithMnemonicWordlist_it();
    await generateAccountWithMnemonicWordlist_unmatch();
    await generateAccountWithMnemonicWordlist_nonexistent();
    await generateAccountWithMnemonicWordlist_isNull();
    console.log("accountsTestAll end")
}

export{
    accountsTestAll
}