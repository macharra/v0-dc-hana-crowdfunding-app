import { type NextRequest, NextResponse } from "next/server"
import { HederaWallet } from "@/lib/hedera-wallet"

export async function GET(request: NextRequest) {
  try {
    const accountId = process.env.HEDERA_ACCOUNT_ID
    const privateKey = process.env.HEDERA_PRIVATE_KEY
    const network = process.env.HEDERA_NETWORK || "testnet"

    if (!accountId || !privateKey) {
      return NextResponse.json({ error: "Hedera credentials not configured" }, { status: 500 })
    }

    const wallet = new HederaWallet({
      accountId,
      privateKey,
      network: network as "testnet" | "mainnet",
    })

    const balance = await wallet.getBalance()
    wallet.close()

    return NextResponse.json({ balance, accountId }, { status: 200 })
  } catch (error) {
    console.error("Balance check error:", error)
    return NextResponse.json({ error: "Failed to retrieve balance" }, { status: 500 })
  }
}
