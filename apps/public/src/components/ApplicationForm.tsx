"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { countries } from "@/data/countries";

const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Please select your country"),
  linkedinUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  whyInterested: z
    .string()
    .min(100, "Please write at least 100 characters")
    .max(500, "Please keep your response under 500 characters"),
  relevantExperience: z
    .string()
    .min(100, "Please write at least 100 characters")
    .max(1000, "Please keep your response under 1000 characters"),
  source: z.enum(["LINKEDIN", "TWITTER", "REFERRAL", "GOOGLE", "OTHER"]),
  consent: z.literal(true, {
    message: "You must agree to the terms to continue",
  }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      source: "OTHER",
    },
  });

  const whyInterestedLength = watch("whyInterested")?.length || 0;
  const relevantExperienceLength = watch("relevantExperience")?.length || 0;

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResumeError(null);

    if (!file) {
      setResumeFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setResumeError("Please upload a PDF file");
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File size must be less than 5MB");
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile) {
      setResumeError("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload resume first
      const formData = new FormData();
      formData.append("file", resumeFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload resume");
      }

      const { url: resumeUrl } = await uploadRes.json();

      // Submit application
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          country: data.country,
          resumeUrl,
          linkedinUrl: data.linkedinUrl || null,
          portfolioUrl: data.portfolioUrl || null,
          whyInterested: data.whyInterested,
          relevantExperience: data.relevantExperience,
          source: data.source,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit application");
      }

      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Thanks for applying!
        </h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          We&apos;ve received your application for <strong>{jobTitle}</strong>.
          If your profile matches our needs, we&apos;ll reach out to{" "}
          <strong>{submittedEmail}</strong> within 5-7 business days.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse More Opportunities
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Section 1 - Personal Info */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              {...register("fullName")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              {...register("phone")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              {...register("country")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2 - Experience */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Experience</h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Resume (PDF, max 5MB) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="resume"
              accept=".pdf,application/pdf"
              onChange={handleResumeChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {resumeFile && (
              <p className="mt-1 text-sm text-green-600">
                Selected: {resumeFile.name}
              </p>
            )}
            {resumeError && (
              <p className="mt-1 text-sm text-red-600">{resumeError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="linkedinUrl"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="linkedinUrl"
                {...register("linkedinUrl")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="https://linkedin.com/in/yourprofile"
              />
              {errors.linkedinUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.linkedinUrl.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="portfolioUrl"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Portfolio Website
              </label>
              <input
                type="url"
                id="portfolioUrl"
                {...register("portfolioUrl")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="https://yourportfolio.com"
              />
              {errors.portfolioUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.portfolioUrl.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 - Questions */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Tell Us About Yourself
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="whyInterested"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Why are you interested in this role?{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="whyInterested"
              rows={4}
              {...register("whyInterested")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Tell us what excites you about this opportunity..."
            />
            <div className="mt-1 flex justify-between text-sm">
              <span>
                {errors.whyInterested ? (
                  <span className="text-red-600">
                    {errors.whyInterested.message}
                  </span>
                ) : (
                  <span className="text-slate-500">100-500 characters</span>
                )}
              </span>
              <span
                className={
                  whyInterestedLength < 100 || whyInterestedLength > 500
                    ? "text-red-600"
                    : "text-slate-500"
                }
              >
                {whyInterestedLength}/500
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="relevantExperience"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Describe your relevant experience{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="relevantExperience"
              rows={5}
              {...register("relevantExperience")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Share your background and any experience relevant to this position..."
            />
            <div className="mt-1 flex justify-between text-sm">
              <span>
                {errors.relevantExperience ? (
                  <span className="text-red-600">
                    {errors.relevantExperience.message}
                  </span>
                ) : (
                  <span className="text-slate-500">100-1000 characters</span>
                )}
              </span>
              <span
                className={
                  relevantExperienceLength < 100 ||
                  relevantExperienceLength > 1000
                    ? "text-red-600"
                    : "text-slate-500"
                }
              >
                {relevantExperienceLength}/1000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 - Source */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          How did you hear about us?
        </h3>
        <select
          {...register("source")}
          className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
        >
          <option value="LINKEDIN">LinkedIn</option>
          <option value="TWITTER">Twitter/X</option>
          <option value="REFERRAL">Referral</option>
          <option value="GOOGLE">Google Search</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Consent */}
      <div className="border-t border-slate-200 pt-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("consent")}
            className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-600">
            I agree to Verita Marketplace&apos;s{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.consent && (
          <p className="mt-2 text-sm text-red-600">{errors.consent.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}
