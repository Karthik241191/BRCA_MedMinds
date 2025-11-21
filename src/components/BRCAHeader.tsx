import { Link } from "react-router-dom";

export function BRCAHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background backdrop-blur-lg shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img
                src="/images/MedMinds.png"
                alt="MedMinds Healthcare Solutions"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <div className="hidden sm:block border-l border-border pl-4">
              <h1 className="text-lg font-medium text-foreground">
                BRCA Criteria Checker
              </h1>
              <p className="text-xs text-muted-foreground">
                Genetic Testing Authorization Tool
              </p>
            </div>
          </div>

          {/* Info Badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm text-muted-foreground">
              HIPAA Compliant • No Data Transmitted
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
