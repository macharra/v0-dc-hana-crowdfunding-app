import { type NextRequest, NextResponse } from "next/server"
import { HederaWallet } from "@/lib/hedera-wallet"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.amount || !body.recipientAccountId || !body.transactionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get Hedera credentials from environment
    const accountId = process.env.HEDERA_ACCOUNT_ID
    const privateKey = process.env.HEDERA_PRIVATE_KEY
    const network = process.env.HEDERA_NETWORK || "testnet"

    if (!accountId || !privateKey) {
      return NextResponse.json({ error: "Hedera credentials not configured" }, { status: 500 })
    }

    // Initialize wallet
    const wallet = new HederaWallet({
      accountId,
      privateKey,
      network: network as "testnet" | "mainnet",
    })

    // Send payment
    const hederaTxId = await wallet.sendHbar(body.recipientAccountId, body.amount)

    // Close wallet connection
    wallet.close()

    return NextResponse.json(
      {
        success: true,
        transactionId: body.transactionId,
        hederaTransactionId: hederaTxId,
        amount: body.amount,
        status: "confirmed",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Hedera payment error:", error)
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}
