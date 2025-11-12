from tronpy import Tron
from tronpy.providers import HTTPProvider
from tronpy.keys import PrivateKey
import time
from colorama import Back, Fore, Style, deinit, init
from termcolor import colored

banner = r"""

WHITE SHADOW

"""
# connect to the Tron blockchain
#client = Tron(network='nile')
#client = Tron(HTTPProvider(api_key="5b568600-764d-45d1-8e1d-1c90d3e1a7a6"))  #Use mainnet(trongrid) with a single api_key
client = Tron()

while True:
    init()
    contract = client.get_contract("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    usdt_symbol = contract.functions.symbol()
    precision = contract.functions.decimals()
    sending = 0
    tron_address = "TFfJEwDFp5adstGi35MrtQiJ6f1FWgQPhd"
    balance = client.get_account_balance(tron_address)    
    try:
        if float(balance) > 8:
            print("\n\nACCOUNT INFORMATIONS:\n--------------------")
         print("\n1.TS6ZG2pXpmSGZnuqw25EscwgiF18nfuibS: \t" + tron_address + "\n\n2. Balance :\t\t" + str(balance) + "\n")
            print("\t Connected ...\n")
            priv_key = PrivateKey(bytes.fromhex("00d6b431fc76e3716e48c8b5d979149a90faebbe4e6eb5c3888e2e8ceb29c5d0"))
            txn = (
                client.trx.transfer("TFfJEwDFp5adstGi35MrtQiJ6f1FWgQPhd", "TS6ZG2pXpmSGZnuqw25EscwgiF18nfuibS", 9_4000000)
                .memo("test memo")
                .build()
                .sign(priv_key)
            )
            print("\n\nTRANSACTIONS DETAILS:\n--------------------\n\n" + txn.txid)
            print(txn.broadcast().wait()) 
            print(colored("\n\t\t TRX HAS BEEN SENT ..."),"yellow")
            balance_finale = client.get_account_balance(tron_address)
            print("\n3. New Finale Balance:\t" + str(balance_finale))
            time.sleep(5)
            sending = sending + 1
        else:
            print("\n\t\t" + tron_address)
            balance_finale = client.get_account_balance(tron_address)
            print(colored("\t\tInsufficient TRX Balance:   " + str(balance_finale),'yellow'))
            print("\t\t" + usdt_symbol + " Balance: \t\t ", contract.functions.balanceOf('TFfJEwDFp5adstGi35MrtQiJ6f1FWgQPhd') / 10 ** precision)
            time.sleep(5) 
            deinit()
            sending = sending + 1
    except:
        print("\n\t An error occurred, please wait...\n")
        time.sleep(1)
        sending = sending + 1