export function BRCAFooter() {
  return (
    <footer className="mt-16 md:mt-20 border-t border-border bg-muted/30">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* About Section */}
          <div>
            <h3 className="font-medium mb-3">About BRCA Testing</h3>
            <p className="text-sm text-muted-foreground">
              BRCA1 and BRCA2 are genes that produce proteins to help repair damaged DNA.
              Mutations in these genes can increase the risk of breast, ovarian, and other cancers.
            </p>
          </div>

          {/* Criteria Information */}
          <div>
            <h3 className="font-medium mb-3">Evaluation Criteria</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Personal cancer history</li>
              <li>• Family history analysis</li>
              <li>• Age at diagnosis factors</li>
              <li>• Genetic counseling status</li>
              <li>• Payer-specific requirements</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="font-medium mb-3">Important Notice</h3>
            <p className="text-sm text-muted-foreground">
              This tool provides preliminary criteria assessment only. Final authorization
              decisions are made by payers. Always verify with current payer policies.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <img
                src="/images/MedMinds.png"
                alt="MedMinds"
                className="h-8 w-auto opacity-70"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 md:mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MedMinds Healthcare Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure & Private
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Browser-Based Tool</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
