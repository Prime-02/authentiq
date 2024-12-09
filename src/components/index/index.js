import { ShoppingCart, User, Users } from "lucide-react";
import { FaBox } from "react-icons/fa";
import { FaBarcode } from "react-icons/fa6";
import { RiRefund2Line } from "react-icons/ri";
import { TbArrowsExchange, TbLayoutDashboardFilled, TbMenuOrder, TbTruckDelivery } from "react-icons/tb";


export const Shipping = {
  title: 'Shipping & Returns',
  points: [
    {heading: 'Quick Delivery', icon: <TbTruckDelivery/>, text: `Expect your order to reach you in 3-5 business days, either at a pick-up point or directly at your doorstep.`},
    {heading: 'Simple Exchanges', icon: <TbArrowsExchange/>, text: `Not happy with the fit? We’ll gladly exchange your item for a more suitable size.`},
    {heading: 'Hassle-Free Returns', icon: <RiRefund2Line/>, text: `If you’re not satisfied, simply return the product, and we’ll refund your money without any questions.`},
  ]
}

export const adminDBSidebar = [
  {name: 'Dashboard', href: '/admin/name/dashboard/', icons: <TbLayoutDashboardFilled/>},
  {name: 'Customers', href: '/admin/name/customers/', icons: <Users/>},
  {name: 'Products', href: '/admin/name/products/', icons: <FaBox/>},
  {name: 'Barcodes', href: '/admin/name/barcode/', icons: <FaBarcode/>},
  {name: 'Orders', href: '/admin/name/order/', icons: <ShoppingCart/>},
  {name: 'Profile', href: '/admin/name/profile/', icons: <User/>},
];

export const termsAndConditions = [
  {
    title: "Acceptance of Terms",
    content: `
      By visiting, browsing, or purchasing from iSANS Originals, you acknowledge that you:
      - Are at least 18 years old or have obtained parental/guardian consent to use the Site and purchase our products.
      - Agree to abide by these Terms, as well as any other policies or guidelines we may publish.
    `,
  },
  {
    title: "Modification of Terms",
    content: `
      iSANS Originals reserves the right to update, amend, or revise these Terms at any time without prior notice. 
      Any changes will be effective immediately upon posting to the Site. Continued use of the Site or services 
      after such changes constitutes acceptance of the updated Terms.
    `,
  },
  {
    title: "Products and Services",
    subsections: [
      {
        subtitle: "Product Descriptions",
        content: `
          We strive to provide accurate descriptions of all products, including images, colors, materials, and sizes. 
          However, slight variations may occur due to manufacturing or display differences. iSANS Originals does not 
          guarantee that product descriptions or images are error-free.
        `,
      },
      {
        subtitle: "Product Availability",
        content: `
          All products are subject to availability. We reserve the right to discontinue or modify products at any 
          time without notice.
        `,
      },
      {
        subtitle: "Pricing and Taxes",
        content: `
          Prices displayed on the Site are in [Insert Currency] and exclude taxes unless otherwise specified. 
          Applicable taxes (e.g., VAT, GST) and shipping charges will be calculated at checkout. iSANS Originals 
          reserves the right to change prices at any time without prior notice.
        `,
      },
    ],
  },
  {
    title: "Ordering and Payment",
    subsections: [
      {
        subtitle: "Order Process",
        content: `
          Orders are placed through our Site by adding items to your cart and completing the checkout process. 
          You are responsible for providing accurate and complete information during checkout.
        `,
      },
      {
        subtitle: "Payment Methods",
        content: `
          We accept the following payment methods:
          - Credit/Debit Cards (Visa, MasterCard, American Express)
          - Digital Wallets (e.g., PayPal, Google Pay, Apple Pay)
          - Bank Transfers (if applicable)
        `,
      },
      {
        subtitle: "Order Confirmation",
        content: `
          Once an order is placed, you will receive an email confirmation. This email is not an acceptance of your 
          order but a notification that we have received it.
        `,
      },
      {
        subtitle: "Order Acceptance",
        content: `
          iSANS Originals reserves the right to accept or cancel any order for any reason, including but not limited to:
          - Product unavailability
          - Pricing errors
          - Suspicious or fraudulent activity
          - Errors in billing or shipping information
        `,
      },
      {
        subtitle: "Cancellations",
        content: `
          Customers may cancel their orders within [Insert Hours/Days] of placement, provided the order has not been shipped. 
          iSANS Originals reserves the right to refuse cancellation requests for shipped orders.
        `,
      },
    ],
  },
  {
    title: "Shipping and Delivery",
    subsections: [
      {
        subtitle: "Shipping Policy",
        content: `
          We offer domestic and international shipping. Shipping fees, estimated delivery times, and tracking 
          details will be provided at checkout.
        `,
      },
      {
        subtitle: "Delivery Times",
        content: `
          Delivery times are estimates and may vary due to unforeseen circumstances such as customs delays or 
          carrier issues. iSANS Originals is not liable for delays caused by shipping carriers or other external factors.
        `,
      },
      {
        subtitle: "Shipping Address",
        content: `
          It is your responsibility to provide a valid and accurate shipping address. iSANS Originals is not responsible 
          for lost or delayed shipments due to incorrect addresses.
        `,
      },
      {
        subtitle: "Lost or Damaged Packages",
        content: `
          If your order is lost or arrives damaged, please contact us at [Insert Contact Email] within [Insert Days] 
          of delivery. Claims must include relevant documentation such as photos of the damaged item.
        `,
      },
    ],
  },
  {
    title: "Returns and Refunds",
    subsections: [
      {
        subtitle: "Return Policy",
        content: `
          We accept returns within [Insert Days] of delivery for eligible items in their original condition, 
          including tags and packaging. Items not eligible for return include:
          - Undergarments and socks
          - Sale or clearance items
          - Custom or personalized orders
        `,
      },
      {
        subtitle: "Return Process",
        content: `
          To initiate a return:
          1. Contact us at [Insert Contact Email] with your order number and reason for return.
          2. Ship the item to the return address provided by our team.
        `,
      },
      {
        subtitle: "Refund Policy",
        content: `
          Refunds will be processed within [Insert Days] after the returned item is inspected and approved. 
          Refunds will be issued to the original payment method.
        `,
      },
    ],
  },
  {
    title: "User Accounts",
    subsections: [
      {
        subtitle: "Account Creation",
        content: `
          Users may create an account to access exclusive features, track orders, and save preferences. You 
          agree to provide accurate and current information during registration.
        `,
      },
      {
        subtitle: "Account Security",
        content: `
          You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately 
          of any unauthorized access or use of your account.
        `,
      },
    ],
  },
  {
    title: "Intellectual Property",
    content: `
      All content on the Site, including but not limited to images, logos, product descriptions, and text, is the 
      property of iSANS Originals and protected under applicable copyright and trademark laws. You may not 
      reproduce, distribute, or use this content without prior written permission.
    `,
  },
  {
    title: "Prohibited Activities",
    content: `
      You agree not to:
      - Use the Site for unlawful purposes.
      - Engage in activities that interfere with the operation of the Site.
      - Misrepresent your identity or impersonate others.
      - Upload or distribute harmful content, such as viruses or malware.
    `,
  },
  {
    title: "Limitation of Liability",
    content: `
      To the fullest extent permitted by law, iSANS Originals shall not be liable for:
      - Indirect, incidental, or consequential damages arising from the use of our Site or products.
      - Losses caused by user-provided information errors.
      - Delays or failures beyond our reasonable control.
    `,
  },
  {
    title: "Governing Law and Dispute Resolution",
    content: `
      These Terms shall be governed by and construed in accordance with the laws of [Insert Jurisdiction]. Any 
      disputes shall be resolved through [Insert Resolution Process, e.g., Arbitration or Small Claims Court].
    `,
  },
  {
    title: "Contact Information",
    content: `
      For questions, concerns, or feedback, contact us at:
      - Email: [Insert Email Address]
      - Phone: [Insert Phone Number]
      - Mailing Address: [Insert Physical Address]
    `,
  },
];

export const privacyPolicy = [
  {
    title: "Introduction",
    content: `
      At iSANS Originals, we value your privacy and are committed to protecting your personal data. This Privacy 
      Policy explains how we collect, use, and safeguard your information when you visit our website or use 
      our services.
    `,
  },
  {
    title: "Information We Collect",
    subsections: [
      {
        subtitle: "Personal Information",
        content: `
          We may collect personal information such as your name, email address, phone number, billing/shipping 
          address, and payment details when you place an order or create an account.
        `,
      },
      {
        subtitle: "Non-Personal Information",
        content: `
          We may collect non-personal information such as browser type, operating system, IP address, and browsing 
          activity on our site for analytics and performance improvement.
        `,
      },
      {
        subtitle: "Cookies",
        content: `
          Cookies are used to enhance your browsing experience and collect information about how you interact with 
          our website. For more details, please refer to our Cookie Policy.
        `,
      },
    ],
  },
  {
    title: "How We Use Your Information",
    content: `
      We use your information to:
      - Process and fulfill your orders.
      - Provide customer support.
      - Send promotional emails and updates.
      - Improve our website and services.
      - Comply with legal obligations.
    `,
  },
  {
    title: "Sharing Your Information",
    content: `
      iSANS Originals does not sell your personal information. However, we may share your data with:
      - Payment processors to complete transactions.
      - Shipping providers to deliver your orders.
      - Third-party service providers for analytics and marketing.
      - Legal authorities when required by law.
    `,
  },
  {
    title: "Your Rights",
    content: `
      You have the right to:
      - Access, update, or delete your personal information.
      - Opt out of marketing communications.
      - Disable cookies through your browser settings.
      - Lodge a complaint with a data protection authority if you believe your rights have been violated.
    `,
  },
  {
    title: "Data Security",
    content: `
      We implement industry-standard security measures to protect your data. However, no method of online 
      transmission or storage is 100% secure. Please contact us immediately if you suspect a data breach.
    `,
  },
  {
    title: "Changes to This Policy",
    content: `
      We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page, 
      and we encourage you to review it periodically.
    `,
  },
  {
    title: "Contact Us",
    content: `
      If you have any questions or concerns about this Privacy Policy, please contact us at:
      - Email: [Insert Email Address]
      - Phone: [Insert Phone Number]
    `,
  },
];

export const cookiePolicy = [
  {
    title: "What Are Cookies?",
    content: `
      Cookies are small text files stored on your device when you visit a website. They are used to enhance 
      your browsing experience and provide insights into website usage.
    `,
  },
  {
    title: "Types of Cookies We Use",
    subsections: [
      {
        subtitle: "Essential Cookies",
        content: `
          These cookies are necessary for the website to function properly and cannot be disabled. They help with 
          tasks such as remembering your shopping cart items and ensuring secure account access.
        `,
      },
      {
        subtitle: "Performance Cookies",
        content: `
          Performance cookies collect information about how visitors use our website, such as which pages are most 
          visited. This helps us improve the website's functionality and user experience.
        `,
      },
      {
        subtitle: "Functional Cookies",
        content: `
          These cookies allow us to remember your preferences, such as language or region, to provide a more 
          personalized experience.
        `,
      },
      {
        subtitle: "Marketing Cookies",
        content: `
          Marketing cookies are used to track your activity across websites and deliver relevant ads. These cookies 
          may be set by third-party advertisers.
        `,
      },
    ],
  },
  {
    title: "How We Use Cookies",
    content: `
      We use cookies to:
      - Remember your login credentials and preferences.
      - Monitor website performance and visitor behavior.
      - Deliver personalized content and advertisements.
      - Analyze website traffic and trends.
    `,
  },
  {
    title: "Managing Cookies",
    content: `
      You can manage your cookie preferences through your browser settings. Note that disabling certain cookies 
      may impact your ability to use certain features of our website.
    `,
  },
  {
    title: "Third-Party Cookies",
    content: `
      We may allow third-party services, such as analytics or advertising providers, to set cookies on our site. 
      These cookies are governed by the privacy policies of the respective third parties.
    `,
  },
  {
    title: "Changes to This Policy",
    content: `
      We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. 
      Any updates will be posted on this page.
    `,
  },
  {
    title: "Contact Us",
    content: `
      For questions or concerns about our use of cookies, please contact us at:
      - Email: [Insert Email Address]
      - Phone: [Insert Phone Number]
    `,
  },
];
