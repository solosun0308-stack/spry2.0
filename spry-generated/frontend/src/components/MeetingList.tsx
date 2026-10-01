import type { Meeting } from "../api";

function format(iso: string) {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

export default function MeetingList({ meetings }: { meetings: Meeting[] }) {
  if (meetings.length === 0) {
    return <p className="text-slate-600">No meetings yet. Add the first one below.</p>;
  }
  return (
    <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
      {meetings.map((m) => (
        <li key={m.id} className="flex items-baseline justify-between gap-4 px-4 py-3">
          <div>
            <p className="font-medium text-slate-900">{m.title}</p>
            <p className="text-sm text-slate-600">
              {format(m.starts_at)} to {format(m.ends_at)}
            </p>
          </div>
          <p className="text-sm text-slate-600">{m.attendee_count} attending</p>
        </li>
      ))}
    </ul>
  );
}
