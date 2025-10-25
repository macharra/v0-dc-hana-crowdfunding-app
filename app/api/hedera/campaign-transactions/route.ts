import { type NextRequest, NextResponse } from "next/server"
import { getHederaClient } from "@/lib/hedera-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")

    if (!campaignId) {
      return NextResponse.json({ error: "Missing campaignId parameter" }, { status: 400 })
    }

    // Get Hedera client
    const hederaClient = getHederaClient()

    // Get campaign transactions
    const transactions = await hederaClient.getCampaignTransactions(campaignId)

    return NextResponse.json({
      campaignId,
      transactionCount: transactions.length,
      transactions,
    })
  } catch (error) {
    console.error("Hedera campaign transactions error:", error)
    return NextResponse.json({ error: "Failed to fetch campaign transactions" }, { status: 500 })
  }
}
