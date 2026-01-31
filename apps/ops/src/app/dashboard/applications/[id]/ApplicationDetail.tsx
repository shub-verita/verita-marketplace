"use client";

import { useState, useTransition } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { updateApplicationStatus, addApplicationNote } from "../actions";
import { relativeDate } from "@/lib/dates";
import type { Application, ApplicationNote } from "@verita/database";

type ApplicationStatus = "NEW" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED";

interface ApplicationDetailProps {
  application: Application & {
    job: { id: string; title: string; slug: string };
    notes: (ApplicationNote & { author: { id: string; name: string } })[];
  };
}

export function ApplicationDetail({ application }: ApplicationDetailProps) {
  const [isPending, startTransition] = useTransition();
  const [noteText, setNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    startTransition(async () => {
      await updateApplicationStatus(application.id, newStatus);
    });
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    setIsAddingNote(true);
    try {
      await addApplicationNote(application.id, noteText);
      setNoteText("");
    } catch (error) {
      alert("Failed to add note");
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <>
      {/* Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Status</h2>
        <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
          <StatusBadge
            status={application.status as ApplicationStatus}
            onChange={handleStatusChange}
            size="md"
          />
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Click to change application status
        </p>
      </div>

      {/* Notes Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Internal Notes
        </h2>

        {/* Add Note */}
        <div className="mb-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
          <button
            onClick={handleAddNote}
            disabled={isAddingNote || !noteText.trim()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingNote ? "Saving..." : "Add Note"}
          </button>
        </div>

        {/* Notes List */}
        {application.notes.length > 0 ? (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {application.notes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {note.author.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {relativeDate(note.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {note.noteText}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No notes yet</p>
        )}
      </div>

      {/* Source */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Source</h2>
        <p className="text-sm text-slate-600">
          {application.source.replace("_", " ")}
        </p>
      </div>
    </>
  );
}
