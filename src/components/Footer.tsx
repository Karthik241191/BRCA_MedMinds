import { Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const footerSections = {
    company: {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Contact", path: "/contact" },
      ],
    },
    services: {
      title: "Services",
      links: [
        { name: "RCM Solutions", path: "/solutions" },
        { name: "Technology", path: "/technology" },
        { name: "KPI Calculator", path: "/calculator" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms of Service", path: "/terms-of-service" },
        { name: "HIPAA Compliance", path: "/hipaa-compliance" },
        { name: "Security", path: "/security" },
        { name: "Cookie Policy", path: "/cookie-policy" },
      ],
    },
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <img
              src="/images/MedMinds.png"
              alt="MedMinds Healthcare Solutions"
              className="h-16 w-auto object-contain mb-4"
              style={{ maxWidth: "200px", filter: "invert(1) brightness(2)" }}
            />
            <p className="text-background/70 text-sm leading-relaxed mb-6 max-w-sm">
              Leading revenue cycle management solutions powered by expert
              services and AI-driven insights. Transforming healthcare financial
              operations with precision and care.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="px-3 py-1 bg-background/10 rounded text-xs text-background/90">
                SOC 2 Type II
              </div>
              <div className="px-3 py-1 bg-background/10 rounded text-xs text-background/90">
                HITRUST
              </div>
              <div className="px-3 py-1 bg-background/10 rounded text-xs text-background/90">
                ISO 27001
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-background" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} className="text-background" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} className="text-background" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-background mb-4">
              {footerSections.company.title}
            </h4>
            <ul className="space-y-3">
              {footerSections.company.links.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-background mb-4">
              {footerSections.services.title}
            </h4>
            <ul className="space-y-3">
              {footerSections.services.links.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-background mb-4">
              {footerSections.legal.title}
            </h4>
            <ul className="space-y-3">
              {footerSections.legal.links.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/70 text-sm">
              © 2025 MedMinds Healthcare Solutions. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                to="/privacy-policy"
                className="text-background/70 hover:text-background text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-background/70 hover:text-background text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/hipaa-compliance"
                className="text-background/70 hover:text-background text-sm transition-colors"
              >
                HIPAA Compliance
              </Link>
              <Link
                to="/security"
                className="text-background/70 hover:text-background text-sm transition-colors"
              >
                Security
              </Link>
              <Link
                to="/cookie-policy"
                className="text-background/70 hover:text-background text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
