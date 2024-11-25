import { cookiePolicy, privacyPolicy, termsAndConditions } from "@/components/index";


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
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-5 py-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{policy.title} </h1>
        {policy.content.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
            <p className="text-lg">{section.content}</p>
            
            {/* Render subsections if they exist */}
            {section.subsections &&
              section.subsections.map((sub, subIndex) => (
                <div key={subIndex} className="ml-4">
                  <h3 className="text-xl font-semibold">{sub.subtitle}</h3>
                  <p>{sub.content}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyPage;
