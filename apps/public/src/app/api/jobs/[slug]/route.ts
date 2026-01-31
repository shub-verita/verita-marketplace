import { NextResponse } from "next/server";
import { prisma } from "@verita/database";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const job = await prisma.job.findFirst({
      where: {
        slug: params.slug,
        status: "PUBLISHED",
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}
