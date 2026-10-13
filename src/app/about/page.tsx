import Link from "next/link";
import { getPageContent, t } from "@/lib/content";
import { RichTitle } from "@/components/rich-title";

export const metadata = {
  title: "About Us",
};

export default async function AboutPage() {
  const c = await getPageContent("about");

  return (
    <main id="main">
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="hero-small">{t(c, "hero_eyebrow")}</p>
          <RichTitle value={t(c, "hero_title")} />
          <p className="hero-text">{t(c, "hero_text")}</p>
        </div>
        <div className="about-hero-number">
          <span>01</span>
          <p>
            OUR
            <br />
            STORY
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="section-label">{t(c, "story_label")}</div>
        <div className="about-grid">
          <div className="about-heading">
            <RichTitle as="h2" value={t(c, "story_title")} />
          </div>
          <div className="about-copy">
            <p>{t(c, "story_p1")}</p>
            <p>{t(c, "story_p2")}</p>
            <p>{t(c, "story_p3")}</p>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-card">
          <div>
            <p className="section-label">{t(c, "mission_label")}</p>
            <RichTitle as="h2" value={t(c, "mission_title")} />
          </div>
          <div className="mission-copy">
            <p>{t(c, "mission_p1")}</p>
            <p>{t(c, "mission_p2")}</p>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="section-label">{t(c, "why_label")}</div>
        <div className="why-intro">
          <RichTitle as="h2" value={t(c, "why_title")} />
          <p>{t(c, "why_text")}</p>
        </div>
        <div className="values-grid">
          {[1, 2, 3, 4].map((n) => (
            <article className="value-card" key={n}>
              <span>0{n}</span>
              <h3>{t(c, `value_${n}_title`)}</h3>
              <p>{t(c, `value_${n}_text`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="founder-section">
        <div className="founder-image">
          <img
            src={t(c, "founder_image", "/images/founder.jpg")}
            alt="Founder of Kurdistan Athletes"
          />
        </div>
        <div className="founder-content">
          <p className="section-label">{t(c, "founder_label")}</p>
          <RichTitle as="h2" value={t(c, "founder_title")} />
          <p>{t(c, "founder_p1")}</p>
          <p>{t(c, "founder_p2")}</p>
          {t(c, "founder_instagram") ? (
            <a
              className="founder-social"
              href={`https://instagram.com/${t(c, "founder_instagram")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram @{t(c, "founder_instagram")}
            </a>
          ) : null}
          <Link href="/contact" className="secondary-btn">
            Get In Touch
          </Link>
        </div>
      </section>

      <section className="about-closing">
        <p className="hero-small">{t(c, "closing_eyebrow")}</p>
        <RichTitle as="h2" value={t(c, "closing_title")} />
        <p>{t(c, "closing_text")}</p>
        <div className="hero-buttons">
          <Link href="/register" className="primary-btn">
            Join Kurdistan Athletes
          </Link>
          <Link href="/opportunities" className="secondary-btn">
            Explore Opportunities
          </Link>
        </div>
      </section>
    </main>
  );
}
