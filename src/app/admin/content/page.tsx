"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";

type Block = {
  id: string;
  page: string;
  key: string;
  label: string;
  type: string;
  value: string;
};

const pages = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "opportunities", label: "Opportunities" },
  { id: "support", label: "Support" },
  { id: "ways", label: "Ways We Help" },
  { id: "contact", label: "Contact" },
  { id: "site", label: "Site-wide" },
];

export default function AdminContentPage() {
  const [page, setPage] = useState("home");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setStatus("Loading...");
      const response = await fetch(`/api/admin/content?page=${page}`, { cache: "no-store" });
      if (!response.ok) {
        setStatus("Could not load content.");
        return;
      }
      const data = (await response.json()) as { blocks: Block[] };
      setBlocks(data.blocks);
      setValues(Object.fromEntries(data.blocks.map((block) => [block.id, block.value])));
      setStatus("");
    }

    void load();
  }, [page]);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: blocks.map((block) => ({
          id: block.id,
          value: values[block.id] ?? "",
        })),
      }),
    });

    setSaving(false);
    setStatus(response.ok ? "Saved. Changes are live on the website." : "Save failed.");
  }

  async function onUpload(blockId: string, file: File | null) {
    if (!file) return;
    setStatus("Uploading image...");
    const form = new FormData();
    form.append("file", file);
    form.append("blockId", blockId);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      setStatus("Upload failed.");
      return;
    }

    const data = (await response.json()) as { path: string };
    setValues((current) => ({ ...current, [blockId]: data.path }));
    setStatus("Image uploaded. Click Save to confirm related text fields if needed.");
  }

  return (
    <AdminShell
      title="Website content"
      subtitle="Edit page text and images here. No code changes needed."
    >
      <div className="admin-card">
        <div className="page-tabs">
          {pages.map((item) => (
            <button
              key={item.id}
              type="button"
              className={page === item.id ? "active" : undefined}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form className="content-grid" onSubmit={onSave}>
          {blocks.map((block) => (
            <div className="content-field" key={block.id}>
              <label htmlFor={block.id}>{block.label}</label>
              {block.type === "image" ? (
                <>
                  {values[block.id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="content-preview" src={values[block.id]} alt={block.label} />
                  ) : null}
                  <input
                    id={block.id}
                    value={values[block.id] || ""}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [block.id]: event.target.value }))
                    }
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => void onUpload(block.id, event.target.files?.[0] || null)}
                  />
                </>
              ) : (
                <textarea
                  id={block.id}
                  value={values[block.id] || ""}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [block.id]: event.target.value }))
                  }
                />
              )}
            </div>
          ))}

          {status ? <p className="form-note">{status}</p> : null}
          <button className="primary-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save content"}
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
