const API_URL = import.meta.env.VITE_API_URL as string;

export type Meeting = {
  id: number;
  title: string;
  starts_at: string;
  ends_at: string;
  attendee_count: number;
};

export type NewMeeting = Omit<Meeting, "id">;

async function errorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (Array.isArray(body.detail)) {
      return body.detail.map((d: { msg: string }) => d.msg).join("; ");
    }
  } catch {
    // body was not JSON; fall through
  }
  return `Request failed with status ${res.status}`;
}

export async function listMeetings(): Promise<Meeting[]> {
  const res = await fetch(`${API_URL}/api/meetings`);
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json();
}

export async function createMeeting(meeting: NewMeeting): Promise<Meeting> {
  const res = await fetch(`${API_URL}/api/meetings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meeting),
  });
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json();
}
