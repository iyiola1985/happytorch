import Link from "next/link";

export function RuleLink({
  href,
  children,
  inverted = false,
}: {
  href: string;
  children: React.ReactNode;
  inverted?: boolean;
}) {
  const className = `rule-link ${inverted ? "text-ivory" : "text-espresso"}`;
  if (href.startsWith("http")) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        <span>{children}</span>
        <span className="line" />
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      <span>{children}</span>
      <span className="line" />
    </Link>
  );
}
