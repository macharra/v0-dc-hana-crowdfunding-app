"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrendingUp, Users, CheckCircle } from "lucide-react"

interface Campaign {
  id: string
  title: string
  description: string
  goal: number
  raised: number
  contributors: number
  image: string
  category: string
  status: "active" | "completed" | "pending"
  progress: number
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Community Water Well - Nairobi",
    description: "Building a sustainable water source for 500+ families",
    goal: 50000,
    raised: 38500,
    contributors: 234,
    image: "/water-well-community-project.jpg",
    category: "Infrastructure",
    status: "active",
    progress: 77,
  },
  {
    id: "2",
    title: "School Renovation Project",
    description: "Renovating classrooms and building a library",
    goal: 75000,
    raised: 75000,
    contributors: 412,
    image: "/school-building-renovation.jpg",
    category: "Education",
    status: "completed",
    progress: 100,
  },
  {
    id: "3",
    title: "Healthcare Clinic Setup",
    description: "Establishing a medical clinic in rural area",
    goal: 100000,
    raised: 45200,
    contributors: 156,
    image: "/medical-clinic-healthcare.jpg",
    category: "Healthcare",
    status: "active",
    progress: 45,
  },
]

export default function Home() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">dChanga</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/create" className="text-sm font-medium text-foreground hover:text-primary">
                Create Campaign
              </Link>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-card to-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Transparent Community Fundraising
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powered by blockchain. Trusted by communities. Built for Kenya.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/create">Start a Campaign</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#campaigns">Browse Campaigns</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <div className="text-3xl font-bold text-primary">KES 158.7M</div>
              <p className="mt-2 text-sm text-muted-foreground">Total Raised</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <div className="text-3xl font-bold text-primary">802</div>
              <p className="mt-2 text-sm text-muted-foreground">Active Campaigns</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <div className="text-3xl font-bold text-primary">45.2K</div>
              <p className="mt-2 text-sm text-muted-foreground">Contributors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section id="campaigns" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-foreground">Featured Campaigns</h2>
          <p className="mt-2 text-muted-foreground">Support communities making a real difference</p>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
                <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary">
                  <div className="relative overflow-hidden bg-muted">
                    <img
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.title}
                      className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                      {campaign.category}
                    </div>
                    {campaign.status === "completed" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="flex flex-col items-center gap-2 text-white">
                          <CheckCircle className="h-8 w-8" />
                          <span className="font-semibold">Completed</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2">{campaign.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-foreground">KES {campaign.raised.toLocaleString()}</span>
                        <span className="text-muted-foreground">{campaign.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all"
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">of KES {campaign.goal.toLocaleString()} goal</p>
                    </div>

                    {/* Contributors */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{campaign.contributors} contributors</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-foreground">dChanga</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Transparent community fundraising powered by blockchain.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 dChanga. All rights reserved. Powered by Hedera Hashgraph.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
