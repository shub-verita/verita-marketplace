import Link from "next/link";
import { formatPayRange, isNew } from "@/lib/utils";

interface JobCardProps {
  job: {
    slug: string;
    title: string;
    payMin: number;
    payMax: number;
    timeCommitment: string;
    remoteWorldwide: boolean;
    skillTags: string[];
    publishedAt: Date | string | null;
  };
}

export function JobCard({ job }: JobCardProps) {
  const isNewJob = isNew(job.publishedAt);
  const displayTags = job.skillTags.slice(0, 3);

  return (
    <Link href={`/jobs/${job.slug}`}>
      <article className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-200 h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="text-lg font-semibold text-slate-900 leading-tight">
            {job.title}
          </h2>
          {isNewJob && (
            <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
              New
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-slate-700 font-medium">
            {formatPayRange(job.payMin, job.payMax)}
          </p>
          <p className="text-slate-600 text-sm">{job.timeCommitment}</p>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            {job.remoteWorldwide && (
              <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Remote
              </span>
            )}
          </div>

          {displayTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {displayTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
