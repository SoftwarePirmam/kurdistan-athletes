import Link from "next/link";
import { getPageContent, t } from "@/lib/content";
import { formatEventDate, startOfToday } from "@/lib/events";
import { prisma } from "@/lib/prisma";
import { RichTitle } from "@/components/rich-title";

export const metadata = { title: "Events" };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const c = await getPageContent("events");
  const today = startOfToday();

  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startsAt: "asc" },
  });

  const upcoming = events.filter((event) => event.startsAt >= today);
  const past = events.filter((event) => event.startsAt < today).reverse();

  return (
    <main id="main">
      <section className="page-hero" data-watermark="EVENTS">
        <div className="page-hero-content">
          <p className="hero-small">{t(c, "hero_eyebrow")}</p>
          <RichTitle value={t(c, "hero_title")} />
          <p className="hero-text">{t(c, "hero_text")}</p>
          <div className="hero-buttons">
            <Link href="/register" className="primary-btn">
              Join Us
            </Link>
            <a href="#upcoming-events" className="secondary-btn">
              See Events
            </a>
          </div>
        </div>
      </section>

      <section className="opportunity-list" id="upcoming-events">
        <div className="section-label">{t(c, "list_label")}</div>

        {upcoming.length === 0 ? (
          <div className="events-empty">
            <p>{t(c, "empty_text")}</p>
            <Link href="/register" className="primary-btn">
              Join the community
            </Link>
          </div>
        ) : (
          <div className="events-grid">
            {upcoming.map((event, index) => (
              <article className={`event-card${index === 0 ? " featured" : ""}`} key={event.id}>
                {event.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.imageUrl} alt={event.title} className="event-image" />
                ) : null}
                <div className="event-meta">
                  <span>{formatEventDate(event.startsAt)}</span>
                  <span>{event.location}</span>
                </div>
                <h3>{event.title}</h3>
                <p>{event.summary}</p>
                {event.ctaLabel && event.ctaHref ? (
                  <Link href={event.ctaHref} className="card-link">
                    {event.ctaLabel} →
                  </Link>
                ) : (
                  <Link href="/contact" className="card-link">
                    Ask about this →
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 ? (
        <section className="steps-section">
          <div className="section-label">{t(c, "past_label")}</div>
          <div className="events-grid">
            {past.map((event) => (
              <article className="event-card past" key={event.id}>
                <div className="event-meta">
                  <span>{formatEventDate(event.startsAt)}</span>
                  <span>{event.location}</span>
                </div>
                <h3>{event.title}</h3>
                <p>{event.summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
