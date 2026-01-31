"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { relativeDate } from "@/lib/dates";
import { StatusBadge } from "@/components/StatusBadge";
import type { Application } from "@verita/database";

type ApplicationWithJob = Application & {
  job: {
    id: string;
    title: string;
    slug: string;
  };
};

interface ApplicationsTableProps {
  applications: ApplicationWithJob[];
  jobs: { id: string; title: string }[];
}

const statusOptions = [
  { value: "ALL", label: "All Statuses" },
  { value: "NEW", label: "New" },
  { value: "REVIEWING", label: "Reviewing" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "HIRED", label: "Hired" },
] as const;

export function ApplicationsTable({
  applications,
  jobs,
}: ApplicationsTableProps) {
  const [jobFilter, setJobFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredApplications = applications.filter((app) => {
    const matchesJob = jobFilter === "ALL" || app.jobId === jobFilter;
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    const matchesSearch =
      app.fullName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase());
    return matchesJob && matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Filters */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Job Filter */}
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="ALL">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredApplications.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                  Job
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                  Applied
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/applications/${app.id}`}
                      className="font-medium text-slate-900 hover:text-blue-600"
                    >
                      {app.fullName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {app.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <Link
                      href={`/dashboard/jobs/${app.job.slug}/edit`}
                      className="hover:text-blue-600"
                    >
                      {app.job.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {relativeDate(app.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={app.status as "NEW" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/dashboard/applications/${app.id}`}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <p className="text-slate-500">
            {applications.length === 0
              ? "No applications yet."
              : "No applications match your filters."}
          </p>
        </div>
      )}

      {/* Count */}
      <div className="px-4 py-3 border-t border-slate-200 text-sm text-slate-500">
        Showing {filteredApplications.length} of {applications.length}{" "}
        applications
      </div>
    </div>
  );
}
