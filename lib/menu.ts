export type MenuItem = {
  id: string;
  category: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  price: number;
  image_url: string;
  available: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: "naga-king-burger",
    category: "Burgers",
    name_en: "Naga King Burger",
    name_bn: "নাগা কিং বার্গার",
    description_en: "Smoked beef patty with Sylheti naga morich glaze.",
    description_bn: "সিলেটি নাগা মরিচ গ্লেজসহ স্মোকড বিফ প্যাটি।",
    price: 450,
    image_url:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1000&auto=format&fit=crop",
    available: true,
  },
  {
    id: "shutki-spice-burger",
    category: "Burgers",
    name_en: "Shutki Spice Burger",
    name_bn: "শুটকি স্পাইস বার্গার",
    description_en: "Bold spicy dried fish infusion with pickled onions.",
    description_bn: "ঝাল শুটকির ফ্লেভার ও পিকলড পেঁয়াজ।",
    price: 380,
    image_url:
      "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=1000&auto=format&fit=crop",
    available: true,
  },
  {
    id: "dhakaiya-paneer-bun",
    category: "Burgers",
    name_en: "Dhakaiya Paneer Bun",
    name_bn: "ঢাকাইয়া পনির বান",
    description_en: "Grilled marinated paneer with cilantro chutney.",
    description_bn: "গ্রিলড মেরিনেটেড পনির ও ধনেপাতা চাটনি।",
    price: 320,
    image_url:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=1000&auto=format&fit=crop",
    available: true,
  },
  {
    id: "mango-lassi-supreme",
    category: "Drinks",
    name_en: "Mango Lassi Supreme",
    name_bn: "ম্যাঙ্গো লাস্সি সুপ্রিম",
    description_en: "Creamy yogurt with mango pulp and saffron.",
    description_bn: "ক্রিমি দই, ম্যাঙ্গো পাল্প এবং জাফরান।",
    price: 180,
    image_url:
      "https://images.unsplash.com/photo-1626200419199-e8c7b9675f9d?q=80&w=1000&auto=format&fit=crop",
    available: true,
  },
  {
    id: "iced-coffee",
    category: "Coffee",
    name_en: "Iced Coffee",
    name_bn: "আইসড কফি",
    description_en: "Cold brew coffee with light sweetness.",
    description_bn: "হালকা মিষ্টির কোল্ড ব্রু কফি।",
    price: 220,
    image_url:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1000&auto=format&fit=crop",
    available: false,
  },
];
