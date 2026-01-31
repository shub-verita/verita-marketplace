import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { getApplicationById } from "@/lib/queries";
import { relativeDate } from "@/lib/dates";
import { ApplicationDetail } from "./ApplicationDetail";
import { ChevronLeft, ExternalLink, Download, Mail, Phone, MapPin } from "lucide-react";

interface ApplicationPageProps {
  params: { id: string };
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const application = await getApplicationById(params.id);

  if (!application) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <TopBar title="Application Details">
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Applications
        </Link>
      </TopBar>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">
                    {application.fullName}
                  </h1>
                  <p className="text-slate-600">
                    Applied for{" "}
                    <Link
                      href={`/dashboard/jobs/${application.job.slug}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      {application.job.title}
                    </Link>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {relativeDate(application.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <a
                      href={`mailto:${application.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {application.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm text-slate-900">{application.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Country</p>
                    <p className="text-sm text-slate-900">{application.country}</p>
                  </div>
                </div>

                {application.linkedinUrl && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">LinkedIn</p>
                      <a
                        href={application.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}

                {application.portfolioUrl && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Portfolio</p>
                      <a
                        href={application.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Portfolio
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Resume
              </h2>
              <a
                href={application.resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </div>

            {/* Responses */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Application Responses
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">
                    Why are you interested in this role?
                  </h3>
                  <p className="text-slate-600 whitespace-pre-wrap">
                    {application.whyInterested}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">
                    Relevant Experience
                  </h3>
                  <p className="text-slate-600 whitespace-pre-wrap">
                    {application.relevantExperience}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ApplicationDetail application={application} />
          </div>
        </div>
      </div>
    </div>
  );
}
