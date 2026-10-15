interface ThaiLinesProps {
  lines: readonly string[];
  className?: string;
}

/**
 * Thai has no word spaces, so browsers break lines mid-phrase. Each phrase is
 * its own block: unbroken from md up, free to wrap inside itself on phones.
 */
export function ThaiLines({ lines, className }: ThaiLinesProps) {
  return (
    <p className={className}>
      {lines.map((line) => (
        <span key={line} className="block md:whitespace-nowrap">
          {line}
        </span>
      ))}
    </p>
  );
}
