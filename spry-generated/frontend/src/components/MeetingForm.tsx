import { useState } from "react";
import { createMeeting } from "../api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function MeetingForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [attendees, setAttendees] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createMeeting({
        title,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: new Date(endsAt).toISOString(),
        attendee_count: Number(attendees),
      });
      setTitle("");
      setStartsAt("");
      setEndsAt("");
      setAttendees("0");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the meeting");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-md border border-slate-200 bg-white p-4">
      <div className="grid gap-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} maxLength={200} required onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1">
          <Label htmlFor="starts_at">Starts</Label>
          <Input id="starts_at" type="datetime-local" value={startsAt} required onChange={(e) => setStartsAt(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="ends_at">Ends</Label>
          <Input id="ends_at" type="datetime-local" value={endsAt} required onChange={(e) => setEndsAt(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-1">
        <Label htmlFor="attendee_count">Attendees</Label>
        <Input id="attendee_count" type="number" min={0} step={1} value={attendees} required onChange={(e) => setAttendees(e.target.value)} />
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add meeting"}</Button>
      </div>
    </form>
  );
}
