"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Heart, Share2, Users, Calendar, MapPin, TrendingUp } from "lucide-react"
import { HederaBadge } from "@/components/hedera-badge"

interface CampaignDetail {
  id: string
  title: string
  description: string
  fullDescription: string
  goal: number
  raised: number
  contributors: number
  image: string
  category: string
  status: "active" | "completed" | "pending"
  progress: number
  location: string
  createdBy: string
  createdDate: string
  milestones: Array<{
    id: string
    title: string
    amount: number
    description: string
    status: "pending" | "completed"
  }>
}

const mockCampaignDetail: CampaignDetail = {
  id: "1",
  title: "Community Water Well - Nairobi",
  description: "Building a sustainable water source for 500+ families",
  fullDescription: `This campaign aims to build a sustainable water well in the Nairobi community. The project will provide clean drinking water to over 500 families who currently walk 5+ kilometers daily to fetch water.

The well will be equipped with solar-powered pumps and a water storage tank. We're also training local community members to maintain the system for long-term sustainability.

All funds are tracked transparently on the blockchain, and milestone-based payouts ensure accountability at every stage of construction.`,
  goal: 50000,
  raised: 38500,
  contributors: 234,
  image: "/water-well-community-project.jpg",
  category: "Infrastructure",
  status: "active",
  progress: 77,
  location: "Nairobi, Kenya",
  createdBy: "Community Leaders Association",
  createdDate: "2025-01-15",
  milestones: [
    {
      id: "1",
      title: "Land Preparation & Permits",
      amount: 5000,
      description: "Secure land and obtain necessary permits",
      status: "completed",
    },
    {
      id: "2",
      title: "Well Drilling",
      amount: 20000,
      description: "Professional drilling and testing",
      status: "completed",
    },
    {
      id: "3",
      title: "Solar System Installation",
      amount: 15000,
      description: "Install solar panels and pumping system",
      status: "pending",
    },
    {
      id: "4",
      title: "Storage Tank & Training",
      amount: 10000,
      description: "Build storage tank and train maintenance team",
      status: "pending",
    },
  ],
}

export default function CampaignDetail({ params }: { params: { id: string } }) {
  const [campaign] = useState<CampaignDetail>(mockCampaignDetail)
  const [liked, setLiked] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Image */}
        <div className="relative overflow-hidden rounded-lg border border-border">
          <img src={campaign.image || "/placeholder.svg"} alt={campaign.title} className="h-96 w-full object-cover" />
          <div className="absolute right-4 top-4 flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="rounded-full bg-background/80 p-2 backdrop-blur transition-colors hover:bg-background"
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-foreground"}`} />
            </button>
            <button className="rounded-full bg-background/80 p-2 backdrop-blur transition-colors hover:bg-background">
              <Share2 className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {campaign.category}
              </div>
              <h1 className="mt-4 text-4xl font-bold text-foreground">{campaign.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{campaign.description}</p>
            </div>

            {/* Campaign Info */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="mt-1 flex items-center gap-2 font-semibold text-foreground">
                  <MapPin className="h-4 w-4" />
                  {campaign.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="mt-1 flex items-center gap-2 font-semibold text-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(campaign.createdDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contributors</p>
                <p className="mt-1 flex items-center gap-2 font-semibold text-foreground">
                  <Users className="h-4 w-4" />
                  {campaign.contributors}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">By</p>
                <p className="mt-1 font-semibold text-foreground">{campaign.createdBy}</p>
              </div>
            </div>

            {/* Full Description */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground">About this campaign</h2>
              <p className="mt-4 whitespace-pre-wrap text-muted-foreground">{campaign.fullDescription}</p>
            </div>

            {/* Milestones */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground">Milestones</h2>
              <div className="mt-6 space-y-4">
                {campaign.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full font-semibold text-white ${
                          milestone.status === "completed" ? "bg-emerald-500" : "bg-muted"
                        }`}
                      >
                        {milestone.status === "completed" ? "✓" : index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{milestone.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
                        <p className="mt-2 font-semibold text-primary">KES {milestone.amount.toLocaleString()}</p>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          milestone.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {milestone.status === "completed" ? "Completed" : "Pending"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 p-6">
              <div className="space-y-6">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">KES {campaign.raised.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">{campaign.progress}%</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">of KES {campaign.goal.toLocaleString()} goal</p>
                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>

                {/* Contribute Button */}
                <Button size="lg" className="w-full" asChild>
                  <Link href={`/campaign/${campaign.id}/contribute`}>Contribute Now</Link>
                </Button>

                {/* Stats */}
                <div className="space-y-3 border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contributors</span>
                    <span className="font-semibold text-foreground">{campaign.contributors}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Days Left</span>
                    <span className="font-semibold text-foreground">45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">
                      Active
                    </span>
                  </div>
                </div>

                {/* Blockchain Info */}
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">Verified on Hedera</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    All transactions are recorded on the Hedera Consensus Service for complete transparency.
                  </p>
                </div>

                <HederaBadge transactionId={campaign.id} verified={true} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
