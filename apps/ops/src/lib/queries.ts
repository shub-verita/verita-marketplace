import { prisma } from "@verita/database";

export async function getJobStats() {
  const openJobs = await prisma.job.count({
    where: { status: "PUBLISHED" },
  });

  const draftJobs = await prisma.job.count({
    where: { status: "DRAFT" },
  });

  const closedJobs = await prisma.job.count({
    where: { status: "CLOSED" },
  });

  return { openJobs, draftJobs, closedJobs };
}

export async function getApplicationStats() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const applicationsLast7Days = await prisma.application.count({
    where: {
      createdAt: { gte: sevenDaysAgo },
    },
  });

  const pendingReview = await prisma.application.count({
    where: { status: "NEW" },
  });

  const shortlisted = await prisma.application.count({
    where: { status: "SHORTLISTED" },
  });

  const totalApplications = await prisma.application.count();

  return {
    applicationsLast7Days,
    pendingReview,
    shortlisted,
    totalApplications,
  };
}

export async function getRecentApplications(limit: number = 10) {
  const applications = await prisma.application.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  return applications;
}

export async function getJobs() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  return jobs;
}

export async function getJobBySlug(slug: string) {
  const job = await prisma.job.findUnique({
    where: { slug },
    include: {
      createdBy: {
        select: { name: true, email: true },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  return job;
}

export async function getApplicationsForJob(jobId: string) {
  const applications = await prisma.application.findMany({
    where: { jobId },
    orderBy: { createdAt: "desc" },
    include: {
      notes: {
        include: {
          author: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return applications;
}

export async function getAllApplications() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  return applications;
}

export async function getApplicationById(id: string) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      notes: {
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return application;
}

export async function getJobsForFilter() {
  const jobs = await prisma.job.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
    },
  });

  return jobs;
}
