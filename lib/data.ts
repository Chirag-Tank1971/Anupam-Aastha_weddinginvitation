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
  /** Path under /public, e.g. /events/mehendi.mp4 */
  videoSrc: string;
  /** Extra classes on the video (object-position, …). Base: object-cover + full bleed. */
  videoClassName?: string;
  /** Extra classes on the full-screen slide (background, etc.) */
  slideClassName?: string;
};

export const events: WeddingEvent[] = [
  {
    title: "1 May — Mehendi",
    videoSrc: "/events/mehendi.mp4",
    slideClassName: "bg-[#faf8f5]",
    videoClassName: "object-[center_42%]",
  },
  {
    title: "1 May — Engagement",
    videoSrc: "/events/engagment.mp4",
    slideClassName: "bg-[#f8f5f0]",
    videoClassName: "object-[center_42%]",
  },
  {
    title: "2 May — Haldi",
    videoSrc: "/events/haldi.mp4",
    slideClassName: "bg-[#f7f4ef]",
    videoClassName: "object-[center_40%]",
  },
  {
    title: "2 May — Sangeet",
    videoSrc: "/events/sangeet.mp4",
    slideClassName: "bg-[#f7f4ef]",
    videoClassName: "object-[center_40%]",
  },
  {
    title: "3 May — Wedding",
    videoSrc: "/events/wedding.mp4",
    slideClassName: "bg-[#f5f0e8]",
    videoClassName: "object-[center_38%]",
  },
  {
    title: "4 May — Reception",
    videoSrc: "/events/reception.mp4",
    slideClassName: "bg-[#faf8f5]",
    videoClassName: "object-[center_40%]",
  },
];

/** Full-bleed venue card after event videos (uses /public/events/venue.png). */
export const venueCard = {
  imageSrc: "/events/venue.png",
  venueName: "Hotel Taj Theog",
  addressLine1: "Near Shimla",
  addressLine2: "Himachal Pradesh",
} as const;

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
