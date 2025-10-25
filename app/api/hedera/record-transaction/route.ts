import { type NextRequest, NextResponse } from "next/server"
import { getHederaClient } from "@/lib/hedera-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.transactionId || !body.campaignId || !body.amount || !body.contributor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get Hedera client
    const hederaClient = getHederaClient()

    // Record transaction on Hedera
    const record = await hederaClient.recordContribution(
      body.transactionId,
      body.campaignId,
      body.amount,
      body.contributor,
    )

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error("Hedera transaction error:", error)
    return NextResponse.json({ error: "Failed to record transaction on Hedera" }, { status: 500 })
  }
}
