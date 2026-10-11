import Link from "next/link";
import { getPageContent, t } from "@/lib/content";
import { RichTitle } from "@/components/rich-title";

export const metadata = { title: "Ways We Help" };

export default async function WaysWeHelpPage() {
  const c = await getPageContent("ways");

  return (
    <main id="main">
      <section className="page-hero" data-watermark="HELP">
        <div className="page-hero-content">
          <p className="hero-small">{t(c, "hero_eyebrow")}</p>
          <RichTitle value={t(c, "hero_title")} />
          <p className="hero-text">{t(c, "hero_text")}</p>
        </div>
      </section>

      <section className="opportunities-intro">
        <div className="section-label">{t(c, "intro_label")}</div>
        <div className="opportunities-intro-grid">
          <RichTitle as="h2" value={t(c, "intro_title")} />
          <p>{t(c, "intro_text")}</p>
        </div>
      </section>

      <section className="opportunity-list">
        <div className="section-label">{t(c, "list_label")}</div>
        <div className="opportunity-grid ways-grid">
          {[1, 2, 3, 4].map((n) => (
            <article className={`opportunity-card${n === 1 ? " featured" : ""}`} key={n}>
              <div className="opportunity-number">0{n}</div>
              <div>
                <p className="opportunity-tag">{t(c, `card_${n}_tag`)}</p>
                <h3>{t(c, `card_${n}_title`)}</h3>
                <p>{t(c, `card_${n}_text`)}</p>
              </div>
              <Link href="/contact" className="card-link">
                Ask about this →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="page-closing">
        <p className="hero-small">{t(c, "closing_eyebrow")}</p>
        <RichTitle as="h2" value={t(c, "closing_title")} />
        <p>{t(c, "closing_text")}</p>
        <Link href="/register" className="primary-btn">
          Join Us
        </Link>
      </section>
    </main>
  );
}
