import { NextResponse } from "next/server";
import { prisma } from "@verita/database";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: { title: true },
        },
      },
    });

    // Generate CSV
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Country",
      "Job",
      "Applied Date",
      "Status",
      "Source",
      "LinkedIn",
      "Portfolio",
    ];

    const rows = applications.map((app) => [
      escapeCsvField(app.fullName),
      escapeCsvField(app.email),
      escapeCsvField(app.phone),
      escapeCsvField(app.country),
      escapeCsvField(app.job.title),
      new Date(app.createdAt).toISOString().split("T")[0],
      app.status,
      app.source,
      app.linkedinUrl || "",
      app.portfolioUrl || "",
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n"
    );

    const filename = `applications-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting applications:", error);
    return NextResponse.json(
      { error: "Failed to export applications" },
      { status: 500 }
    );
  }
}

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
