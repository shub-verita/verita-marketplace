import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { JobForm } from "@/components/JobForm";
import { getJobBySlug } from "@/lib/queries";
import { updateJob, deleteJob } from "../../actions";
import { ChevronLeft } from "lucide-react";

interface EditJobPageProps {
  params: { slug: string };
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const job = await getJobBySlug(params.slug);

  if (!job) {
    notFound();
  }

  const updateJobWithId = async (formData: FormData) => {
    "use server";
    await updateJob(job.id, formData);
  };

  const deleteJobWithId = async () => {
    "use server";
    await deleteJob(job.id);
  };

  return (
    <div className="min-h-screen">
      <TopBar title={`Edit: ${job.title}`}>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
      </TopBar>

      <div className="p-6 max-w-4xl">
        {/* Job Stats */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-slate-500">Status:</span>{" "}
              <span
                className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                  job.status === "PUBLISHED"
                    ? "bg-green-100 text-green-700"
                    : job.status === "CLOSED"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {job.status}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Applications:</span>{" "}
              <span className="font-medium">{job._count.applications}</span>
            </div>
            {job.publishedAt && (
              <div>
                <span className="text-slate-500">Published:</span>{" "}
                <span className="font-medium">
                  {new Date(job.publishedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <JobForm
          job={job}
          action={updateJobWithId}
          onDelete={deleteJobWithId}
        />
      </div>
    </div>
  );
}
