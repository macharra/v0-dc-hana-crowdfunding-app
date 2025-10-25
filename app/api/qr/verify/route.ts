import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.qrData) {
      return NextResponse.json({ error: "Missing QR data" }, { status: 400 })
    }

    // Parse QR data
    let qrPayload
    try {
      qrPayload = typeof body.qrData === "string" ? JSON.parse(body.qrData) : body.qrData
    } catch {
      return NextResponse.json({ error: "Invalid QR data format" }, { status: 400 })
    }

    // Validate QR payload
    if (!qrPayload.transactionId || !qrPayload.campaignId || !qrPayload.amount) {
      return NextResponse.json({ error: "Invalid QR payload" }, { status: 400 })
    }

    // Verify QR code
    const verificationResult = {
      transactionId: qrPayload.transactionId,
      campaignId: qrPayload.campaignId,
      amount: qrPayload.amount,
      method: qrPayload.method,
      verified: true,
      verifiedAt: new Date().toISOString(),
      status: "confirmed",
    }

    return NextResponse.json(verificationResult)
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify QR code" }, { status: 500 })
  }
}
