import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      jobId,
      fullName,
      email,
      phone,
      country,
      resumeUrl,
      linkedinUrl,
      portfolioUrl,
      whyInterested,
      relevantExperience,
      source,
    } = body;

    // Validate required fields
    if (
      !jobId ||
      !fullName ||
      !email ||
      !phone ||
      !country ||
      !resumeUrl ||
      !whyInterested ||
      !relevantExperience
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify job exists and is published
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        status: "PUBLISHED",
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or not accepting applications" },
        { status: 404 }
      );
    }

    // Check if max applications reached
    if (job.maxApplications) {
      const applicationCount = await prisma.application.count({
        where: { jobId },
      });

      if (applicationCount >= job.maxApplications) {
        return NextResponse.json(
          { error: "This position is no longer accepting applications" },
          { status: 400 }
        );
      }
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        fullName,
        email,
        phone,
        country,
        resumeUrl,
        linkedinUrl: linkedinUrl || null,
        portfolioUrl: portfolioUrl || null,
        whyInterested,
        relevantExperience,
        source: source || "OTHER",
        status: "NEW",
      },
    });

    return NextResponse.json(
      { success: true, applicationId: application.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
