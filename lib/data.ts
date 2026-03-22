export const couple = {
  bride: {
    name: "Ms. Aastha Kapil",
    role: "The Bride",
    bio: "Daughter of Mr. Digvijay Kapil and Mrs. Radhika Kapil.",
    family: ["Granddaughter of Late. Shiv Kumar Kapil and Late. Nirmala Kapil."],
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
  },
  groom: {
    name: "Mr. Anupam Rakshit",
    role: "The Groom",
    bio: "Son of Mr. Abhay Kumar Srivastava and Mrs. Chanda Srivastava.",
    family: ["Grandson of Late. Keshav Chand Srivastava and Late Shanti Devi."],
    image: "https://images.unsplash.com/photo-1590031905406-f18a426d772d?auto=format&fit=crop&w=900&q=80",
  },
};



export type WeddingEvent = {
  title: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  /** Extra classes on the full-screen slide (background, etc.) */
  slideClassName?: string;
  /** Extra classes on the image (object-position, scale, opacity, …). Base: object-cover + full bleed. */
  imageClassName?: string;
  /** Classes for the text overlay wrapper (position + flex). Omit flex utilities if you override completely. */
  overlayClassName: string;
  /** Inner flex + text alignment (default in UI: items-center text-center) */
  overlayContentClassName?: string;
};

export const events: WeddingEvent[] = [
  {
    title: "1 May — Mehendi & Engagement",
    date: "1 May",
    time: "4 PM onwards: Mehendi & High Tea at Hotel Dusit. Departure from Hotel Dusit to Hotel Taj Theog for Engagement.",
    venue: "Hotel Dusit Fagu & Hotel Taj Theog",
    image: "/events/mehendi.jpg",
    slideClassName: "bg-[#faf8f5]",
    imageClassName: "object-[center_42%]",
    overlayClassName:
      "inset-x-[7%] top-[14%] bottom-[38%] justify-center sm:inset-x-[8%] sm:top-[16%] sm:bottom-[40%]",
  },
  {
    title: "2 May — Tilak, Haldi & Sangeet",
    date: "2 May",
    time: "11 AM onwards: Tilak at Hotel Dusit. Haldi at Hotel Dusit. Sangeet.",
    venue: "Hotel Dusit Fagu",
    image: "/events/tilak%26haldi.jpg",
    slideClassName: "bg-[#f7f4ef]",
    imageClassName: "object-[center_40%]",
    overlayClassName:
      "inset-x-[7%] top-[16%] bottom-[30%] justify-center sm:inset-x-[8%] sm:top-[18%] sm:bottom-[32%]",
  },
  {
    title: "3 May — Wedding",
    date: "3 May",
    time: "3 PM onwards: Wedding at Hotel Taj for Marriage at Sunset.",
    venue: "Hotel Taj Theog",
    image: "/events/reception.jpg",
    slideClassName: "bg-[#f5f0e8]",
    imageClassName: "object-[center_38%]",
    overlayClassName:
      "inset-x-[6%] top-[12%] bottom-[36%] justify-center sm:inset-x-[8%] sm:top-[14%] sm:bottom-[38%]",
  },
  {
    title: "4 May — Reception",
    date: "4 May",
    time: "2 PM onwards: Reception at Club Mahindra Kandaghat.",
    venue: "Club Mahindra Kandaghat",
    image: "/events/wedding.jpg",
    slideClassName: "bg-[#faf8f5]",
    imageClassName: "object-[center_40%]",
    overlayClassName:
      "inset-x-[6%] top-[14%] bottom-[38%] justify-center sm:inset-x-[8%] sm:top-[16%] sm:bottom-[40%]",
  },
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
];

export const locationTabs = [
  {
    id: "wedding-venue",
    label: "Wedding Venue",
    locations: [
      {
        name: "Hotel Taj Theog",
        city: "Theog, Shimla",
        address: "Near Shimla, Himachal Pradesh",
        mapQuery: "Hotel Taj Theog Shimla",
      },
      {
        name: "Hotel Dusit Fagu",
        city: "Shimla",
        address: "Majhar Rd. Katheldi, Himanchal Pradesh - 171201",
        mapQuery: "Hotel Dusit Fagu Shimla",
      },
    ],
  },
  {
    id: "stay-prewedding",
    label: "Stay & Pre-Wedding",
    locations: [
      {
        name: "Hotel Hyatt Centric Sector 18",
        city: "Chandigarh",
        address: "Sector 18, Chandigarh",
        mapQuery: "Hyatt Centric Sector 18 Chandigarh",
      },
      {
        name: "Club Mahindra Kandaghat",
        city: "Kandaghat",
        address: "Kandaghat, Himachal Pradesh",
        mapQuery: "Club Mahindra Kandaghat",
      },
      {
        name: "Hotel Dusit Fagu",
        city: "Shimla",
        address: "Majhar Rd. Katheldi, Himanchal Pradesh - 171201",
        mapQuery: "Hotel Dusit Fagu Shimla",
      },
    ],
  },
  {
    id: "travel-points",
    label: "Travel Points",
    locations: [
      {
        name: "Chandigarh Airport",
        city: "Chandigarh",
        address: "Chandigarh International Airport",
        mapQuery: "Chandigarh International Airport",
      },
      {
        name: "Lucknow Airport",
        city: "Lucknow",
        address: "Chaudhary Charan Singh International Airport",
        mapQuery: "Lucknow Airport",
      },
    ],
  },
];

export const faqItems = [
  {
    question: "What should I wear?",
    answer:
      "Festive Indian attire is welcome for ceremonies. For sangeet and engagement, feel free to dress in elegant evening or cocktail festive wear. Specific dress notes may be shared closer to the date.",
  },
  {
    question: "Where should I stay?",
    answer:
      "Primary celebrations are centred around Hotel Dusit Fagu (Shimla), with events also at Hotel Taj Theog and Club Mahindra Kandaghat. Please see the Locations section for maps and directions.",
  },
  {
    question: "How do I reach Shimla?",
    answer:
      "Many guests will travel via Chandigarh Airport, then by road to Shimla. Check the Events and Locations sections for timings and venues.",
  },
  {
    question: "Can I bring a plus-one?",
    answer:
      "Please mention the number of guests in your RSVP so we can plan seating and hospitality. If your invitation specifies names, kindly respect the same.",
  },
  {
    question: "Who can I contact for help?",
    answer:
      "Reach out through your invitation channel or the hosts. For urgent day-of coordination, a contact number will be shared with confirmed guests.",
  },
];

/** Checkbox values for RSVP — must match labels guests see */
export const rsvpEventOptions = [
  "1 May — Mehendi & High Tea (Hotel Dusit)",
  "1 May — Engagement (Hotel Taj Theog)",
  "2 May — Tilak (Hotel Dusit)",
  "2 May — Haldi (Hotel Dusit)",
  "2 May — Sangeet",
  "3 May — Wedding at Hotel Taj (Sunset)",
  "4 May — Reception (Club Mahindra Kandaghat)",
];

export const rsvpFunOptions = [
  "Vegetarian meals preferred",
  "Need accommodation suggestions",
  "Traveling with children",
  "Accessibility assistance",
];
