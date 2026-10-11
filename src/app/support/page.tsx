import Link from "next/link";
import { getPageContent, t } from "@/lib/content";
import { RichTitle } from "@/components/rich-title";

export const metadata = { title: "Support Our Mission" };

export default async function SupportPage() {
  const c = await getPageContent("support");

  return (
    <main id="main">
      <section className="page-hero" data-watermark="MISSION">
        <div className="page-hero-content">
          <p className="hero-small">{t(c, "hero_eyebrow")}</p>
          <RichTitle value={t(c, "hero_title")} />
          <p className="hero-text">{t(c, "hero_text")}</p>
        </div>
      </section>

      <section className="steps-section">
        <div className="section-label">{t(c, "steps_label")}</div>
        <RichTitle as="h2" value={t(c, "steps_title")} />
        <div className="steps-grid">
          {[1, 2, 3, 4].map((n) => (
            <div className="step" key={n}>
              <span>0{n}</span>
              <h3>{t(c, `step_${n}_title`)}</h3>
              <p>{t(c, `step_${n}_text`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="form-section">
        <div className="panel-copy">
          <p className="section-label">{t(c, "form_label")}</p>
          <RichTitle as="h2" value={t(c, "form_title")} />
          <p>{t(c, "form_text")}</p>
        </div>
        <div className="support-form">
          <p>
            Register for a free account, then open Contact to message the team
            directly. We reply in the same chat.
          </p>
          <div className="hero-buttons" style={{ marginTop: 20 }}>
            <Link href="/register" className="primary-btn">
              Create account
            </Link>
            <Link href="/contact" className="secondary-btn" style={{ color: "#111827", borderColor: "#111827" }}>
              Open contact chat
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
