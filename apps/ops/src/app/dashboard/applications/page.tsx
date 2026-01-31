import { TopBar } from "@/components/TopBar";
import { getAllApplications, getJobsForFilter } from "@/lib/queries";
import { ApplicationsTable } from "./ApplicationsTable";
import { Download } from "lucide-react";

export default async function ApplicationsPage() {
  const [applications, jobs] = await Promise.all([
    getAllApplications(),
    getJobsForFilter(),
  ]);

  return (
    <div className="min-h-screen">
      <TopBar title="Applications">
        <a
          href="/api/applications/export"
          download
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </a>
      </TopBar>

      <div className="p-6">
        <ApplicationsTable applications={applications} jobs={jobs} />
      </div>
    </div>
  );
}
