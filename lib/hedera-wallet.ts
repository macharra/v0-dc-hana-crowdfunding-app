import { Client, PrivateKey, AccountId, TransferTransaction, Hbar, AccountBalanceQuery } from "@hashgraph/sdk"

interface WalletConfig {
  accountId: string
  privateKey: string
  network: "testnet" | "mainnet"
}

export class HederaWallet {
  private client: Client
  private accountId: AccountId
  private privateKey: PrivateKey

  constructor(config: WalletConfig) {
    this.accountId = AccountId.fromString(config.accountId)
    this.privateKey = PrivateKey.fromStringED25519(config.privateKey)

    // Initialize Hedera client
    if (config.network === "testnet") {
      this.client = Client.forTestnet()
    } else {
      this.client = Client.forMainnet()
    }

    this.client.setOperator(this.accountId, this.privateKey)
  }

  /**
   * Send HBAR to a recipient account
   */
  async sendHbar(recipientAccountId: string, amount: number): Promise<string> {
    try {
      const transaction = new TransferTransaction()
        .addHbarTransfer(this.accountId, Hbar.fromTinybars(-amount * 100000000)) // Convert HBAR to tinybars
        .addHbarTransfer(AccountId.fromString(recipientAccountId), Hbar.fromTinybars(amount * 100000000))
        .freezeWith(this.client)

      const signTx = await transaction.sign(this.privateKey)
      const txResponse = await signTx.execute(this.client)
      const receipt = await txResponse.getReceipt(this.client)

      return txResponse.transactionId.toString()
    } catch (error) {
      console.error("[Hedera Wallet] Transaction failed:", error)
      throw new Error("Failed to send HBAR")
    }
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<number> {
    try {
      const query = new AccountBalanceQuery().setAccountId(this.accountId)

      const balance = await query.execute(this.client)
      return balance.hbars.toTinybars().toNumber() / 100000000 // Convert tinybars to HBAR
    } catch (error) {
      console.error("[Hedera Wallet] Failed to get balance:", error)
      throw new Error("Failed to retrieve account balance")
    }
  }

  /**
   * Close the client connection
   */
  close(): void {
    this.client.close()
  }
}
