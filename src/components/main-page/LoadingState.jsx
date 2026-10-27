import { RefreshCw } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-gray-500">
      <RefreshCw size={32} className="animate-spin text-orange-500" />
      <p className="text-sm font-medium">Loading announcements...</p>
    </div>
  );
}
