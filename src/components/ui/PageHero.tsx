import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface HeroStat {
  label: string;
  value: string;
}

interface HeroButton {
  text: string;
  icon?: LucideIcon;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  onClick?: () => void;
  href?: string;
}

interface PageHeroProps {
  // Background - supports single image or multiple images for carousel
  backgroundImage?: string;
  backgroundImages?: string[];
  overlayColor?: "dark" | "blue" | "teal" | "gradient";

  // Carousel settings (only applies when backgroundImages is used)
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;

  // Content
  badge?: string;
  badgeVariant?: "default" | "outline";
  title: string;
  titleGradient?: "default" | "blue" | "orange" | "teal";
  subtitle?: string;
  description: string;

  // Icon
  icon?: LucideIcon;
  iconColor?: string;

  // Actions
  primaryButton?: HeroButton;
  secondaryButton?: HeroButton;

  // Stats (optional)
  stats?: HeroStat[];

  // Layout
  height?: "default" | "tall" | "full";
  textAlign?: "center" | "left";
}

export function PageHero({
  backgroundImage,
  backgroundImages,
  overlayColor = "dark",
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavigation = true,
  showDots = true,
  badge,
  badgeVariant = "outline",
  title,
  titleGradient = "default",
  subtitle,
  description,
  icon: Icon,
  iconColor = "text-primary",
  primaryButton,
  secondaryButton,
  stats,
  height = "default",
  textAlign = "center",
}: PageHeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use backgroundImages if provided, otherwise fall back to single backgroundImage
  const images = backgroundImages || (backgroundImage ? [backgroundImage] : []);
  const isCarousel = images.length > 1;

  // Auto-play functionality
  useEffect(() => {
    if (!isCarousel || !autoPlay) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isCarousel, autoPlay, autoPlayInterval, images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const getHeightClass = () => {
    switch (height) {
      case "tall":
        return "min-h-[90vh]";
      case "full":
        return "min-h-screen";
      default:
        return "min-h-[80vh]";
    }
  };

  const getOverlayClass = () => {
    switch (overlayColor) {
      case "blue":
        return "bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-teal-900/50";
      case "teal":
        return "bg-gradient-to-br from-teal-900/70 via-teal-800/60 to-blue-900/50";
      case "gradient":
        return "bg-gradient-to-br from-primary/70 via-secondary/60 to-accent/50";
      default:
        return "bg-black/40";
    }
  };

  const getTitleGradientClass = () => {
    switch (titleGradient) {
      case "blue":
        return "bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent";
      case "orange":
        return "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300";
      case "teal":
        return "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300";
      default:
        return "text-white";
    }
  };

  const getTextAlignClass = () => {
    return textAlign === "center" ? "text-center" : "text-left";
  };

  const handleButtonClick = (button: HeroButton) => {
    if (button.href) {
      window.open(button.href, "_blank");
    } else if (button.onClick) {
      button.onClick();
    }
  };

  return (
    <section
      className={`relative ${getHeightClass()} flex items-center justify-center overflow-hidden`}
      style={{ position: 'relative' }}
    >
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            inset: '0',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: index === currentImageIndex ? 1 : 0,
            transition: 'opacity 1000ms ease-in-out',
            filter: overlayColor === "dark" ? "none" : "brightness(0.75)",
            zIndex: 0,
          }}
        >
          <div className={`absolute inset-0 ${getOverlayClass()}`} style={{ zIndex: 1 }}></div>
        </div>
      ))}

      {/* Dots Indicator */}
      {isCarousel && showDots && (
        <div 
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            display: 'flex',
            gap: '12px',
          }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              style={{
                width: index === currentImageIndex ? '14px' : '12px',
                height: index === currentImageIndex ? '14px' : '12px',
                borderRadius: '9999px',
                backgroundColor: index === currentImageIndex ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 300ms',
                boxShadow: index === currentImageIndex ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (index !== currentImageIndex) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentImageIndex) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                }
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hero Content */}
      <div
        className={`relative text-white w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] pb-16 ${getTextAlignClass()}`}
        style={{ zIndex: 10, position: 'relative' }}
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Badge */}
          {badge && (
            <div
              className={
                textAlign === "center"
                  ? "flex justify-center"
                  : "flex justify-start"
              }
            >
              <span
                className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base lg:text-lg rounded-full ${
                  badgeVariant === "outline"
                    ? "border border-white/30 text-white bg-white/10 backdrop-blur-sm"
                    : "bg-primary/20 text-gray-900 backdrop-blur-sm"
                }`}
              >
                {badge}
              </span>
            </div>
          )}

          {/* Icon */}
          {Icon && (
            <div
              className={
                textAlign === "center"
                  ? "flex justify-center"
                  : "flex justify-start"
              }
            >
              <div className="p-3 sm:p-4 rounded-full bg-primary/20 backdrop-blur-sm">
                <Icon
                  size={window.innerWidth < 640 ? 32 : 48}
                  className={iconColor || "text-gray-900"}
                />
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight uppercase tracking-wide ${getTitleGradientClass()}`}
              style={{
                textTransform: "uppercase",
                fontWeight: 900,
                letterSpacing: "0.05em",
                textShadow:
                  "0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.8), 0 8px 40px rgba(0, 0, 0, 0.6)",
              }}
            >
              {subtitle && (
                <>
                  {title}
                  <span className="block">{subtitle}</span>
                </>
              )}
              {!subtitle && title}
            </h1>
          </div>

          {/* Description */}
          <p
            className={`text-lg sm:text-xl md:text-2xl lg:text-2xl leading-relaxed max-w-4xl ${
              textAlign === "center" ? "mx-auto text-gray-100" : "text-gray-100"
            }`}
            style={{
              fontWeight: 500,
              textShadow:
                "0 2px 12px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.7), 0 4px 20px rgba(0, 0, 0, 0.5)",
            }}
          >
            {description}
          </p>

          {/* Buttons */}
          {(primaryButton || secondaryButton) && (
            <div
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${textAlign === "center" ? "justify-center" : "justify-start"}`}
            >
              {primaryButton && (
                <button
                  onClick={() => handleButtonClick(primaryButton)}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {primaryButton.text}
                  {primaryButton.icon && (
                    <primaryButton.icon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              )}
              {secondaryButton && (
                <button
                  onClick={() => handleButtonClick(secondaryButton)}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white/10 transition-all duration-200"
                >
                  {secondaryButton.text}
                  {secondaryButton.icon && (
                    <secondaryButton.icon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 ${textAlign === "center" ? "max-w-4xl mx-auto" : ""}`}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
