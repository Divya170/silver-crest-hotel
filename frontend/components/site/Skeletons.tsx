export function SkeletonBlock({ h = 16, w = '100%', style }: { h?: number | string; w?: number | string; style?: React.CSSProperties }) {
  return <div className="skel" aria-hidden="true" style={{ height: h, width: w, ...style }} />;
}

export function PageSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading page">
      <span className="sr">Loading…</span>
      <div className="skel" style={{ height: 'clamp(420px, 60vh, 640px)', borderRadius: 0 }} />
      <div className="wrap section" style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
        <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SkeletonBlock h={12} w={160} />
          <SkeletonBlock h={52} w="85%" />
          <SkeletonBlock h={52} w="60%" />
          <SkeletonBlock h={16} w="90%" style={{ marginTop: 16 }} />
          <SkeletonBlock h={16} w="80%" />
        </div>
        <div style={{ flex: '1 1 380px' }}><SkeletonBlock h={420} /></div>
      </div>
    </div>
  );
}
