import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import {
  getJobStats,
  getApplicationStats,
  getRecentApplications,
} from "@/lib/queries";
import { relativeDate } from "@/lib/dates";
import {
  Briefcase,
  FileText,
  Clock,
  Star,
  Plus,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  const [jobStats, applicationStats, recentApplications] = await Promise.all([
    getJobStats(),
    getApplicationStats(),
    getRecentApplications(10),
  ]);

  const stats = [
    {
      label: "Open Jobs",
      value: jobStats.openJobs,
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      label: "Applications (7d)",
      value: applicationStats.applicationsLast7Days,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      label: "Pending Review",
      value: applicationStats.pendingReview,
      icon: Clock,
      color: "bg-amber-500",
    },
    {
      label: "Shortlisted",
      value: applicationStats.shortlisted,
      icon: Star,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Dashboard" />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-slate-200 p-5"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`${stat.color} p-3 rounded-lg text-white`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
            <div className="p-5 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recentApplications.length > 0 ? (
                recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-900">
                          New application from{" "}
                          <span className="font-medium">
                            {application.fullName}
                          </span>{" "}
                          for{" "}
                          <Link
                            href={`/dashboard/jobs/${application.job.slug}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {application.job.title}
                          </Link>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {application.email}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {relativeDate(application.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No applications yet
                </div>
              )}
            </div>
            {recentApplications.length > 0 && (
              <div className="p-4 border-t border-slate-200">
                <Link
                  href="/dashboard/applications"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                >
                  View all applications
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/jobs/new"
                className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Create New Job
              </Link>
              <Link
                href="/dashboard/applications"
                className="flex items-center gap-3 w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                <FileText className="w-5 h-5" />
                View Applications
              </Link>
            </div>

            {/* Summary */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                Job Summary
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Published</dt>
                  <dd className="font-medium text-slate-900">
                    {jobStats.openJobs}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Drafts</dt>
                  <dd className="font-medium text-slate-900">
                    {jobStats.draftJobs}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Closed</dt>
                  <dd className="font-medium text-slate-900">
                    {jobStats.closedJobs}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
