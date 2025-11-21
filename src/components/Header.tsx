import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactClick = () => {
    navigate("/contact");
    setMobileMenuOpen(false);
    // Wait for navigation to complete, then scroll to form
    setTimeout(() => {
      const formElement = document.getElementById("contact-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
        // Focus on the first input field
        const firstInput = formElement.querySelector("input");
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 300);
        }
      }
    }, 100);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/solutions" },
    { name: "Technology", path: "/technology" },
    { name: "Calculator", path: "/calculator" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border transition-all duration-300 ${
        isScrolled 
          ? "bg-background backdrop-blur-lg shadow-lg" 
          : "bg-background backdrop-blur-sm"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/images/MedMinds.png"
                alt="MedMinds Healthcare Solutions"
                className="h-16 w-auto object-contain"
                style={{ maxWidth: "200px" }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center" style={{ gap: "2rem" }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="nav-link-animated text-foreground hover:text-primary font-medium text-base py-2 px-2"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
              onClick={handleContactClick}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="nav-link-mobile text-foreground font-medium text-base py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                variant="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full mt-2"
                onClick={handleContactClick}
              >
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
