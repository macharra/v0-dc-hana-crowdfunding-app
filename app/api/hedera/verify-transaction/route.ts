import { type NextRequest, NextResponse } from "next/server"
import { getHederaClient } from "@/lib/hedera-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transactionId parameter" }, { status: 400 })
    }

    // Get Hedera client
    const hederaClient = getHederaClient()

    // Verify transaction
    const record = await hederaClient.verifyTransaction(transactionId)

    if (!record) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error("Hedera verification error:", error)
    return NextResponse.json({ error: "Failed to verify transaction" }, { status: 500 })
  }
}
