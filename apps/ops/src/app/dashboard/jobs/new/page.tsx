import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { JobForm } from "@/components/JobForm";
import { createJob } from "../actions";
import { ChevronLeft } from "lucide-react";

export default function NewJobPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Create New Job">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
      </TopBar>

      <div className="p-6 max-w-4xl">
        <JobForm action={createJob} />
      </div>
    </div>
  );
}
