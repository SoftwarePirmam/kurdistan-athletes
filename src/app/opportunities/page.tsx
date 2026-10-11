import Link from "next/link";
import { getPageContent, t } from "@/lib/content";
import { RichTitle } from "@/components/rich-title";

export const metadata = { title: "Opportunities" };

export default async function OpportunitiesPage() {
  const c = await getPageContent("opportunities");

  return (
    <main id="main">
      <section className="opportunities-hero" data-watermark="OPPORTUNITIES">
        <div className="opportunities-hero-content">
          <p className="hero-small">{t(c, "hero_eyebrow")}</p>
          <RichTitle value={t(c, "hero_title")} />
          <p className="hero-text">{t(c, "hero_text")}</p>
          <div className="hero-buttons">
            <Link href="/register" className="primary-btn">
              Join Us
            </Link>
            <a href="#opportunity-list" className="secondary-btn">
              Explore Opportunities
            </a>
          </div>
        </div>
      </section>

      <section className="opportunities-intro">
        <div className="section-label">{t(c, "intro_label")}</div>
        <div className="opportunities-intro-grid">
          <RichTitle as="h2" value={t(c, "intro_title")} />
          <p>{t(c, "intro_text")}</p>
        </div>
      </section>

      <section className="opportunity-list" id="opportunity-list">
        <div className="section-label">{t(c, "list_label")}</div>
        <div className="opportunity-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <article className={`opportunity-card${n === 2 ? " featured" : ""}`} key={n}>
              <div className="opportunity-number">0{n}</div>
              <div>
                <p className="opportunity-tag">{t(c, `card_${n}_tag`)}</p>
                <h3>{t(c, `card_${n}_title`)}</h3>
                <p>{t(c, `card_${n}_text`)}</p>
              </div>
              <Link href="/register" className="card-link">
                Learn More →
              </Link>
            </article>
          ))}
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

      <section className="opportunities-closing">
        <p className="hero-small">{t(c, "closing_eyebrow")}</p>
        <RichTitle as="h2" value={t(c, "closing_title")} />
        <p>{t(c, "closing_text")}</p>
        <Link href="/register" className="primary-btn">
          Join Kurdistan Athletes
        </Link>
      </section>
    </main>
  );
}
