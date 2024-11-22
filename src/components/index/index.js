import { RiRefund2Line } from "react-icons/ri";
import { TbArrowsExchange, TbTruckDelivery } from "react-icons/tb";



function importPublicImages(folder, count, items = []) {
  return Array.from({ length: count }, (_, i) => ({
    img: `/img/${folder}/img (${i + 1}).webp`,
    title: items[i]?.name || `Image ${i + 1}`, // Fallback to "Image X" if no name provided
    price: (Math.random() * (50 - 10) + 10).toFixed(2), // Random price between $10 and $50
    description: items[i]?.description || 'No description available.', // Fallback description
    sizes: items[i]?.sizes || 'No available size variants'
  }));
}

export const Products = [
  {
    Tshirts: {
      title: 'Tees',
      img: importPublicImages('tshirts', 11, [
        { name: 'Classic White Tee', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'A timeless staple for every wardrobe.' },
        { name: 'Black V-neck', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'Perfect for casual or semi-formal occasions.' },
        { name: 'Striped Shirt', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'Add some stripes to your style for a bold look.' },
        { name: 'Graphic Tee', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'Make a statement with unique graphic prints.' },
        { name: 'Sport Tee', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'Designed for performance and comfort.' },
        { name: 'Denim Shirt', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'A rugged and stylish piece for any outfit.' },
        { name: 'Floral Print', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'Soft fabric with a fresh floral vibe.' },
        { name: 'Abstract Art Tee', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'Wear your creativity with abstract designs.' },
        { name: 'Polo Shirt', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'Classic and sporty with a collar twist.' },
        { name: 'Oversized Tee', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'Casual comfort with a relaxed fit.' },
        { name: 'Retro Tee', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'], description: 'Take a step back in time with vintage prints.' },
      ]),
    },
  },
  {
    Beanies: {
      title: 'Beanies',
      img: importPublicImages('beanies', 15, [
        { name: 'Classic Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Keep it simple and cozy all winter long.' },
        { name: 'Knitted Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Soft and warm with a hand-knit look.' },
        { name: 'Pom-Pom Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Fun and stylish with a playful pom-pom.' },
        { name: 'Cuffed Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Adjustable and versatile for any occasion.' },
        { name: 'Slouch Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Relaxed fit for effortless style.' },
        { name: 'Striped Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Add some pattern to your winter wardrobe.' },
        { name: 'Ribbed Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Classic ribbed texture for a snug fit.' },
        { name: 'Fleece Lined Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Extra warmth with soft fleece lining.' },
        { name: 'Cable Knit Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Elegant and textured for a classy look.' },
        { name: 'Reversible Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Two styles in one for endless versatility.' },
        { name: 'Wool Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Natural warmth with premium wool material.' },
        { name: 'Embroidered Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Personalized details for unique charm.' },
        { name: 'Tie-Dye Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Colorful and trendy for a bold statement.' },
        { name: 'Solid Color Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Minimalist design for everyday wear.' },
        { name: 'Patterned Beanie', sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],  description: 'Eye-catching patterns to elevate your style.' },
      ]),
    },
  },
];

export const Shipping = {
  title: 'Shipping & Returns',
  points: [
    {heading: 'Quick Delivery', icon: <TbTruckDelivery/>, text: `Expect your order to reach you in 3-5 business days, either at a pick-up point or directly at your doorstep.`},
    {heading: 'Simple Exchanges', icon: <TbArrowsExchange/>, text: `Not happy with the fit? We’ll gladly exchange your item for a more suitable size.`},
    {heading: 'Hassle-Free Returns', icon: <RiRefund2Line/>, text: `If you’re not satisfied, simply return the product, and we’ll refund your money without any questions.`},
  ]
}
