import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { getJobs } from "@/lib/queries";
import { relativeDate } from "@/lib/dates";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { JobsTable } from "./JobsTable";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen">
      <TopBar title="Jobs">
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Job
        </Link>
      </TopBar>

      <div className="p-6">
        <JobsTable jobs={jobs} />
      </div>
    </div>
  );
}
