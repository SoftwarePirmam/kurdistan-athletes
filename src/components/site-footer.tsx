import Link from "next/link";

export function SiteFooter({
  brand,
  tagline,
  copyright,
}: {
  brand: string;
  tagline: string;
  copyright: string;
}) {
  return (
    <footer className="footer">
      <Link className="logo" href="/">
        {brand}
      </Link>
      <nav className="footer-nav" aria-label="Footer">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/events">Events</Link>
        <Link href="/opportunities">Opportunities</Link>
        <Link href="/donate">Donate</Link>
        <Link href="/support">Support</Link>
        <Link href="/ways-we-help">Ways We Help</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/register">Join</Link>
      </nav>
      <p>{tagline}</p>
      <p className="copyright">{copyright}</p>
    </footer>
  );
}
