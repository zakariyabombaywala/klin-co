export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-sm bg-inverse px-4 py-3 text-sm font-medium text-inverse-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:outline-2 focus:outline-offset-2 focus:outline-ring"
    >
      Skip to main content
    </a>
  );
}
