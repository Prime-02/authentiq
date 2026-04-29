import React from "react";
import Link from "next/link";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiInstagramLine } from "react-icons/ri";

const Footer = () => {
  const linkStyle = "transition-colors duration-200";
  const iconLinkStyle = "transition-colors duration-200";

  return (
    <footer
      className="pt-16"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="md:w-[80%] w-full px-5 md:px-0 mx-auto flex flex-col sm:flex-row justify-between">
        {/* Brand Section */}
        <div className="w-full sm:w-1/3 mb-8 sm:mb-0">
          <h2
            className="text-2xl sm:text-3xl font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            AuthentiQ
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Quality craftsmanship meets innovative design. Explore our exclusive
            collection.
          </p>
        </div>

        {/* Links Sections */}
        <div className="flex flex-col sm:flex-row sm:w-1/3 justify-evenly w-full">
          {/* Social Media Links */}
          <div className="w-full sm:w-1/2 mb-8 sm:mb-0">
            <h3
              className="text-xl sm:text-2xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Connect
            </h3>
            <ul className="flex gap-x-4 items-center justify-start">
              {[
                { icon: RiInstagramLine, href: "/", label: "Instagram" },
                { icon: FaFacebookF, href: "/", label: "Facebook" },
                { icon: FaXTwitter, href: "/", label: "X (Twitter)" },
                { icon: FaWhatsapp, href: "/", label: "WhatsApp" },
              ].map((social, index) => (
                <li key={index}>
                  <Link
                    href={social.href}
                    className={`${iconLinkStyle} hover:opacity-80`}
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--primary-500)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-muted)")
                    }
                    aria-label={social.label}
                  >
                    <social.icon
                      size={20}
                      className={index === 0 ? "mt-2" : ""}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="w-full sm:w-1/2 mb-8 sm:mb-0">
            <h3
              className="text-xl sm:text-2xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Terms of Services", href: "/terms-of-services" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Cookie Policy", href: "/cookie-policy" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className={`${linkStyle} hover:opacity-80`}
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--primary-500)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-muted)")
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div
        className="text-center pt-6 mt-4 text-sm sm:text-base py-5 w-full sm:w-[80%] mx-auto"
        style={{
          borderTop: "1px solid var(--border-color)",
          color: "var(--text-muted)",
        }}
      >
        <p>&copy; {new Date().getFullYear()} AuthentiQ. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
