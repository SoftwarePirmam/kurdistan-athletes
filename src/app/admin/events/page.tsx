"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { formatEventDate, toDateTimeLocalValue } from "@/lib/events";

type EventItem = {
  id: string;
  title: string;
  summary: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  published: boolean;
};

const emptyForm = {
  title: "",
  summary: "",
  location: "",
  startsAt: "",
  endsAt: "",
  imageUrl: "",
  ctaLabel: "Join Us",
  ctaHref: "/register",
  published: true,
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/events", { cache: "no-store" });
    if (!response.ok) {
      setStatus("Could not load events.");
      return;
    }
    const data = (await response.json()) as { events: EventItem[] };
    setEvents(data.events);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(event: EventItem) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      summary: event.summary,
      location: event.location,
      startsAt: toDateTimeLocalValue(event.startsAt),
      endsAt: event.endsAt ? toDateTimeLocalValue(event.endsAt) : "",
      imageUrl: event.imageUrl || "",
      ctaLabel: event.ctaLabel || "",
      ctaHref: event.ctaHref || "",
      published: event.published,
    });
    setStatus(`Editing: ${event.title}`);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setStatus("");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const payload = {
      title: form.title,
      summary: form.summary,
      location: form.location,
      startsAt: form.startsAt,
      endsAt: form.endsAt || null,
      imageUrl: form.imageUrl || null,
      ctaLabel: form.ctaLabel || null,
      ctaHref: form.ctaHref || null,
      published: form.published,
    };

    const response = await fetch(
      editingId ? `/api/admin/events/${editingId}` : "/api/admin/events",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setSaving(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(data?.error || "Could not save event.");
      return;
    }

    resetForm();
    setStatus(editingId ? "Event updated." : "Event created.");
    await load();
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this event?")) return;
    const response = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setStatus("Could not delete event.");
      return;
    }
    if (editingId === id) resetForm();
    setStatus("Event deleted.");
    await load();
  }

  return (
    <AdminShell
      title="Events"
      subtitle="Add upcoming events. Published events appear on the public Events page."
    >
      <div className="admin-card">
        <form className="admin-form" onSubmit={onSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
            required
          />

          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            value={form.summary}
            onChange={(e) => setForm((current) => ({ ...current, summary: e.target.value }))}
            required
          />

          <label htmlFor="location">Location</label>
          <input
            id="location"
            value={form.location}
            onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
            required
          />

          <label htmlFor="startsAt">Starts</label>
          <input
            id="startsAt"
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => setForm((current) => ({ ...current, startsAt: e.target.value }))}
            required
          />

          <label htmlFor="endsAt">Ends (optional)</label>
          <input
            id="endsAt"
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => setForm((current) => ({ ...current, endsAt: e.target.value }))}
          />

          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            id="imageUrl"
            value={form.imageUrl}
            onChange={(e) => setForm((current) => ({ ...current, imageUrl: e.target.value }))}
            placeholder="/uploads/event.jpg"
          />

          <label htmlFor="ctaLabel">Button label (optional)</label>
          <input
            id="ctaLabel"
            value={form.ctaLabel}
            onChange={(e) => setForm((current) => ({ ...current, ctaLabel: e.target.value }))}
          />

          <label htmlFor="ctaHref">Button link (optional)</label>
          <input
            id="ctaHref"
            value={form.ctaHref}
            onChange={(e) => setForm((current) => ({ ...current, ctaHref: e.target.value }))}
            placeholder="/register"
          />

          <label>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((current) => ({ ...current, published: e.target.checked }))}
            />{" "}
            Published on website
          </label>

          {status ? <p className="form-note">{status}</p> : null}

          <div className="hero-buttons">
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update event" : "Add event"}
            </button>
            {editingId ? (
              <button className="secondary-btn" type="button" onClick={resetForm} style={{ color: "#111827", borderColor: "#111827" }}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>When</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={4}>No events yet. Add the first one above.</td>
              </tr>
            ) : null}
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <strong>{event.title}</strong>
                  <div className="admin-muted" style={{ margin: 0 }}>
                    {event.location}
                  </div>
                </td>
                <td>{formatEventDate(event.startsAt)}</td>
                <td>
                  <span className={`badge ${event.published ? "online" : "offline"}`}>
                    {event.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td>
                  <button type="button" className="card-link" onClick={() => startEdit(event)}>
                    Edit
                  </button>
                  {" · "}
                  <button type="button" className="card-link" onClick={() => void onDelete(event.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
