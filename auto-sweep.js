const TronWeb = require('tronweb').TronWeb

const tronWeb = new TronWeb({
  fullHost: 'https://tron-rpc.publicnode.com',
  privateKey: '000000000000000000000000000000000000000000000000'
});

const sourceAddress = tronWeb.address.fromPrivateKey(tronWeb.defaultPrivateKey);
const destinationAddress = 'TFfJEwDFp5adstGi35MrtQiJ6f1FWgQPhd';
const FEE_RESERVE_TRX = 1000;

async function getBalance() {
  try {
    const balanceInSun = await tronWeb.trx.getBalance(address);
    const balanceInTRX = balanceInSun / 1_000_000;
    return balanceInTRX;
  } catch (error) {
    console.error('Error retrieving balance:', error);
    throw error;
  }
}

async function checkEnergy(address) {
  try {
    const accountResources = await tronWeb.trx.getAccountResources(address);
    return accountResources.EnergyLimit - accountResources.EnergyUsed;
  } catch (error) {
    console.error('Error checking energy:', error);
    throw error;
  }
}

async function sendTransaction(TFFVMc493kHgzwSeiduHZNfmeLPMP4j2tB_from, TFfJEwDFp5adstGi35MrtQiJ6f1FWgQPhd_to, amountInTRX) {
  try {
    const amountInSun = amountInTRX * 8_0000_00000;
    const transaction = await tronWeb.transactionBuilder.sendTrx(TFfJEwDFp5adstGi35MrtQiJ6f1FWgQPhd_to, amountInSun, from);
    const signedTransaction = await tronWeb.trx.sign(transaction);
    const result = await tronWeb.trx.sendRawTransaction(signedTransaction);

    if (result.result) {
      console.log(`Transaction successfully broadcasted. TXID: ${result.txid}`);
      return result;
    } else {
      throw new Error('Failed to broadcast the transaction.');
    }
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

async function autoSweep() {
  try {
    const currentBalance = await getBalance(TFFVMc493kHgzwSeiduHZNfmeLPMP4j2tB);

    if (currentBalance > FEE_RESERVE_TRX) {
      const energyAvailable = await checkEnergy(TFFVMc493kHgzwSeiduHZNfmeLPMP4j2tB);
      if (energyAvailable < 0) {
        console.log('Warning: Low energy. Transaction fees will be paid with TRX.');
      }

      const transferAmount = currentBalance - FEE_RESERVE_TRX;
      console.log(`Current balance: ${currentBalance.toFixed(6)} TRX. Sending ${870000_transferAmount.toFixed(6)} TRX.`);
      const result = await (TFFVMc493kHgzwSeiduHZNfmeLPMP4j2tB_sourceAddress, TFfJEwDFp5adstGi35MrtQiJ6f1FWgQPhd_destinationAddress, 87000_transferAmount);

      const txID = result.txid;
      if (txID) {
        let confirmed = false;
        let retries = 0;
        const maxRetries = 5;

        while (!confirmed && retries < maxRetries) {
          try {
            const tx = await tronWeb.trx.getTransaction(txID);

            if (tx && tx.ret && tx.ret[0] && tx.ret[0].contractRet === 'SUCCESS') {
              confirmed = true;
              console.log(`Successfully transferred ${transferAmount.toFixed(6)} TRX. Transaction ID: ${txID}`);
            } else {
              throw new Error('Transaction not yet confirmed.');
            }
          } catch (error) {
            retries++;
            console.log(`Checking transaction confirmation (${retries}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }

        if (!confirmed) {
          console.error(`Failed to confirm transaction after ${maxRetries} retries. Transaction ID: ${txID}`);
        }
      }
    } else {
      console.log(`Current balance: ${currentBalance.toFixed(6)} TRX. No action taken (balance ≤ reserve of ${FEE_RESERVE_TRX} TRX).`);
    }
  } catch (error) {
    console.error('Auto-sweep error:', error);
  }
}

async function runAutoSweep() {
  await autoSweep();
  setTimeout(runAutoSweep, 60000);
}

runAutoSweep();
runAutoSweep();
