import { TopBar } from "@/components/TopBar";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Settings" />

      <div className="p-6">
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-slate-300 mb-4">
            <Settings className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Settings coming soon
          </h2>
          <p className="text-slate-600">
            Account settings, preferences, and team management will be available
            here.
          </p>
        </div>
      </div>
    </div>
  );
}
