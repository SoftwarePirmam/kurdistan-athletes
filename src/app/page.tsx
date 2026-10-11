import Link from "next/link";
import { getPageContent, t } from "@/lib/content";
import { RichTitle } from "@/components/rich-title";

export default async function HomePage() {
  const c = await getPageContent("home");

  return (
    <main id="main">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-small">{t(c, "hero_eyebrow")}</p>
          <RichTitle value={t(c, "hero_title")} />
          <p className="hero-text">{t(c, "hero_text")}</p>
          <div className="hero-buttons">
            <Link href={t(c, "hero_primary_href", "/opportunities")} className="primary-btn">
              {t(c, "hero_primary_label")}
            </Link>
            <Link href={t(c, "hero_secondary_href", "/about")} className="secondary-btn">
              {t(c, "hero_secondary_label")}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-story">
        <div className="section-label">{t(c, "story_label")}</div>
        <div className="home-story-grid about-grid">
          <div className="about-heading">
            <RichTitle as="h2" value={t(c, "story_title")} />
          </div>
          <div className="about-copy">
            <p>{t(c, "story_p1")}</p>
            <p>{t(c, "story_p2")}</p>
            <Link href="/about" className="secondary-btn">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="home-paths">
        <div className="section-label">{t(c, "paths_label")}</div>
        <div className="path-grid">
          <Link className="path-card" href="/opportunities">
            <span>01</span>
            <div>
              <h3>Opportunities</h3>
              <p>Workshops, events, recognition, and ways to show what you can do.</p>
            </div>
            <em>Explore →</em>
          </Link>
          <Link className="path-card" href="/ways-we-help">
            <span>02</span>
            <div>
              <h3>Ways We Help</h3>
              <p>Coaching connections, athlete support, and introductions that move a journey forward.</p>
            </div>
            <em>See how →</em>
          </Link>
          <Link className="path-card" href="/support">
            <span>03</span>
            <div>
              <h3>Support the Mission</h3>
              <p>Encourage a young athlete, mentor, or partner with the community around them.</p>
            </div>
            <em>Get involved →</em>
          </Link>
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
            <Link href="/ways-we-help" className="primary-btn">
              See How We Help
            </Link>
          </div>
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
          <Link href="/contact" className="secondary-btn">
            Get In Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
