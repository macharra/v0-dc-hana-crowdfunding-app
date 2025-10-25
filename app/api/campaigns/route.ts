import { type NextRequest, NextResponse } from "next/server"

// Mock database
const campaigns = [
  {
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
    location: "Kisumu, Kenya",
    createdBy: "Education Foundation",
    createdDate: "2024-12-01",
    milestones: [],
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
    location: "Mombasa, Kenya",
    createdBy: "Health Initiative",
    createdDate: "2025-01-10",
    milestones: [],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      // Get single campaign
      const campaign = campaigns.find((c) => c.id === id)
      if (!campaign) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
      }
      return NextResponse.json(campaign)
    }

    // Get all campaigns
    return NextResponse.json(campaigns)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.goal || !body.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new campaign
    const newCampaign = {
      id: `${campaigns.length + 1}`,
      ...body,
      raised: 0,
      contributors: 0,
      progress: 0,
      status: "pending",
      createdDate: new Date().toISOString(),
      milestones: body.milestones || [],
    }

    campaigns.push(newCampaign)

    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
