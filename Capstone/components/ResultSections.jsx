const LABELS = {
  title: "Title",
  metaDescription: "Meta Description",
  canonicalUrl: "Canonical URL",
  ogTitle: "OG Title",
  ogDescription: "OG Description",
  ogType: "OG Type",
  ogUrl: "OG URL",
  ogSiteName: "OG Site Name",
  twitterCard: "Twitter Card",
  twitterTitle: "Twitter Title",
  twitterDescription: "Twitter Description",
  lang: "Language",
  author: "Author",
  robots: "Robots",
};

function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
      {icon}
      <span>{children}</span>
    </div>
  );
}

// Memoized section title with built-in icon
const SECTION_ICONS = {
  quickStats: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  status: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  metadata: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h7" />
    </svg>
  ),
  og: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  twitter: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
};

function MemoizedSectionTitle({ children, iconKey }) {
  return (
    <SectionTitle icon={SECTION_ICONS[iconKey]}>
      {children}
    </SectionTitle>
  );
}

function Value({ value }) {
  if (!value || value === "") {
    return <span className="italic text-gray-400 dark:text-gray-600">Not found</span>;
  }
  return <span className="break-words">{value}</span>;
}

function Row({ label, value, href }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2 py-1.5 border-b border-gray-100 dark:border-[#2a2a2a] last:border-0 text-sm">
      <span className="sm:w-36 sm:flex-shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-gray-800 dark:text-gray-200 min-w-0 flex-1">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <Value value={value} />
        )}
      </span>
    </div>
  );
}

function HttpBadge({ status }) {
  if (status === null || status === undefined) return null;
  const success = status >= 200 && status < 300;
  const redirect = status >= 300 && status < 400;
  const errorStatus = status >= 400;
  const cls = success
    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
    : redirect
      ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
      : errorStatus
        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${cls}`}>
      {status}
    </span>
  );
}

// ─── Quick Stats ────────────────────────────────────────────────────────────
function Stat({ label, value, ok }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-lg bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-[#2a2a2a] min-w-0">
      <span className={`text-sm font-bold ${ok === false ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-gray-100"}`}>
        {value}
      </span>
      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export default function ResultSections({ data, input }) {
  const d = data || {};
  const url = d.finalUrl || d.url || input?.url || "Unknown URL";
  const hasMissing = Array.isArray(d.missingFields) && d.missingFields.length > 0;

  // ── Quick stats ──────────────────────────────────────────────────────────
  const titleLength = d.title ? d.title.length : 0;
  const descLength = d.metaDescription ? d.metaDescription.length : 0;
  const hasOgImage = Boolean(d.ogImage);
  const hasTwitterCard = Boolean(d.twitterCard);
  const hasCanonical = Boolean(d.canonicalUrl);

  return (
    <div className="space-y-4">
      {/* ── Website overview ─────────────────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-[#222] rounded-xl px-4 py-3 flex items-center gap-3">
        {d.favicon && (
          <img src={d.favicon} alt="Favicon" className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-gray-800 p-0.5 border border-gray-200 dark:border-[#2a2a2a] flex-shrink-0" />
        )}
        <div className="min-w-0">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
            {d.title || d.ogTitle || url}
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline break-all"
          >
            {url}
          </a>
        </div>
      </div>

      {/* ── Quick Stats ──────────────────────────────────────────────────── */}
      <div>
        <SectionTitle
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          }
        >
          Quick Stats
        </SectionTitle>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
          <Stat
            label="HTTP"
            value={d.httpStatus ?? "—"}
            ok={d.httpStatus !== null && d.httpStatus >= 200 && d.httpStatus < 300}
          />
          <Stat
            label="Title"
            value={titleLength > 0 ? `${titleLength} chars` : "Missing"}
            ok={titleLength > 0}
          />
          <Stat
            label="Description"
            value={descLength > 0 ? `${descLength} chars` : "Missing"}
            ok={descLength > 0}
          />
          <Stat
            label="OG Image"
            value={hasOgImage ? "Yes" : "No"}
            ok={hasOgImage}
          />
          <Stat
            label="Twitter Card"
            value={hasTwitterCard ? "Yes" : "No"}
            ok={hasTwitterCard}
          />
          <Stat
            label="Canonical"
            value={hasCanonical ? "Yes" : "No"}
            ok={hasCanonical}
          />
        </div>
      </div>

      {/* ── Status ───────────────────────────────────────────────────────── */}
      <div>
        <SectionTitle
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          }
        >
          Status
        </SectionTitle>
        <div className="flex items-center gap-2 flex-wrap">
          <HttpBadge status={d.httpStatus} />
          {d.httpStatus === null && (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic">No HTTP response</span>
          )}
          {d.contentType && (
            <span className="text-xs text-gray-400 dark:text-gray-500">{d.contentType}</span>
          )}
        </div>
      </div>

      {/* ── Metadata ─────────────────────────────────────────────────────── */}
      <div>
        <SectionTitle
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h7" /></svg>
          }
        >
          Metadata
        </SectionTitle>
        <div className="pl-1">
          <Row label="Title" value={d.title} />
          <Row label="Description" value={d.metaDescription} />
          <Row label="Canonical" value={d.canonicalUrl} href={d.canonicalUrl} />
          <Row label="Language" value={d.lang} />
          <Row label="Author" value={d.author} />
          <Row label="Robots" value={d.robots} />
        </div>
      </div>

      {/* ── Open Graph ───────────────────────────────────────────────────── */}
      <div>
        <SectionTitle
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
          }
        >
          Open Graph
        </SectionTitle>
        <div className="pl-1">
          <Row label="OG Title" value={d.ogTitle} />
          <Row label="OG Description" value={d.ogDescription} />
          <Row label="OG URL" value={d.ogUrl} href={d.ogUrl} />
          <Row label="OG Type" value={d.ogType} />
          <Row label="Site Name" value={d.ogSiteName} />
        </div>
        {d.ogImage ? (
          <div className="mt-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">OG Image</span>
            <div className="mt-1 rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#222]">
              <img src={d.ogImage} alt="Open Graph preview" className="w-full max-h-48 object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
          </div>
        ) : (
          <div className="mt-2 text-xs italic text-gray-400 dark:text-gray-600">No Open Graph image found</div>
        )}
      </div>

      {/* ── Twitter Card ─────────────────────────────────────────────────── */}
      <div>
        <SectionTitle
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          }
        >
          Twitter Card
        </SectionTitle>
        <div className="pl-1">
          <Row label="Card" value={d.twitterCard} />
          <Row label="Title" value={d.twitterTitle} />
          <Row label="Description" value={d.twitterDescription} />
          {d.twitterImage && <Row label="Image" value={d.twitterImage} href={d.twitterImage} />}
        </div>
      </div>

      {/* ── Missing metadata warnings ────────────────────────────────────── */}
      {hasMissing && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>Missing Metadata</span>
          </div>
          <ul className="space-y-1">
            {d.missingFields.map((f) => (
              <li key={f} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {LABELS[f] || f} is not set
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}