export default function Loading() {
  return (
    <main className="loadingPage shell" aria-busy="true" aria-label="Loading storefront">
      <div className="loadingHeader skeleton" />
      <div className="loadingHero">
        <div className="loadingCopy">
          <div className="skeleton line short" />
          <div className="skeleton titleBlock" />
          <div className="skeleton line" />
          <div className="skeleton buttonBlock" />
        </div>
        <div className="skeleton visualBlock" />
      </div>
    </main>
  );
}