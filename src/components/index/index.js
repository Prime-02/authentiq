


// import Tshirtimg1 from '../../../public/img/tshirts/img (1).webp';
// import Tshirtimg2 from '../../../public/img/tshirts/img (2).webp';
// import Tshirtimg3 from '../../../public/img/tshirts/img (3).webp';
// import Tshirtimg4 from '../../../public/img/tshirts/img (4).webp';


// import Beaniesimg1 from '../../../public/img/tshirts/img (1).webp';
// import Beaniesimg2 from '../../../public/img/tshirts/img (2).webp';
// import Beaniesimg3 from '../../../public/img/tshirts/img (3).webp';
// import Beaniesimg4 from '../../../public/img/tshirts/img (4).webp';

// export const Tshirts = {
//     title: 'What would you like to buy from us?',
//     img: [
//         { img: Tshirtimg1 },
//         { img: Tshirtimg2 },
//         { img: Tshirtimg3 },
//         { img: Tshirtimg4 },
//     ]
// };
// export const Beanies = {
//     title: 'Beanies',
//     img: [
//         { img: Beaniesimg1 },
//         { img: Beaniesimg2 },
//         { img: Beaniesimg3 },
//         { img: Beaniesimg4 },
//     ]
// };
function importPublicImages(folder, count, titles = []) {
    return Array.from({ length: count }, (_, i) => ({
      img: `/img/${folder}/img (${i + 1}).webp`,
      title: titles[i] || `Image ${i + 1}`, // Default title if none provided
      price: (Math.random() * (50 - 10) + 10).toFixed(2), // Random price between $10 and $50
    }));
  }
  

  export const Tshirts = {
    title: 'What would you like to buy from us?',
    img: importPublicImages('tshirts', 11, [
      'Classic White Tee',
      'Black V-neck',
      'Striped Shirt',
      'Graphic Tee',
      'Sport Tee',
      'Denim Shirt',
      'Floral Print',
      'Abstract Art Tee',
      'Polo Shirt',
      'Oversized Tee',
      'Retro Tee',
    ]),
  };
  
  export const Beanies = {
    title: 'Beanies',
    img: importPublicImages('beanies', 15, [
      'Classic Beanie',
      'Knitted Beanie',
      'Pom-Pom Beanie',
      'Cuffed Beanie',
      'Slouch Beanie',
      'Striped Beanie',
      'Ribbed Beanie',
      'Fleece Lined Beanie',
      'Cable Knit Beanie',
      'Reversible Beanie',
      'Wool Beanie',
      'Embroidered Beanie',
      'Tie-Dye Beanie',
      'Solid Color Beanie',
      'Patterned Beanie',
    ]),
  };
  