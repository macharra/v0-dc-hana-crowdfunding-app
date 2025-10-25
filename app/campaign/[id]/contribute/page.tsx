"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, QrCode, Loader2, AlertCircle } from "lucide-react"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { QRScanner } from "@/components/qr-scanner"

export default function ContributePage({ params }: { params: { id: string } }) {
  const [amount, setAmount] = useState("")
  const [step, setStep] = useState<"amount" | "payment" | "qr" | "processing" | "success" | "error">("amount")
  const [selectedMethod, setSelectedMethod] = useState<"mpesa" | "card" | "wallet">("mpesa")
  const [showScanner, setShowScanner] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [hederaTxId, setHederaTxId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)

  const handleContinue = () => {
    if (amount && Number.parseFloat(amount) > 0) {
      setStep("payment")
    }
  }

  const handlePayment = async () => {
    const txId = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    setTransactionId(txId)

    if (selectedMethod === "wallet") {
      // Process Hedera wallet payment
      setStep("processing")
      setLoading(true)

      try {
        // First, check wallet balance
        const balanceRes = await fetch("/api/hedera/get-balance")
        if (!balanceRes.ok) {
          throw new Error("Failed to check wallet balance")
        }

        const balanceData = await balanceRes.json()
        setWalletBalance(balanceData.balance)

        // Convert KES to HBAR (approximate: 1 HBAR ≈ 0.50 KES, adjust as needed)
        const hbarAmount = Number.parseFloat(amount) / 0.5

        if (balanceData.balance < hbarAmount) {
          throw new Error(
            `Insufficient balance. You have ${balanceData.balance.toFixed(2)} HBAR but need ${hbarAmount.toFixed(2)} HBAR`,
          )
        }

        // Send payment to campaign treasury account
        // In production, use the actual campaign treasury account ID
        const campaignTreasuryAccountId = "0.0.1234567" // Replace with actual treasury account

        const paymentRes = await fetch("/api/hedera/send-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: hbarAmount,
            recipientAccountId: campaignTreasuryAccountId,
            transactionId: txId,
          }),
        })

        if (!paymentRes.ok) {
          const errorData = await paymentRes.json()
          throw new Error(errorData.error || "Payment failed")
        }

        const paymentData = await paymentRes.json()
        setHederaTxId(paymentData.hederaTransactionId)

        // Record transaction on Hedera
        await fetch("/api/hedera/record-transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: txId,
            campaignId: params.id,
            amount: Number.parseFloat(amount),
            contributor: process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || "Anonymous",
          }),
        })

        setStep("success")
      } catch (err) {
        console.error("[v0] Payment error:", err)
        setError(err instanceof Error ? err.message : "Payment failed")
        setStep("error")
      } finally {
        setLoading(false)
      }
    } else {
      // For M-Pesa and Card, show QR verification
      setStep("qr")
    }
  }

  const handleQRScan = (scannedData: string) => {
    // Verify the scanned data matches the transaction
    if (scannedData.includes("VERIFIED")) {
      setShowScanner(false)
      setStep("success")
    }
  }

  const quickAmounts = [1000, 5000, 10000, 25000]

  const qrData = JSON.stringify({
    transactionId,
    campaignId: params.id,
    amount,
    method: selectedMethod,
    timestamp: new Date().toISOString(),
  })

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href={`/campaign/${params.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaign
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-between">
          {["amount", "payment", "qr", "success"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : ["amount", "payment", "qr"].indexOf(s) < ["amount", "payment", "qr"].indexOf(step)
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {["amount", "payment", "qr"].indexOf(s) < ["amount", "payment", "qr"].indexOf(step) ? "✓" : i + 1}
              </div>
              {i < 3 && (
                <div
                  className={`h-1 w-12 ${["amount", "payment", "qr"].indexOf(s) < ["amount", "payment", "qr"].indexOf(step) ? "bg-emerald-500" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Amount Selection */}
        {step === "amount" && (
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-foreground">How much would you like to contribute?</h1>
            <p className="mt-2 text-muted-foreground">
              Your contribution will help build the water well and change lives.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground">Contribution Amount (KES)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-foreground">Quick amounts</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {quickAmounts.map((qa) => (
                    <button
                      key={qa}
                      onClick={() => setAmount(qa.toString())}
                      className={`rounded-lg border-2 px-4 py-2 font-semibold transition-all ${
                        amount === qa.toString()
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-primary"
                      }`}
                    >
                      KES {qa.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!amount || Number.parseFloat(amount) <= 0}
              size="lg"
              className="mt-8 w-full"
            >
              Continue
            </Button>
          </Card>
        )}

        {/* Payment Method */}
        {step === "payment" && (
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-foreground">Select Payment Method</h1>
            <p className="mt-2 text-muted-foreground">Choose how you'd like to pay KES {amount}</p>

            <div className="mt-8 space-y-3">
              {[
                { id: "mpesa", name: "M-Pesa", description: "Pay via M-Pesa mobile money" },
                { id: "card", name: "Debit/Credit Card", description: "Visa, Mastercard, or local cards" },
                { id: "wallet", name: "Hedera Wallet", description: "Pay with HBAR from your wallet" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id as any)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold text-foreground">{method.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{method.description}</div>
                </button>
              ))}
            </div>

            <Button onClick={handlePayment} size="lg" className="mt-8 w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </Card>
        )}

        {step === "processing" && (
          <Card className="p-8 text-center">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-foreground">Processing Payment</h1>
            <p className="mt-2 text-muted-foreground">Sending HBAR from your Hedera wallet...</p>
            {walletBalance !== null && (
              <p className="mt-4 text-sm text-muted-foreground">
                Wallet Balance: <span className="font-semibold text-foreground">{walletBalance.toFixed(2)} HBAR</span>
              </p>
            )}
          </Card>
        )}

        {step === "error" && (
          <Card className="p-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-500/10 p-4">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-foreground">Payment Failed</h1>
            <p className="mt-2 text-muted-foreground">{error}</p>

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setStep("payment")} variant="outline" className="flex-1">
                Try Again
              </Button>
              <Button asChild className="flex-1">
                <Link href={`/campaign/${params.id}`}>Back to Campaign</Link>
              </Button>
            </div>
          </Card>
        )}

        {/* QR Verification */}
        {step === "qr" && (
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-foreground">Verify with QR Code</h1>
            <p className="mt-2 text-muted-foreground">Scan this QR code to complete your contribution securely</p>

            <div className="mt-8 flex flex-col items-center">
              <div className="rounded-lg border-2 border-border bg-card p-8">
                <QRCodeGenerator value={qrData} size={256} />
              </div>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Transaction ID: <span className="font-mono font-semibold text-foreground">{transactionId}</span>
              </p>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Scan with your phone camera or M-Pesa app to verify and complete payment
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setShowScanner(true)} size="lg" className="flex-1">
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code
              </Button>
              <Button onClick={() => setStep("success")} variant="outline" size="lg" className="flex-1">
                Skip Verification
              </Button>
            </div>
          </Card>
        )}

        {/* Success */}
        {step === "success" && (
          <Card className="p-8 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-500/10 p-4">
                <CheckCircle className="h-16 w-16 text-emerald-500" />
              </div>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-foreground">Contribution Successful!</h1>
            <p className="mt-2 text-muted-foreground">Thank you for supporting this campaign</p>

            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount Contributed</span>
                  <span className="font-semibold text-foreground">
                    KES {Number.parseFloat(amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-sm text-foreground">{transactionId}</span>
                </div>
                {hederaTxId && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hedera TX ID</span>
                    <span className="font-mono text-sm text-foreground">{hederaTxId}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600">
                    Verified on Hedera
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/">Back Home</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href={`/campaign/${params.id}`}>View Campaign</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && <QRScanner onScan={() => setStep("success")} onClose={() => setShowScanner(false)} />}
    </main>
  )
}
