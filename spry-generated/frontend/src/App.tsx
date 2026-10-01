import { useCallback, useEffect, useState } from "react";
import { listMeetings, type Meeting } from "./api";
import MeetingForm from "./components/MeetingForm";
import MeetingList from "./components/MeetingList";

export default function App() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setMeetings(await listMeetings());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load meetings");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="mx-auto grid max-w-2xl gap-6 p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Meetings</h1>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <MeetingList meetings={meetings} />
      <h2 className="text-lg font-semibold text-slate-900">Add a meeting</h2>
      <MeetingForm onCreated={load} />
    </main>
  );
}
