"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"

export default function CreateCampaign() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Infrastructure",
    goal: "",
    location: "",
    image: null as File | null,
  })

  const [step, setStep] = useState<"details" | "review" | "success">("details")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleSubmit = () => {
    if (formData.title && formData.description && formData.goal && formData.location) {
      setStep("review")
    }
  }

  const handlePublish = () => {
    setStep("success")
  }

  const categories = ["Infrastructure", "Education", "Healthcare", "Environment", "Community", "Emergency"]

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Campaign Details */}
        {step === "details" && (
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-foreground">Create a Campaign</h1>
            <p className="mt-2 text-muted-foreground">Share your community's story and start fundraising</p>

            <div className="mt-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground">Campaign Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Community Water Well - Nairobi"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your campaign, goals, and impact..."
                  rows={5}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-foreground">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goal Amount */}
              <div>
                <label className="block text-sm font-semibold text-foreground">Funding Goal (KES)</label>
                <input
                  type="number"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  placeholder="e.g., 50000"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-foreground">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Nairobi, Kenya"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground">Campaign Image</label>
                <label className="mt-2 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:border-primary hover:bg-muted">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {formData.image ? formData.image.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <Button onClick={handleSubmit} size="lg" className="mt-8 w-full">
              Review Campaign
            </Button>
          </Card>
        )}

        {/* Review */}
        {step === "review" && (
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-foreground">Review Your Campaign</h1>
            <p className="mt-2 text-muted-foreground">Make sure everything looks good before publishing</p>

            <div className="mt-8 space-y-6">
              <div className="rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground">Campaign Details</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-semibold text-foreground">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-semibold text-foreground">{formData.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">{formData.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Funding Goal</p>
                    <p className="font-semibold text-foreground">
                      KES {Number.parseFloat(formData.goal).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground">Description</h3>
                <p className="mt-3 text-muted-foreground">{formData.description}</p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button variant="outline" onClick={() => setStep("details")} size="lg" className="flex-1">
                Back
              </Button>
              <Button onClick={handlePublish} size="lg" className="flex-1">
                Publish Campaign
              </Button>
            </div>
          </Card>
        )}

        {/* Success */}
        {step === "success" && (
          <Card className="p-8 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-500/10 p-4">
                <svg className="h-16 w-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-foreground">Campaign Published!</h1>
            <p className="mt-2 text-muted-foreground">Your campaign is now live and accepting contributions</p>

            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">Campaign ID</p>
              <p className="font-mono text-lg font-semibold text-foreground">CAMP-2025-001</p>
            </div>

            <div className="mt-8 flex gap-4">
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/">Back Home</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/campaign/1">View Campaign</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
