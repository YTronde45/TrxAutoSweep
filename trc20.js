白影-568, [09/11/2025 04:32]
require('dotenv').config();
const TronWeb = require('tronweb');

const privateKey = process.env.PRIVATE_KEY;
const toAddress = process.env.TO_ADDRESS;
const contractAddress = process.env.CONTRACT_ADDRESS;
const humanAmount = process.env.AMOUNT; // e.g., "69000"

if (!privateKey  !toAddress  !contractAddress || !humanAmount) {
  console.error("Missing env variables. Check PRIVATE_KEY, TO_ADDRESS, CONTRACT_ADDRESS, AMOUNT");
  process.exit(1);
}

const tronWeb = new TronWeb({
  fullHost: process.env.FULLNODE || 'https://api.trongrid.io',
  privateKey: privateKey
});

// Helper: ensure hex contract address starts with 0x for tronweb contract calls if needed
async function run() {
  try {
    // Convert contract address if necessary
    // TronWeb accepts hex address (with 0x) or base58. If your contract is raw hex (starts with 41...), TronWeb can accept it as-is.
    const contract = await tronWeb.contract().at(contractAddress);

    // Read decimals to compute smallest units
    const decimals = await contract.decimals().call().then(r => r.toNumber ? r.toNumber() : Number(r));
    console.log("Token decimals:", decimals);

    // Calculate amount in smallest units
    const amountInUnits = BigInt(humanAmount) * (BigInt(10) ** BigInt(decimals));
    console.log("Amount in token smallest units:", amountInUnits.toString());

    // Build transfer transaction (TRC20 transfer signature)
    // ERC20-like transfer: transfer(to, value)
    const tx = await contract.transfer(tronWeb.address.toHex(toAddress), amountInUnits.toString()).send({
      feeLimit: 1_000_000_000  // adjust if needed (in sun). For TRC20 may require extra energy; tweak as needed.
    });

    console.log("Transaction result (broadcast):", tx);
    console.log("If tx has 'txid' you can check it on TronScan/trongrid.");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();

白影-568, [09/11/2025 04:32]
node transfer_trc20.js