type PictureProps = { index: number; className?: string };

// Plain, familiar objects with no decorative faces or answer text.
export function PracticePicture({ index, className }: PictureProps) {
  return (
    <svg viewBox="0 0 360 320" className={className} role="img" aria-label="ภาพโจทย์">
      {index === 0 && (
        <>
          <circle cx="180" cy="166" r="121" fill="#eaf3ff" />
          <circle cx="180" cy="156" r="117" fill="#2f80ed" />
          <circle cx="180" cy="156" r="100" fill="#fff" stroke="#c8ddfa" strokeWidth="3" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <path key={angle} d="M180 70v9" transform={`rotate(${angle} 180 156)`} stroke="#6b87ad" strokeWidth="4" strokeLinecap="round" />
          ))}
          <path d="M180 97v59l45 27" fill="none" stroke="#1e3a5f" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="180" cy="156" r="9" fill="#2f80ed" />
        </>
      )}
      {index === 1 && (
        <>
          <ellipse cx="180" cy="282" rx="88" ry="8" fill="#e3e8ef" />
          <path d="M181 98c-4-24 1-38 13-54" stroke="#4f5663" strokeWidth="12" strokeLinecap="round" />
          <path d="M184 77c4-37 40-49 65-35-7 31-39 47-65 35" fill="#56817a" />
          <path d="M182 98c-38-28-97-18-111 32-18 65 26 140 67 143 20 2 26-6 43-6s26 9 44 6c44-7 84-80 65-143-15-49-72-60-108-32Z" fill="#c96764" />
          <path d="M110 128c-10 10-15 26-14 40" fill="none" stroke="#f5b0a5" strokeWidth="11" strokeLinecap="round" />
          <path d="M163 102c9 6 28 7 39-1" fill="none" stroke="#9c514f" strokeWidth="5" strokeLinecap="round" />
        </>
      )}
      {index === 2 && (
        <>
          <ellipse cx="180" cy="283" rx="91" ry="8" fill="#e3e8ef" />
          <path d="M236 256c65 3 69-76 43-86" fill="none" stroke="#7d91aa" strokeWidth="24" strokeLinecap="round" />
          <ellipse cx="180" cy="220" rx="67" ry="62" fill="#91a4be" />
          <path d="m111 117-3-70 55 37m86 33 3-70-55 37" fill="#91a4be" stroke="#91a4be" strokeWidth="10" strokeLinejoin="round" />
          <path d="m119 95-1-31 26 22m97 9 1-31-26 22" fill="#c3cedd" />
          <ellipse cx="180" cy="138" rx="77" ry="66" fill="#aebed3" />
          <path d="m169 79 3 17m16-17-3 17" stroke="#7088a8" strokeWidth="7" strokeLinecap="round" />
          <path d="m138 133 12 1m60 0 12-1" stroke="#1e3a5f" strokeWidth="5" strokeLinecap="round" />
          <path d="m174 150 6 6 6-6" fill="#586d89" stroke="#586d89" strokeWidth="4" strokeLinejoin="round" />
          <path d="m180 156-7 7m7-7 7 7m-59-11-37-6m37 17-37 5m141-16 37-6m-37 17 37 5" stroke="#586d89" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="180" cy="238" rx="29" ry="35" fill="#eaf0f7" />
          <path d="M150 251v20m60-20v20" stroke="#7088a8" strokeWidth="5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
