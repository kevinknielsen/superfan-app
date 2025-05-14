import React from "react";

interface TrackDemoPlayerProps {
  url?: string | null;
}

export default function TrackDemoPlayer({ url }: TrackDemoPlayerProps) {
  if (!url) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-bold mb-2">Track Demo</h3>
        <div className="text-gray-400 text-center py-8">No Demo Available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-lg font-bold mb-2">Track Demo</h3>
      <audio controls src={url} style={{ width: '100%' }} />
    </div>
  );
} 