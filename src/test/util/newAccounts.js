import publicMethod from './PublicMethod.js';
const amount = process.argv[2] || 10;

(async function () {
    try {
        await publicMethod.newSideTestAccounts(amount)
    } catch (e) {
        console.log("e.message:"+e.message)
    }

})()

