import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@verita/database";
import { formatPayRange } from "@/lib/utils";
import { relativeDate } from "@/lib/dates";
import { ApplicationForm } from "@/components/ApplicationForm";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

async function getJob(slug: string) {
  const job = await prisma.job.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
  });
  return job;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const job = await getJob(params.slug);
  if (!job) {
    return { title: "Job Not Found" };
  }
  return {
    title: `${job.title} | Verita Marketplace`,
    description: job.shortDescription,
  };
}

export default async function JobPage({ params }: PageProps) {
  const job = await getJob(params.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Back Link */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to all opportunities
        </Link>
      </div>

      {/* Job Header */}
      <header className="max-w-6xl mx-auto px-4 py-8 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{job.title}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-6">
          <span className="font-medium text-slate-900">
            {formatPayRange(job.payMin, job.payMax)}
          </span>
          <span className="text-slate-300">|</span>
          <span>{job.timeCommitment}</span>
          <span className="text-slate-300">|</span>
          {job.remoteWorldwide && (
            <>
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Remote Worldwide
              </span>
              <span className="text-slate-300">|</span>
            </>
          )}
          <span>Posted {relativeDate(job.publishedAt)}</span>
        </div>

        <a
          href="#apply"
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Now
        </a>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Content */}
          <div className="lg:col-span-2 max-w-3xl">
            {/* About this role */}
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">About this role</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-line">{job.fullDescription}</p>
              </div>
            </section>

            {/* What you'll do */}
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">What you&apos;ll do</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-line">{job.responsibilities}</p>
              </div>
            </section>

            {/* What we're looking for */}
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">What we&apos;re looking for</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-line">{job.requirements}</p>
              </div>
            </section>

            {/* Nice to have */}
            {job.niceToHave && (
              <section className="mb-10">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Nice to have</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 whitespace-pre-line">{job.niceToHave}</p>
                </div>
              </section>
            )}

            {/* Tools & Software */}
            {job.tools && job.tools.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Tools & Software</h2>
                <div className="flex flex-wrap gap-2">
                  {job.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Quick facts</h3>

                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-slate-500">Compensation</dt>
                    <dd className="font-medium text-slate-900">
                      {formatPayRange(job.payMin, job.payMax)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-slate-500">Commitment</dt>
                    <dd className="font-medium text-slate-900">{job.timeCommitment}</dd>
                  </div>

                  <div>
                    <dt className="text-sm text-slate-500">Type</dt>
                    <dd className="font-medium text-slate-900">Contract</dd>
                  </div>

                  <div>
                    <dt className="text-sm text-slate-500">Payment</dt>
                    <dd className="font-medium text-slate-900">Semi-monthly</dd>
                  </div>

                  {job.applicationDeadline && (
                    <div>
                      <dt className="text-sm text-slate-500">Deadline</dt>
                      <dd className="font-medium text-slate-900">
                        {new Date(job.applicationDeadline).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </dd>
                    </div>
                  )}
                </dl>

                <a
                  href="#apply"
                  className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Apply Section */}
      <section id="apply" className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to apply?</h2>
            <p className="text-slate-600">Submit your application below</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <ApplicationForm jobId={job.id} jobTitle={job.title} />
          </div>
        </div>
      </section>
    </div>
  );
}
