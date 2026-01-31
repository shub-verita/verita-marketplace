"use client";

import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { TagInput } from "./TagInput";
import type { Job } from "@verita/database";

interface JobFormProps {
  job?: Job;
  action: (formData: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function JobForm({ job, action, onDelete }: JobFormProps) {
  const [title, setTitle] = useState(job?.title || "");
  const [slug, setSlug] = useState(job?.slug || "");
  const [payMin, setPayMin] = useState(job?.payMin?.toString() || "");
  const [payMax, setPayMax] = useState(job?.payMax?.toString() || "");
  const [payType, setPayType] = useState<"HOURLY" | "PER_TASK">(
    job?.payType || "HOURLY"
  );
  const [timeCommitment, setTimeCommitment] = useState(
    job?.timeCommitment || ""
  );
  const [remoteWorldwide, setRemoteWorldwide] = useState(
    job?.remoteWorldwide ?? true
  );
  const [shortDescription, setShortDescription] = useState(
    job?.shortDescription || ""
  );
  const [fullDescription, setFullDescription] = useState(
    job?.fullDescription || ""
  );
  const [responsibilities, setResponsibilities] = useState(
    job?.responsibilities || ""
  );
  const [requirements, setRequirements] = useState(job?.requirements || "");
  const [niceToHave, setNiceToHave] = useState(job?.niceToHave || "");
  const [skillTags, setSkillTags] = useState<string[]>(job?.skillTags || []);
  const [tools, setTools] = useState<string[]>(job?.tools || []);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!job) {
      setSlug(generateSlug(title));
    }
  }, [title, job]);

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm("Are you sure you want to delete this job?")) return;

    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete job");
      setIsDeleting(false);
    }
  };

  return (
    <form action={action} className="space-y-8">
      {/* Hidden fields for form data */}
      <input type="hidden" name="skillTags" value={JSON.stringify(skillTags)} />
      <input type="hidden" name="tools" value={JSON.stringify(tools)} />
      <input type="hidden" name="remoteWorldwide" value={String(remoteWorldwide)} />
      <input type="hidden" name="payType" value={payType} />

      {/* Basic Info */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Basic Information
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g., AI Data Annotator"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              URL Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">jobs.verita.ai/jobs/</span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                disabled
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="shortDescription"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
              maxLength={200}
              rows={2}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Brief summary shown in job cards"
            />
            <p className="mt-1 text-xs text-slate-500">
              {shortDescription.length}/200 characters
            </p>
          </div>
        </div>
      </section>

      {/* Compensation */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Compensation
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="payMin"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Min Pay ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="payMin"
                name="payMin"
                value={payMin}
                onChange={(e) => setPayMin(e.target.value)}
                required
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="15"
              />
            </div>
            <div>
              <label
                htmlFor="payMax"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Max Pay ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="payMax"
                name="payMax"
                value={payMax}
                onChange={(e) => setPayMax(e.target.value)}
                required
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="25"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pay Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={payType === "HOURLY"}
                  onChange={() => setPayType("HOURLY")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-slate-700">Hourly</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={payType === "PER_TASK"}
                  onChange={() => setPayType("PER_TASK")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-slate-700">Per Task</span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="timeCommitment"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Time Commitment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="timeCommitment"
              name="timeCommitment"
              value={timeCommitment}
              onChange={(e) => setTimeCommitment(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g., 10-20 hours/week"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remoteWorldwide}
                onChange={(e) => setRemoteWorldwide(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-700">Remote Worldwide</span>
            </label>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Job Details
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="fullDescription"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Detailed description of the role..."
            />
          </div>

          <div>
            <label
              htmlFor="responsibilities"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Responsibilities <span className="text-red-500">*</span>
            </label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="• Review and annotate data&#10;• Follow guidelines..."
            />
          </div>

          <div>
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="• Strong attention to detail&#10;• Reliable internet..."
            />
          </div>

          <div>
            <label
              htmlFor="niceToHave"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nice to Have
            </label>
            <textarea
              id="niceToHave"
              name="niceToHave"
              value={niceToHave}
              onChange={(e) => setNiceToHave(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="• Previous annotation experience&#10;• Background in linguistics..."
            />
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Tags & Tools
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="skillTags"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Skill Tags
            </label>
            <TagInput
              id="skillTags"
              value={skillTags}
              onChange={setSkillTags}
              placeholder="Add skill tags..."
            />
          </div>

          <div>
            <label
              htmlFor="tools"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Tools & Software
            </label>
            <TagInput
              id="tools"
              value={tools}
              onChange={setTools}
              placeholder="Add tools..."
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {job && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Job"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            name="status"
            value="DRAFT"
            className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            name="status"
            value="PUBLISHED"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            {job?.status === "PUBLISHED" ? "Update" : "Publish"}
          </button>
        </div>
      </div>
    </form>
  );
}
