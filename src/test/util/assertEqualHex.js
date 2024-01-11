import {assert} from 'chai';
import tronWebBuilder from './tronWebBuilder.js';

export default async function (result, string) {

    assert.equal(
        result,
        tronWebBuilder.getInstance().toHex(string).substring(2)
    )
}
