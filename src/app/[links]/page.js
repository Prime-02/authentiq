import {
  cookiePolicy,
  privacyPolicy,
  termsAndConditions,
} from "@/components/index";

const policies = {
  "terms-of-services": {
    title: "Terms of Services",
    content: termsAndConditions,
  },
  "privacy-policy": {
    title: "Privacy Policy",
    content: privacyPolicy,
  },
  "cookie-policy": {
    title: "Cookie Policy",
    content: cookiePolicy,
  },
};

// Generate static paths for the dynamic routes
export async function generateStaticParams() {
  return Object.keys(policies).map((key) => ({ links: key }));
}

// Dynamic page rendering based on the parameter
const PolicyPage = ({ params }) => {
  const { links } = params;
  const policy = policies[links];

  if (!policy) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Page Not Found
        </h1>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-5 py-32"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Card container */}
        <div
          className="card rounded-lg p-8 md:p-12 shadow-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-light)",
          }}
        >
          {/* Title */}
          <h1
            className="text-3xl md:text-4xl font-bold mb-8 pb-4"
            style={{
              color: "var(--text-primary)",
              borderBottom: "2px solid var(--border-light)",
            }}
          >
            {policy.title}
          </h1>

          {/* Content Sections */}
          <div className="space-y-8">
            {policy.content.map((section, index) => (
              <div key={index}>
                {/* Section Title */}
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  {section.title}
                </h2>

                {/* Section Content */}
                <p
                  className="text-base leading-relaxed mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {section.content}
                </p>

                {/* Subsections */}
                {section.subsections && (
                  <div className="ml-4 md:ml-6 space-y-4">
                    {section.subsections.map((sub, subIndex) => (
                      <div
                        key={subIndex}
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                      >
                        <h3
                          className="text-xl font-semibold mb-2"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {sub.subtitle}
                        </h3>
                        <p
                          className="text-base leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {sub.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Divider between sections (except last) */}
                {index < policy.content.length - 1 && (
                  <div
                    className="mt-6 pt-6"
                    style={{ borderTop: "1px solid var(--border-light)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
