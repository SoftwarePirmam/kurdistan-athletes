import Link from "next/link";
import { redirect } from "next/navigation";
import { getPageContent, t } from "@/lib/content";
import { getSession } from "@/lib/session";
import { RichTitle } from "@/components/rich-title";
import { ChatPanel } from "@/components/chat-panel";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const session = await getSession();
  const c = await getPageContent("contact");

  if (session?.user.role === "ADMIN") {
    redirect("/admin/messages");
  }

  return (
    <main id="main">
      <section className="page-hero compact" data-watermark="CONTACT">
        <div className="page-hero-content">
          <p className="hero-small">{t(c, "hero_eyebrow")}</p>
          <RichTitle value={t(c, "hero_title")} />
          <p className="hero-text">{t(c, "hero_text")}</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-info">
          <h2>{t(c, "info_title")}</h2>
          <p>{t(c, "info_text")}</p>
          <div className="contact-details">
            <div className="contact-item">
              <h3>EMAIL</h3>
              <p>
                <a href={`mailto:${t(c, "email")}`}>{t(c, "email")}</a>
              </p>
            </div>
            <div className="contact-item">
              <h3>LOCATION</h3>
              <p>{t(c, "location")}</p>
            </div>
          </div>
        </div>

        {session ? (
          <ChatPanel
            endpoint="/api/chat"
            emptyText="Start the conversation. An admin will reply here."
          />
        ) : (
          <div className="contact-form">
            <h3 style={{ marginBottom: 8 }}>Register to contact us</h3>
            <p style={{ color: "#4b5563", lineHeight: 1.7, marginBottom: 18 }}>
              Only registered users can send messages. Create an account or log in,
              then chat with the Kurdistan Athletes team.
            </p>
            <div className="hero-buttons">
              <Link href="/register?next=/contact" className="primary-btn">
                Create account
              </Link>
              <Link
                href="/login?next=/contact"
                className="secondary-btn"
                style={{ color: "#111827", borderColor: "#111827" }}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
