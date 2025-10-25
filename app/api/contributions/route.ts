import { type NextRequest, NextResponse } from "next/server"

// Mock database for contributions
const contributions: Array<{
  id: string
  campaignId: string
  amount: number
  contributorEmail: string
  transactionId: string
  status: string
  createdAt: string
}> = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")

    if (campaignId) {
      // Get contributions for a specific campaign
      const campaignContributions = contributions.filter((c) => c.campaignId === campaignId)
      return NextResponse.json(campaignContributions)
    }

    // Get all contributions
    return NextResponse.json(contributions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.campaignId || !body.amount || !body.contributorEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    // Create new contribution
    const newContribution = {
      id: `CONTRIB-${Date.now()}`,
      campaignId: body.campaignId,
      amount: body.amount,
      contributorEmail: body.contributorEmail,
      transactionId: body.transactionId || `TX-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    contributions.push(newContribution)

    return NextResponse.json(newContribution, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create contribution" }, { status: 500 })
  }
}
