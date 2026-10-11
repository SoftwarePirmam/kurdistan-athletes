import { splitLines } from "@/lib/utils";

export function RichTitle({
  value,
  as: Tag = "h1",
  className,
}: {
  value: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const lines = splitLines(value);
  if (!lines.length) return null;

  return (
    <Tag className={className}>
      {lines.map((line, index) => {
        const isLast = index === lines.length - 1;
        return (
          <span key={`${line}-${index}`}>
            {isLast ? <span>{line}</span> : line}
            {index < lines.length - 1 ? <br /> : null}
          </span>
        );
      })}
    </Tag>
  );
}
