"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Search } from "lucide-react";
import { relativeDate } from "@/lib/dates";
import type { Job } from "@verita/database";

type JobWithCount = Job & {
  _count: {
    applications: number;
  };
};

interface JobsTableProps {
  jobs: JobWithCount[];
}

const statusTabs = [
  { value: "ALL", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "CLOSED", label: "Closed" },
] as const;

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  PUBLISHED: "bg-green-100 text-green-700",
  CLOSED: "bg-orange-100 text-orange-700",
};

export function JobsTable({ jobs }: JobsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus =
      statusFilter === "ALL" || job.status === statusFilter;
    const matchesSearch = job.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Filters */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  statusFilter === tab.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredJobs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                  Applications
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                  Created
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/jobs/${job.slug}/edit`}
                      className="font-medium text-slate-900 hover:text-blue-600"
                    >
                      {job.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        statusStyles[job.status]
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {job._count.applications}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {relativeDate(job.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/jobs/${job.slug}/edit`}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
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
            {jobs.length === 0
              ? "No jobs yet. Create your first job posting."
              : "No jobs match your filters."}
          </p>
        </div>
      )}
    </div>
  );
}
