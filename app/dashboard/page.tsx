"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, Users, DollarSign, CheckCircle } from "lucide-react"

export default function Dashboard() {
  const campaigns = [
    {
      id: "1",
      title: "Community Water Well - Nairobi",
      status: "active",
      raised: 38500,
      goal: 50000,
      contributors: 234,
    },
    {
      id: "2",
      title: "School Renovation Project",
      status: "completed",
      raised: 75000,
      goal: 75000,
      contributors: 412,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage your campaigns and track contributions</p>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="mt-2 text-2xl font-bold text-foreground">KES 113.5M</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="mt-2 text-2xl font-bold text-foreground">2</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Contributors</p>
                <p className="mt-2 text-2xl font-bold text-foreground">646</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="mt-2 text-2xl font-bold text-foreground">1</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </Card>
        </div>

        {/* Campaigns */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground">Your Campaigns</h2>
          <div className="mt-6 space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{campaign.title}</h3>
                    <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
                      <span>
                        KES {campaign.raised.toLocaleString()} / {campaign.goal.toLocaleString()}
                      </span>
                      <span>{campaign.contributors} contributors</span>
                      <span
                        className={`rounded-full px-3 py-1 font-semibold ${
                          campaign.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {campaign.status === "completed" ? "Completed" : "Active"}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/campaign/${campaign.id}`}>View</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
