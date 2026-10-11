import Link from "next/link";
import { getPageContent, t } from "@/lib/content";
import { RichTitle } from "@/components/rich-title";

export const metadata = { title: "Donate" };

export default async function DonatePage() {
  const c = await getPageContent("donate");
  const qrImage = t(c, "qr_image");
  const numberValue = t(c, "number_value");

  return (
    <main id="main">
      <section className="page-hero" data-watermark="DONATE">
        <div className="page-hero-content">
          <p className="hero-small">{t(c, "hero_eyebrow")}</p>
          <RichTitle value={t(c, "hero_title")} />
          <p className="hero-text">{t(c, "hero_text")}</p>
        </div>
      </section>

      <section className="form-section donate-section">
        <div className="panel-copy">
          <p className="section-label">{t(c, "methods_label")}</p>
          <RichTitle as="h2" value={t(c, "methods_title")} />
          <p>{t(c, "methods_text")}</p>
          <div className="hero-buttons" style={{ marginTop: 28 }}>
            <Link href="/contact" className="primary-btn">
              {t(c, "cta_label", "Message us after donating")}
            </Link>
          </div>
        </div>

        <div className="donate-methods">
          <article className="donate-card">
            <p className="section-label">FIB QR</p>
            {qrImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrImage} alt="FIB donation QR code" className="donate-qr" />
            ) : (
              <div className="donate-qr-placeholder">
                QR code will appear here after you upload it in Admin → Website content → Donate.
              </div>
            )}
            <p className="donate-caption">{t(c, "qr_caption")}</p>
          </article>

          <article className="donate-card">
            <p className="section-label">{t(c, "number_label")}</p>
            <p className="donate-number">{numberValue}</p>
            <p>{t(c, "number_note")}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
