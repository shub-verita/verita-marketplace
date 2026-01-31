import { prisma } from "@/lib/db";
import { Logo } from "@/components/Logo";
import { JobCard } from "@/components/JobCard";

export const revalidate = 0; // Always fetch fresh data

async function getJobs() {
  const jobs = await prisma.job.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      payMin: true,
      payMax: true,
      timeCommitment: true,
      remoteWorldwide: true,
      skillTags: true,
      publishedAt: true,
    },
  });
  return jobs;
}

export default async function Home() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Logo className="h-12" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Join our global network of AI training specialists
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Remote contract opportunities in data annotation, quality assurance, and AI training
          </p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-slate-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-xl text-slate-600">
                No open positions right now. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
