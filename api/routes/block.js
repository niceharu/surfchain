var express = require('express');
var router = express.Router();
const Web3 = require('web3');

const web3 = new Web3(process.env.ETHEREUM_URL || 'http://localhost:8545');
const default_account = process.env.ETHEREUM_ACCOUNT || '0x3c1bcAd30d646265E5aAFC7145295f84cA88e700';
// const default_pwd = process.env.ETHEREUM_PASSWORD;
const contractAddr = process.env.CONTRACT_ADDR || '0x2D85432dDD83cbD1BD1dcbA7333A47258AAd5043';
const DocumentFactory = require('../contracts/artifacts/DocumentFactory.json');

/* index page */
router.get('/', async function(req, res, next) {
    res.render('index', { title: 'blockchain api' });
});

/* 유저 목록 가져오기 */
router.post('/users', async function(req, res, next) {
    try {
        const result = await web3.eth.getAccounts();
        return res.json({ success: true, result: result })
    }catch(e) {
        console.log(e)
        return res.json({ success: false, message: 'fail' })
    }
});
  
/* 계좌 조회 */
router.post('/user', async function(req, res, next) {
    const user = req.body.user

    if (!user) {
        return res.json({ success: false, message: "input value not enough!" })
    } 

    try {
        const result = await web3.eth.getBalance(user);
        return res.json({ success: true, result: result })
    }catch(e) {
        console.log(e)
        return res.json({ success: false, message: 'fail' })
    }
});

/* 금액 전송 */
router.post('/transfer', async function(req, res, next) {

    const from = req.body.from
    const from_pwd = req.body.from_pwd
    const to = req.body.to
    const value = req.body.value

    if (!from || !to || !value) {
        return res.json({ success: false, message: "input value not enough!" })
    } 

    try {
        // 계정 Unlock
        await web3.eth.personal.unlockAccount(from, from_pwd, 600).then(console.log('Account unlocked!'));

        // 전송
        const result = await web3.eth.sendTransaction({
        from: from,
        gasPrice: "20000000000",
        gas: "21000",
        to: to,
        value: value,
        data: ""
        }, from_pwd);

        return res.json({ success: true, result: result })

    }catch(e) {
        console.log(e)
        return res.json({ success: false, message: 'fail' })
    }

});

/* 데이터 저장하기 */
router.post('/saveDocHash', async function(req, res, next) {

    const docHash = req.body.docHash
    if (!docHash) {
        return res.json({ success: false, message: "input value not enough!" })
    } 

    try {
        // 기본 계정 설정 및 UnLock
        web3.eth.defaultAccount = default_account;
        // await web3.eth.personal.unlockAccount(default_account, default_pwd, 600).then(console.log('Account unlocked!'));

        // Contract 지정
        var documentFactory = new web3.eth.Contract(DocumentFactory.abi, contractAddr, {
        from: default_account, // default from address
        gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case 20000000000
        });

        // 저장
        const result = await documentFactory.methods.store(docHash).send();
        console.log(result);
        return res.json({ success: true, result: result })

    }catch(e) {
        console.log(e)
        return res.json({ success: false, message: 'fail' })
    }

});

/* 데이터 가져오기 */
router.post('/docHashList', async function(req, res, next) {

    try {
        // Set Contract 
        var documentFactory = new web3.eth.Contract(DocumentFactory.abi, contractAddr);
        
        // 불러오기 (불러오기의 경우 계정 설정은 필요없다. 가스 소진 없음)
        const result = await documentFactory.methods.retrieve().call();
        console.log(result);

        return res.json({ success: true, result: result })

    }catch(e) {
        console.log(e)
        return res.json({ success: false, message: 'fail' })
    }

});


/* 데이터 존재여부 확인 */
router.post('/existDocHash', async function(req, res, next) {

    const docHash = req.body.docHash
    if (!docHash) {
        return res.json({ success: false, message: "input value not enough!" })
    } 

    try {
        // Set Contract 
        var documentFactory = new web3.eth.Contract(DocumentFactory.abi, contractAddr);
        
        // 불러오기 (불러오기의 경우 계정 설정은 필요없다. 가스 소진 없음)
        const result = await documentFactory.methods.exist(docHash).call();
        console.log(result);

        return res.json({ success: true, result: result })

    }catch(e) {
        console.log(e)
        return res.json({ success: false, message: 'fail' })
    }

});

/* 블록 정보 가져오기 */
router.post('/blockInfo', async function(req, res, next) {

    const blockHash = req.body.blockHash
    if (!blockHash) {
        return res.json({ success: false, message: "input value not enough!" })
    } 

    try {
        const result = await web3.eth.getBlock(blockHash);
        return res.json({ success: true, result: result })

    }catch(e) {
        console.log(e)
        return res.json({ success: false, message: 'fail' })
    }

});

/* 트랜잭션 정보 가져오기 */
router.post('/transactionInfo', async function(req, res, next) {

    const transactionHash = req.body.transactionHash
    if (!transactionHash) {
        return res.json({ success: false, message: "input value not enough!" })
    } 

    try {
        const result = await web3.eth.getTransaction(transactionHash);
        return res.json({ success: true, result: result })

    }catch(e) {
        console.log(e)
        return res.json({ success: false, message: 'fail' })
    }

});


/* 스마트컨트랙트 배포 */
router.post('/deployContract', async function(req, res, next) {

    try {
        let bytecode = DocumentFactory.data.bytecode.object;
        const MyContract = new web3.eth.Contract(DocumentFactory.abi);

        // await web3.eth.personal.unlockAccount(default_account, default_pwd, 600).then(console.log('Account unlocked!'));

        const deploy = await MyContract.deploy({
        data : '0x' + bytecode
        }).send({
            from : web3.utils.toHex(default_account),
            gas: web3.utils.toHex(1000000),
            gasPrice : web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
        }, (err, transactionHash) =>{
            console.info('transactionHash', transactionHash);
        }).on('error', (error)=>{
            console.info('error', error);
        }).on('transactionHash', (transactionHash) =>{
            console.info('transactionHash', transactionHash);
        }).on('receipt', (receipt) =>{
            console.info('receipt', receipt);
            return res.json({ success: true, result: receipt })
        }).on('confirmation', (confirmation) =>{
            console.info('confirmation', confirmation);
        }).then((newContractInstance) =>{
            console.info('newContractInstance', newContractInstance);
        });


    }catch(e) {
        console.log(e)
        return res.json({ success: false, message: 'fail' })
    }

});
  
  
/* 트랜잭션 정보 가져오기 */
router.post('/gasLimit', async function(req, res, next) {
  
    try {
      web3.eth.getBlock("latest", false, (error, result) => {
        console.log(result?.gasLimit)
        return res.json({ success: true, result: result?.gasLimit })
      });
  
    }catch(e) {
      console.log(e)
      return res.json({ success: false, message: 'fail' })
    }
  
});

module.exports = router;