"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@verita/database";
import { auth } from "@/lib/auth";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.job.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function createJob(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const status = formData.get("status") as "DRAFT" | "PUBLISHED";
  const payMin = parseInt(formData.get("payMin") as string) || 0;
  const payMax = parseInt(formData.get("payMax") as string) || 0;
  const payType = formData.get("payType") as "HOURLY" | "PER_TASK";
  const timeCommitment = formData.get("timeCommitment") as string;
  const remoteWorldwide = formData.get("remoteWorldwide") === "true";
  const shortDescription = formData.get("shortDescription") as string;
  const fullDescription = formData.get("fullDescription") as string;
  const responsibilities = formData.get("responsibilities") as string;
  const requirements = formData.get("requirements") as string;
  const niceToHave = formData.get("niceToHave") as string;
  const skillTags = JSON.parse((formData.get("skillTags") as string) || "[]");
  const tools = JSON.parse((formData.get("tools") as string) || "[]");

  const baseSlug = generateSlug(title);
  const slug = await getUniqueSlug(baseSlug);

  const job = await prisma.job.create({
    data: {
      title,
      slug,
      status,
      payMin,
      payMax,
      payType,
      timeCommitment,
      remoteWorldwide,
      allowedCountries: [],
      shortDescription,
      fullDescription,
      responsibilities,
      requirements,
      niceToHave: niceToHave || null,
      skillTags,
      tools,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      createdById: session.user.id,
    },
  });

  revalidatePath("/dashboard/jobs");
  redirect(`/dashboard/jobs/${job.slug}/edit`);
}

export async function updateJob(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingJob = await prisma.job.findUnique({ where: { id } });
  if (!existingJob) {
    throw new Error("Job not found");
  }

  const title = formData.get("title") as string;
  const status = formData.get("status") as "DRAFT" | "PUBLISHED" | "CLOSED";
  const payMin = parseInt(formData.get("payMin") as string) || 0;
  const payMax = parseInt(formData.get("payMax") as string) || 0;
  const payType = formData.get("payType") as "HOURLY" | "PER_TASK";
  const timeCommitment = formData.get("timeCommitment") as string;
  const remoteWorldwide = formData.get("remoteWorldwide") === "true";
  const shortDescription = formData.get("shortDescription") as string;
  const fullDescription = formData.get("fullDescription") as string;
  const responsibilities = formData.get("responsibilities") as string;
  const requirements = formData.get("requirements") as string;
  const niceToHave = formData.get("niceToHave") as string;
  const skillTags = JSON.parse((formData.get("skillTags") as string) || "[]");
  const tools = JSON.parse((formData.get("tools") as string) || "[]");

  // Update slug if title changed
  let slug = existingJob.slug;
  if (title !== existingJob.title) {
    const baseSlug = generateSlug(title);
    slug = await getUniqueSlug(baseSlug, id);
  }

  // Set publishedAt if publishing for first time
  let publishedAt = existingJob.publishedAt;
  if (status === "PUBLISHED" && !existingJob.publishedAt) {
    publishedAt = new Date();
  }

  await prisma.job.update({
    where: { id },
    data: {
      title,
      slug,
      status,
      payMin,
      payMax,
      payType,
      timeCommitment,
      remoteWorldwide,
      shortDescription,
      fullDescription,
      responsibilities,
      requirements,
      niceToHave: niceToHave || null,
      skillTags,
      tools,
      publishedAt,
    },
  });

  revalidatePath("/dashboard/jobs");
  revalidatePath(`/dashboard/jobs/${slug}/edit`);
  redirect("/dashboard/jobs");
}

export async function deleteJob(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check for applications first
  const applicationCount = await prisma.application.count({
    where: { jobId: id },
  });

  if (applicationCount > 0) {
    throw new Error("Cannot delete job with existing applications");
  }

  await prisma.job.delete({ where: { id } });

  revalidatePath("/dashboard/jobs");
  redirect("/dashboard/jobs");
}
