const {PRIVATE_KEY, FEE_LIMIT, ADDRESS_BASE58, ADDRESS_HEX, SIDE_CHAIN} = require('../util/config');
const shieldContract = require('../util/contracts').shieldContract;
const trc20Contract = require('../util/contracts').trc20Contract;
const assertThrow = require('../util/assertThrow');
const tronWebBuilder = require('../util/tronWebBuilder');
const publicMethod = require('../util/PublicMethod');
const wait = require('../util/wait');
const shieldedUtils = require('../util/shieldedUtils');
const {Z_TRON: zTronConfig} = require('../util/config');
const TronWeb = tronWebBuilder.TronWeb;
const chai = require('chai');
const util = require('util');
const assert = chai.assert;
const tronWeb = tronWebBuilder.createInstance();
const address = tronWeb.defaultAddress.base58;
let scalingFactor = 10;
let trc20ContractAddress;
let shieldedTRC20ContractAddress;
// const {shieldedTRC20ContractAddress, trc20ContractAddress} = zTronConfig;
const keysInfo = {};
const narrowValue = 2;
let realCost;
let shieldedInfo;
let shieldedInfo2;
let newOtherAccountKey;
let newOtherAddress;
let ownerAddress;

async function before() {

    // newOtherAccount = await tronWeb.utils.accounts.generateAccount();
    // newOtherAccountKey = newOtherAccount.privateKey;
    newOtherAccountKey = "04E873F2920C6282FA70D0B5F485B7F456BBCD07771DD64FD46958B5A7C6DBA9";
    console.log("newOtherAccountKey:"+newOtherAccountKey)
    assert.equal(newOtherAccountKey.length, 64);
    newOtherAddress = tronWeb.address.fromPrivateKey(newOtherAccountKey);
    console.log("newOtherAddress:"+newOtherAddress)

    // ownerAddress
    ownerAddress = tronWeb.address.fromPrivateKey(PRIVATE_KEY);

    // deploy shieldedTRC20 contract
    console.log("000")
    trc20ContractAddress = "TEK8zvg9shh1AQ3VpDGjnK3nBZWEqPtihT";
    console.log("trc20ContractAddress:"+trc20ContractAddress)
    shieldedTRC20ContractAddress = "TH5cnDqDH46ajv3V3N94MQYjfVc9icRxPN";
    console.log("shieldedTRC20ContractAddress:"+shieldedTRC20ContractAddress)
}

async function createMintParams() {
    let trigger_contract_input = "000000000000000000000000000000000000000000000000000000000000001411032cf2a656c0d20cf7d6eb6afab365149e896396c9e2897d231abe52dc8a451efb71cac035592521ef2367fa7743f4a0b13df9fba113d02b9b2e099467d10814ea57891c5b617d89b5eeaed81c6fb018bab4e73dd1f7141fc5d85e41e969efafc73a51fe5ede193c83b7a24f5d080cf497815cd0872892daf47ace57e27a9fdfb99cfe2b3bfaee88e5986fc00b5288a342dc859f3e2f913e9d8a21b0a5c55336bb6b8a7d2eba121f3ae9f8b25bff7a1fb5db7acd74d084501cb48adb0bfc420725859d307287f42c3a155ff3f50448755a890cd76832bda8fcb1c000007e5cac250444f620380bd4bb20443b169569af2fd85e542b9980db34ebe2452e5a4921a3fc254e5f770d9e658de2220896ad5eaf4374a97d3602e5df14f33a05d1394a344e974d295db68c71111fd118d39402288c338d32ce0141543b440b63241f431cebebf2c6aa9c2d1d5715fb2a9d1ab4389ba23e525953c9d166ea2897f70bed8e21b55a029a24d26ac89734fe64dad72b31193559c581f3c5f0767b49ced56bb0e6f49e4c10d8d6d9953334e48d41fa19bb82388aae5e87c6a06898aa4581cc797f4753a9a287993cba16a89754dc1d95fc3bda9a6ff06a568ab7c7c2f011c567d8ed8372bd497cab41fe3c56db743ed6e18801865731366929ab8c97e650213c067e8f5c9ca74627471e0cbd3ca0e1b657ea03ef3f53d040645c36eae3dde7c7e6f4f08bb9a2afe4b4f4083fedc5984e3cc57117d705b09581816b8a2aa2d524ec6408412a9de50e5ca29561e74177d1ef2d6e79a982be8830f445d7d782b69c453e4e702dedc00a6ef8343606cd05092693815cab44dd60cb32b05d253237baaebd07d7dd09980b1d7673b91667e30b6e799fc7992a76bcc82bfc22267ade265dc5282c8081b0dec96f1a1bcea0bb9b67caa6164f34c4dca775027e3f63737d0c21bb673d13e750e1e61bd25bdd6e3c3d6690d9fc0439d796bff61fddc649296e58c061ebacf91085b449e73682313ba008a30f228e6c70e6c4adab99a72ce6994300421f6411dc8c58519c7d5e54bc0bae3fa6c3f68990b0f46f4ff126bc066591bf3a70eb0c768cbfb9bbc2a7b378ae2cd7c5384d836ebdfcb6eb78fbbe8fe46b400a2e85a94fd48a4d6fe0d3ca68c984498e12a1e2c61342382b06b085f389fddea9a670508583c799ae8d822448a0541a6dd45d7a42260b1876ffc48f4e5694117b81fc712e3c6a61804d2e0a90568e19c3da6082666d4e436d77da7065edfa89473e0c1a3427242f0a433f55c9431f1905de2fa22ec9400cc048d75e19f68f387bc78237aaedb355d952027142af7f2726fb7843fcb0394891534b62ab00cfb50bd24c514b245f405fc9abe992feb7c6d43a44638d7d5448aab1fdca33d87c1e4f291a234ba26278ad522672d06a56000000000000000000000000";

    // createMintParams
    const options = {
        shieldedParameter: trigger_contract_input
    }
    const createTx = await shieldedUtils.makeAndSendTransaction(
        tronWeb, shieldedTRC20ContractAddress,
        'mint(uint256,bytes32[9],bytes32[2],bytes32[21])', options,
        [], address);
    let createTxId = createTx.transaction.txID;
    console.log("createTxId: " + createTxId)
    assert.equal(createTxId.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(
            createTxId);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log(
                "createInfo:" + util.inspect(createInfo, true, null,
                true))
            break;
        }
    }
    assert.equal(createInfo.receipt.result, "SUCCESS");
}

async function createMintParamsWithoutAsk() {
    let trigger_contract_input = "00000000000000000000000000000000000000000000000000000000000000149d04b34d0d676bd55dff60136cf7bc338e2accd99ceae17cc367f576dfe1632b03ac4fded69df508228a0462eed9e50c4e60bbaee7b50847bc2c83465a2ed2cf5b55bfec6b408b02601c5984275d443f860829407c1abae23b5331c10ce9cfae9296b12512c7a90170b49697ffe72712244872065af260202ce0e304d374a7f2f06a988d283a3104e2640cfeef6f0853a0cbb8c731e244ca7b23d19a5d3f1d7df1d5c7cf43a4a5555a559c6976d37f3fd16ebb98c14af579a0b8c8768baff76e1302e8212f651a57e445d7e4c5de5da5ff5c8a164fbe433f24e57e23f4ec5c69d185d894bf78a3ae69eb64ca4d891ef380fc2c16e7a735c36888c8a965b846d30b43ad65d6b97671bb6fbf18ee6ee0280b74b700fc9fdfb05d2f319872dc795d31ac838091fb0e87d9fdbcc619e9751cd703339a985b97bcb3e7dc80a47a16068f20a94087648d8d234717b2994c0c6fc85bdaf933925578f5adb19a24467804bfbb33b4240126490b1520c34dae23f3f9f4cc0d80f6e03e23c4a1e8ffdbc49b57dd0fe0297e9841cd8038d515e874ce331cee9546b1e1bdb446f4827545b5374d04e47c2961de9cc2ccee0021b3d0e48e507cd84014bb4c72a65559422299529d1e152edb2654fb794caf76b3f2ec3aae16f1833938338678d746d4df5b90457844f7f39db3a63a49e63e5ae1b8ff7b3055f4eee0218d0b916d1a81a2c011e35ee6ea17950da4e283f9675bf506a0278265c6d906ede2a3b8aa971d0144d5f5d9bcd63de988bfc8b2a93d24e39134ac6cc5738c1d4fc41cf454da30d129adf91b22e953eaece1461d0b6b9eb69331a501e6aa2bee328b85a2f81f515e7375a6ce35826145c106f9e3d24db0cee0dd747c61102090c04e877aef5fc1cd090cf892ea58299d880747648a4e84bb95a3b121949b9464748a22e3a1b99378ca85a48299811113bfc45e361a632fa6b919f75c6dba3105e365b8d5243a350f5201d6fb880f38cfd9616136b02e4e898b1a1e731c9b88bfd5fa3d2702a79b89714026cf415f0ce671c1ba33446999af36aeed3de1834cdb2f60bd9fc1dfd28d324b5228b0c62c58c8ea158ffe4b24d88f3127a2d1156eaeb7d002220d8ae234b31c68319c83f54b688adf338f1b0266df40bae0919ddceb33faaef7769497aac186ebd4aa259052f7acc2143a80bcf7536470068f110258379f288056221d8bf69bf4096d66b6c2521aa9696a2cda68f9c654e27011ee96cd69987148ca8da516ecd80d2fe95ffef8ad75b9e3324736176ad6fbe84c1f6c8ba54e3f4e2630f80bba3fbadf111ac9ba4f24baeded3821bd1d200f325881d0360f3c3656848cd0eacdc0f7e772c5014089ce580678960d3be2c138c9f98d1d298b57cf8172ac4fb4da9d1029bfd90603e352a4d23950dc67b07aa34e10ed000000000000000000000000";

    const options = {
        shieldedParameter: trigger_contract_input
    }
    const createTx1 = await shieldedUtils.makeAndSendTransaction(tronWeb,
        shieldedTRC20ContractAddress,
        'mint(uint256,bytes32[9],bytes32[2],bytes32[21])', options, [],
        address);
    let createTxId1 = createTx1.transaction.txID;
    console.log("createTxId1: " + createTxId1)
    assert.equal(createTxId1.length, 64);
    let createInfo1;
    while (true) {
        createInfo1 = await tronWeb.trx.getTransactionInfo(createTxId1);
        if (Object.keys(createInfo1).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo1:" + util.inspect(createInfo1))
            break;
        }
    }
    assert.equal(createInfo1.receipt.result, "SUCCESS");
}

async function createTransferParams() {
    let trigger_contract_input = "00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002808b8456a65e5eb304be215f921a59ad5d0325ea59a7604d96719d52ab11e40a523e302fb1c6ff080c432e0e6d35871ac2717306eb9b3ca169eaee594e3050200500000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000001e59fe9999480c307566856ed0c3b961f7fb3e254512b921e3f2ccdba79a859550b3fe21fa20555998ed951df15d1392428a83c0721bfd33efabd029828c8ad6659212bfac13d7f244a8e91f1d75c990f7d33c77da77055854c7ac0c4e6722bc79e2903e611481c039ebcf1ceb65a998daad8734650f296843199490935af381587a88b7ff0a917df58ec1c92ad5cb4ad7495d4cb5813e44806a310707cb8b38e88c034192144fa91c8674880bbaf57b685361d919c366eb1806901b5a35e7deb6afda2fddca3aefaacc38454316bc266a87141700490c8234bffdef74eeb45830cd278b722ea3090cb074aaec4cf6298d204bed662f5cb973050108483bb9826aa5c0da8d4852e272fc9baa5c7555187a582bc117dc028b99c45e1babebe380c00f875f5d96c1a25d2386e39972e48a6747074c9b60e516742cce48b6116f1c300000000000000000000000000000000000000000000000000000000000000015d005b66093704554ca2526e7486df25a97528012f90af153ef1be22db0a204d6172d149fcb68069cdf330df524c1c48bade5976e7d9c565285df19b5d7b3f000000000000000000000000000000000000000000000000000000000000000001ea3e57e1eb9d31551eb3dcf4eb387f1fa74f3a42ade174ebc68abaefa59fe93511c99171b81ae1b8d462a92b78f5fcfc1186acb1d4d096afcb1cef231c69b3495f94b3f410a37c1985cf6a5ab973ee9ffb12759a797ec45976331e556e5a353f8717a0d37cec7faa6c8a42e3d6eb1475e2a0e66e0e964ab34381af90c494bd54f7943c08e615925b343806dc78043afa8be088574a191818e527bed33afd4c4cd334835125d7acc9ee50e87baf6f12088072bb0716c25cb1971ec9097b4bd599049eee40c8ca4c8e63b17ff0dbe460eb041290300b54aae2bdb0615997a5d852bd8404cedeca29f29aec66256495aa7e890b42f0cec0a5bd3dcd1a9dc864d110ccd2a4fd0cfa17c4764f5ffe0425e8d2ddaf28c3bfdf382c4d51c516b2ed70b5000000000000000000000000000000000000000000000000000000000000000113ee76d4aa1adb1842d886a2dc8a36036fe655a2f39427f0d1fc93cec18b4eb16537ba00b9a18317007459fc71f8c81fa1b05b2bd2535fd042791d430f77f2a210df4f430dbbdb544c41d1c0f58b6569be5f9743f1c8c21edd08f97d234cf53b384957aba1b0c8cf376e24bf20ed84d4a8aeba277827f1e86e2fd335b0addb017a68f13768e5fba72a908c8aa7b9a77619c715f081df25d8350d202ae254d60c456c63ebe090d968d880c56ebc564f3b433418df2dea3a78946703f61fa2a60fede6f6190e8e56a4d1130ab3fc8a025c2746c05ceeea2ec7ec3187a89b70f12d004ba5234eb6e92ce7dcd6f1818cdd388ada915d95ca2d53307ced2ba5ae440dfe4519838f237222e4c7234f950cd821c7f8eee81497b17b039cc800886fb49fb83beb3b981d533c4a1d60ef1b6c446417f809f1d7b84309e0fb0a53eca78ecebc19e7a783567b5b1aa551ddb86511aa0fe5caf36bf6ac0603bbd8f8769024d0cbf62c0ba46348d4ee29f1321dbaf96c98f73bd158ef21428cddfd299eeafd02f340b1a66c265de0e9be729d19dd4ece80972f7223e6098741c6e4b1d456ac52b2df9e2a4342ca9fb8e1ff0c840ff1237d4d0aa13f1b4d1dfe3d3dd9709534403a1a1da4e3153b9ffbdeef656b87f895ffab788d9d80af8ab710a132a6c0372d9c82cab6817ddba58f058308dcacbbfe408bf46b9fa10a926467eec328b3b86a6364b02a869aa847a4889eb384a53a771c34ee79003b5004665127a9f218e213ad5e86791358e9fab85ac98ccca3adc31a836687a48bc6fe3a4d56bca429e509ac1d555369bc1a48d1acf48df2df531c0e84c0116f41faa82c20cb53a0a50bda8f3e34aabac775e3347130e86f52101ab1add845f351ccd0e89f9208992480c64847d5cb5320aff2464cf5208903a6afa0659142000000000000000000000000";
    const options = {
        shieldedParameter: trigger_contract_input
    };
    console.log("options: " + util.inspect(options, true, null, true))
    const transactionResult = await shieldedUtils.makeAndSendTransaction(
        tronWeb, shieldedTRC20ContractAddress,
        'transfer(bytes32[10][],bytes32[2][],bytes32[9][],bytes32[2],bytes32[21][])',
        options, [], tronWeb.defaultAddress.base58);
    assert.ok(transactionResult && transactionResult.result);
    let createTxId = transactionResult.transaction.txID;
    console.log("createTxId: " + createTxId)
    assert.equal(createTxId.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(createTxId);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:" + util.inspect(createInfo))
            break;
        }
    }
    assert.equal(createInfo.receipt.result, "SUCCESS");
}

async function createTransferParamsWithoutAsk() {
    const options = {
        shieldedParameter: "00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000028024f29711036cc24284af83ec568a0e73593a92076b6b521c735f363a0398cb159916c317965bde94992cc874d297675239488669bdb348c5c74f7aee3321cf0a00000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000001f6125a6c7fe185e1696a2857eba009e05fdd74881611c2cec0189dbf1a91db7664a9fb97d926d518a6938a690212864c90a1fbe6f1909fa19d7d0b098b11df12767d97119672684dc02a26679761753dcb0da4d5b04a36328223f7997def41b5559f2e608e8a4db9c818eb4e11cdadf6d70be267146e1d4322c758223daf4a40a485c9ac6b90f0277ca94c66d9d799f241114f10969dd4131084000a50fcca587e6d73ba5245cd7bdd9c356fb119b30fb1d69284b8c046bedc605ba1e45e2756c1c39c28afbb2688400429a4646145e56579a0678652f2f45fb8fa3f39a6375e1929db7a5eba7977befab248729dc0db837a33b780a26fffced7decabbbc466a8e2125d3f30f51459c92b1fe99c3391ba77ea43864d0884cfc106e9d1e4cdf201c34f8618547e1956fee1c31b649f3a7335b01a6bab3b20290ba05e27a16e8e70000000000000000000000000000000000000000000000000000000000000001d1864e7d85ee1d237f0300eb83ce02e03d8f2961353ff6d8fa1f45f71d12e0a77f7690b95d64c43b8b0bf6a2eb6247486cb0f8f7e8007c26dc1b88360fb0c1080000000000000000000000000000000000000000000000000000000000000001c93e6b283de7d4018b356bea54096b48c8b7d14687434d7955633f587317c859962d773f958023ffab47b14741c3950a1e13b03c1b0df919155f8eca7b318e192ca3a56c1e6a81463e10a0dae4ef73c5c0753a862d90fdffa38c66b103e331beb745ccfd252477fbcfc6c6558e248a2b2de47cf9cefd577c22c6e2a6702da9e30f9a13cc5017e622821f701a4a259f8996a85ec3a95bcf04fa6b8d45fb9c6408787db203c78e55f059351b8f5f7422f31f7754b48914cad06e67ae272d812b4c1121b7239511adc731c15390118164d3d06a54237446c7e66a8798b696909f0855f03762bddaeb65c2493b113ecc93ca90b80413fb6b9f8774fea9948a095f49d241992d5447a8ca7f15bbb4fe953e99cb82a8162b8ca6bdb7236637aa3562070000000000000000000000000000000000000000000000000000000000000001c940099a10d28af679d043be4cfa54658e539b64d18cbd7f9afd784676a9ba7c4ecff2a9b8113babbff9a79ec4b21c788bf7b7586e04620b55d3847a366e74069fe8a6e94b83249ff6ac72dc3d2e08b5bae79e7f52de36df706705d6c0f626e2fc89b99e0caf3ac0fe9f639da00ef44247505312dfc2554ade13310107e06932028b1ac2205bf4b3c8291c8c36b1533128005f8dfbbead549cee1e14486367665a8948e62d0677ac22fbaf84e08e3a0529d2ad63e8256a13f4be746aca4df546f800e62282c0abee317e78a45421aa28bede3c37ca8789e8496acfba5d412a6b9ad0663d0464be30459dd8a390370f929053d3b8f1b5f7f8b61df1f995488bc95d86dfde580c43173fa9d782eb2af8b4d92ea05b2bef763de09fbf8a41fd545ec462bf0f2a157de6895045dfe61604653d9c6a5fb2a2c35987ab5023fd0b166ac77381c9cac4c091cd648b9e9f0d0e7aa72b3409ea9a80a58f696c586e102277a18e8f436b4cf45a68ff0c4765840d220a45fb5fb568f981c55637003cf9464e41fc3ca9b685280453f16375a20ea8402f577a6ba17f9c4c587810bf24059a7fa355c61e1109dab103606598992fc45427c4d71ece566a6e33a3648f66c1a5265aab8b62962f4655b4dd57157b6d4944795182d9217c890582e7296c439706c3325e77ae9dfc89a99d92e4edba575d0454adbd8ff273a6bb2299e90376dca8a5d15b98cd4462d42f1bfa151e18553b488020a6e43e21a7e04740aa68e066313fb5645671938b7f3388eca40776286453111b63a928a0f14f7412a9871096f8300493ade7ea160dbd180422d43d01429e422d3b575f0aceb4e1eb5fcdf6ffa5c3c899a570cddea3cdda97ae0d243475a46cebd7787b7647be3fe6429eddfbf6cc9af2b9143094cbc991910f4bf21ae1f0219424f9000000000000000000000000"
    };
    const transactionResult = await shieldedUtils.makeAndSendTransaction(
        tronWeb, shieldedTRC20ContractAddress,
        'transfer(bytes32[10][],bytes32[2][],bytes32[9][],bytes32[2],bytes32[21][])',
        options, [], tronWeb.defaultAddress.base58);
    assert.ok(transactionResult);
    assert.ok(transactionResult.result);
    let createTxId = transactionResult.transaction.txID;
    console.log("createTxId: " + createTxId)
    assert.equal(createTxId.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(createTxId);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:" + util.inspect(createInfo))
            break;
        }
    }
    assert.equal(createInfo.receipt.result, "SUCCESS");
}

async function createBurnParams() {
    const options = {
        shieldedParameter: "838d3f8024d506a4d2ab2d1d151842c30e6426e98947f78d65b4cbfb837258674f3c4a5a307096a2a515867c3512d87402700ec30c73f740b0dcc0af94c8b1002bc1c0505355eabb2941483bda3fe55dec9d81e4e448494be201e3051dd3129a64e07f34164ea7a3866d2caca65cdc795c76cf73daa93c7e0825c507d91abcb396e3ae22687701650e5e44eb8ca372fe61ab9cb2c745df4035869715cfcd5ea8cd0c122a2a2e33bde3b34afc6c0eb3bea0d7ea8c00c654cebf09d8318a510af13572f176ba1138f1de786ae9298915589a66a22d16f75638aad20cce2b69cbb705bea5e8026360ddc1f99b655b401b10daa4bc919a5921824214c01f59ec73e07d57a1aca711c8c59fe149dbce1ee4a7ae5abfeda4527204f3b9c4146acd783eebaa594f9487818f5da2cf05f0aff92fdd7ed71f34adbfd0802e91570f4f87585dd984e0e96d2502713fbbb8cec807c32e08ecf702544fbbcc5c66c4b77ee5d95010df3af25841487c454566681567880a9089d83a6a19269bc5dc342703b50c000000000000000000000000000000000000000000000000000000000000000a4dacf9276142969e6a256a65ed17b6a0ddd28b72f86489063f4e084657a45182bff4e77603a1a9e3a2f56d0c62dcb9e2e871ca98efa76e48ab82c89ca08bb1000000000000000000000000415624c12e308b03a1a6b21d9b86e3942fac1ab92b2d45e71add19e02efc1093b01fbe8f6abcf74eea7b8c48f14424c7973a2015706f35719be5063da0d833175ba43dc4cb9c36e61434bf3149ce4ab470e3d61fda92fe66df9794a427e94ea4c8b428c7770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000003e000000000000000000000000000000000000000000000000000000000000000013a6518fb31cc00290ea4a30d4976e3432ffa7525587fbb8af8eb55b497a7ea5ce75d0395fe02551720df9ce74025b712af71fc56065248b2d750bd0bd96aa79af9699c412314e4c14b7529888c414896e84ed4204256c5ea99387a50dcc2821b92aae8e78d07ccc903ab2125c6cb153f459f11b700aa0fc852c1c10e2499bfc10132351a7e092b5abd9f997ff953881d9579f64579708c7767f75aa178916cb955de8f3bebac32fddb68e6fe30d4d860af920c1531fa2e4aa06b2f311c131e3e0236f2ed16189620513dd1b4f78ef4f3ebb886a5e2b12a320bb036101394a03ef96042e2cff92fdf70d68efaf052e9e890f340160c53fed29d45e8a573b829b658ad9c1107e137ac3016525af4bf93c3194cf5262d00f03bb0fd7d525cdfb6a6000000000000000000000000000000000000000000000000000000000000000186992ab4262aac3967db7106ce0b0454e886d4a22ef9cbc100ca5848149c600f6ca27ddc38496a713a46b035a0c68b725471dcc3460b77dcdd6464750be23340ffd081d218acddb9f850f6becd3d0b073ba658c04d3b605b3e4d6933ab6f1c175f68b67a7db4309b697fddbe3804a5cd99ae8ef065cd1d323f6afe50a0dc22ce7d09fa45e8aeec718d7e2a3b485106139e26c853a0c5e065d4c40cc1745e87bae1408ebb3eb794386c97ea2174e4dd649637c061a91629ba8145f68ba5883831eb58ed67f99c6a2485d8012a155ce4e0fcd8ef63d4942c8e9a7673abc723635c526dc0ff3377fce28fa847aab0928b532e013f91f8ebd7ada6f7a59d90cbc91fc8221cd4ce8a23b87d836cdffdd4a551c76beb5df59c93b7ada5ddcfde2f000e0832ff4de48d85f2233a112920f21a14e0a81dea821fb0e52ae70a272146e21b9d6f2fba3c91cedbd822a5d4437f00d8194f6ffc514877c969dd6f9cc500140b9f4a639a6d095beec2b0a5e19ebe2cb61cb1643dcff76aaf79e0a1ccec26d7d9b123057e0c1a4e6390e6ee23c9b1311180bc416c07c06522a75444203905ce884a42dc9ab18532cddc4383329b271a8fbdd50e1942e4088135224ea855868973efd2f8f5129519d7c07f4b47146b9fd21d1a6804ca67475d92e491d299da3f00517a0b73301931af4fb0011253a2ede53ff49ba7d3f3d96379ce85af91a92d90a165d93ae9f1096708af8cfc43ccebf6ce644b994ea43b8e6669d766ba93b8c0111ccd9b446396a8e6bf1ad86c7d6cf5e1cfc971bbbfb2d1855f751d71f414c17d95780f866251323170c4354ae8933c0f05c9beff18ce19db7c45a3f90d12a842a11e753be862639088578cf3672cc2b525c79d1c79b608ee30e6668657d870738fc234f77160ccdc7b4d681ba06561ca78cd5f000000000000000000000000"
    }
    const transactionResult = await shieldedUtils.makeAndSendTransaction(
        tronWeb, shieldedTRC20ContractAddress,
        'burn(bytes32[10],bytes32[2],uint256,bytes32[2],address,bytes32[3],bytes32[9][],bytes32[21][])',
        options, [], tronWeb.defaultAddress.base58);
    console.log(
        "transactionResult: " + util.inspect(transactionResult, true, null,
        true))
    assert.ok(transactionResult && transactionResult.result);
    let createTxId = transactionResult.transaction.txID;
    console.log("createTxId: " + createTxId)
    assert.equal(createTxId.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(createTxId);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:" + util.inspect(createInfo))
            break;
        }
    }
    assert.equal(createInfo.receipt.result, "SUCCESS");
}

async function createBurnParamsWithoutAsk() {
    // makeAndSendTransaction
    options = {
        feeLimit: FEE_LIMIT,
        shieldedParameter: "6ff60819cb4f028fd17dc076a41d9e3f9442ef4c58693ab24517316cf83546809a5da3553948b3f82beda3b2cd45463ea82b924c758c389f54776838de11240b1bac2c4c068c2fd908115d9cb7d67ce12bfbc59938eb489d72af281adf7443251a3a7c136753f9f178a4fd7708efc1a8f91db6eb91596d9586456e4bda72d50ea4cfca09ff2a08dd99dce954ad77adc1e975cf82e19787b1bf047edb25d004a4421d9db05a680be0c303dc1070d6194db1494484e931968b46d1e9262c5b20a54320c61e13b5b4c0c44e730b925ad976709ad2435e3cdfc1129c52b9faa6631a0c784a7e898de4a3735a238630acb930549074b75c5ef10deeeb212e52e813d3985016a6a8d560a3f0feee39c39cfad5b3d57fcdb28b30655e71601eeb27b79b4b799ece1cbe858bb3ad4963926e95de83f13de5543f7b100fab2ec58fff507ed92ce670d7a175898560bdbfc9285d9b014f74b267377e8c0fb0f55f3cc823101b7f731da49970a72499afa356abeeec1abb8cd58cb70a68a03343be56cf8701000000000000000000000000000000000000000000000000000000000000000a11a1fdda6e7b77f80ba8824936304feb6f3db02874d13c51522d2989fc455e65e7da336d09fff1e1783742183f623fa73f486f010a730da37db06752cfb0510c0000000000000000000000415624c12e308b03a1a6b21d9b86e3942fac1ab92b50ce775e3066f989a427f8da0b37e94ddfaf85e4494798a67a1c28b7140f800ec9b352d569c7b9567a0a54340eb5045b3d0182c2b46c0c6cf10e2a41e8a1dd5061cbbd938b916bec0f1612c9f53333910000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000003e0000000000000000000000000000000000000000000000000000000000000000150155e880328831f2f1ac44b0ae09dae96afe2d81cbfd282af1ea217379e24624c2e1f52bc82c63219f7dd914c926652cca89c025c4ddf68949184488b3c6407feb944d7fa269b5ddb70990368f3c72786880139931afbad1852df833b4a56afb8fc5ad27c9e6b93a8432b75e8d7d4e4748da5012cd8944287798c0b2b279ea507df5d9a66ef14b345f432f30fcde75dab381ccc7f75d2c7996b809462c26298b16f37ecda10d2db68a19dc1d61ea83aa219eefd499846c0a031c483374afce917d55cf86003a2a085264572472f8b9fe6a64054936a7c56b6dfd8f45f4d90fb6219a1960c921def82af5b1b952064dfa075d8c2a4e168b216c7b9f7c32508a0bb8482fd8e1cff65a054ca88ce895f2a2d7d2438875a1875d4cc4de1842aae470000000000000000000000000000000000000000000000000000000000000001a8331894f43cb8524a95978831b17d968e65c79193590690ab6c4c96acd083dd294be13ccba4c780d4edd2de57527797a67140fc65024118cdc8964cbc2076bcccac83ada8a42c2445944a5d43a3ef19c80f6d618a0ae2baaa026cd19efdf85eebc3e18a68f249d5ed5af6bf4779715eb4aeef4f00c7214ffd7aa2ba16f19bfc651c16fe675102d4e01eb64ee9bb48f75394cb04d10c33360a442fabb001f67d519c6b8c068a06a8d2e78c857a694f95159f4cd48a6d0bd8d57d0691e10a237bd7927cca11f8636217a6516b09332486570de92261e9a2c98c47ec21d92c964010ce189a96afa7f9fe0c5e46a26a2cd38c12c42a5792de17e9d2063a90384437f586ba1eb541fd313647af5c6e6b0df9baf788aca21658baa542eac52ec076ac4107062c154ce6ef8df4d35903d5ef3e299c6352206810c800bc4873f7905da6909a09183e64e08aff3a650b6cc4ff17f277011bba8f7808ff800dfe22e35c6d14b9be554e7459db16c75825bdf5ebe328e8dbcabcee1e0bae729e2f858dedf3af3cad12ca52a9983e11982392578363d3160cd9559e74957f15c5b6e4a29545e911dacde61e66ccf30ce88b4fe14d02e2b82b39ec9cc59fe12d61e9d58412e3de95f8d5ba5145dfc0aeff23a45ba2e6fba548ebaddf2c85f8ae8f887334951fe495c89959787c4b42c5e2100be12bf825f633aa1d40a2366b2516378e1804ac7026497b9f6655eb1337cf12ddc6fe94c63201288d73d1bcfedb797ce041715677ec09a845f17d689c034af2e41ea5d6ec9a5f8dfce1ed06d46ef66610a16491fb23db2f5a8906102fc0df5bae0b927b3c5af6235e29ad5c24631449e4919bf8285980d0d2730b870c5cedc4a22ffa9dabf628c039e0be0098f58b19351ab51a5ca7a6c63eb00efc66009cd276d34bec9e1ab7c9000000000000000000000000"
    }
    const transactionResult = await shieldedUtils.makeAndSendTransaction(
        tronWeb, shieldedTRC20ContractAddress,
        'burn(bytes32[10],bytes32[2],uint256,bytes32[2],address,bytes32[3],bytes32[9][],bytes32[21][])',
        options, [], tronWeb.defaultAddress.base58);
    assert.ok(transactionResult && transactionResult.result);
    let createTxId = transactionResult.transaction.txID;
    console.log("createTxId: " + createTxId)
    assert.equal(createTxId.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(createTxId);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:" + util.inspect(createInfo))
            break;
        }
    }
    assert.equal(createInfo.receipt.result, "SUCCESS");
}

async function ztronTestAll(){
    await before();
    await createMintParams();
    // await createMintParamsWithoutAsk();
    // await createTransferParams();
    // await createTransferParamsWithoutAsk();
    // await createBurnParams();
    // await createBurnParamsWithoutAsk();
}
export{
    ztronTestAll
}

