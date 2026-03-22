export const couple = {
  bride: {
    name: "Ms. Aastha Kapil",
    role: "The Bride",
    bio: "Daughter of Mr. Digvijay Kapil and Mrs. Radhika Kapil.",
    family: ["Granddaughter of Late. Shiv Kumar Kapil and Late. Nirmala Kapil."],
  },
  groom: {
    name: "Mr. Anupam Rakshit",
    role: "The Groom",
    bio: "Son of Mr. Abhay Kumar Srivastava and Mrs. Chanda Srivastava.",
    family: ["Grandson of Late. Keshav Chand Srivastava and Late Shanti Devi."],
 },
};

// export const timeline = [
//   {
//     year: "1 MAY",
//     title: "Mehendi & Engagement",
//     description:
//       "4 PM onwards: Mehendi & High Tea at Hotel Dusit.\nDeparture from Hotel Dusit to Hotel Taj Theog for Engagement.",
//   },
//   {
//     year: "2 MAY",
//     title: "Tilak, Haldi & Sangeet",
//     description: "11 AM onwards: Tilak at Hotel Dusit.\nHaldi at Hotel Dusit.\nSangeet.",
//   },
//   {
//     year: "3 MAY",
//     title: "Wedding",
//     description: "3 PM onwards: Wedding at Hotel Taj for Marriage at Sunset.",
//   },
//   {
//     year: "4 MAY",
//     title: "Reception",
//     description: "2 PM onwards: Reception at Club Mahindra Kandaghat.",
//   },
// ];

export const events = [
  {
    title: "1 May — Mehendi & Engagement",
    date: "1 May",
    time: "4 PM onwards: Mehendi & High Tea at Hotel Dusit. Departure from Hotel Dusit to Hotel Taj Theog for Engagement.",
    venue: "Hotel Dusit Fagu & Hotel Taj Theog",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "2 May — Tilak, Haldi & Sangeet",
    date: "2 May",
    time: "11 AM onwards: Tilak at Hotel Dusit. Haldi at Hotel Dusit. Sangeet.",
    venue: "Hotel Dusit Fagu",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "3 May — Wedding",
    date: "3 May",
    time: "3 PM onwards: Wedding at Hotel Taj for Marriage at Sunset.",
    venue: "Hotel Taj Theog",
    image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "4 May — Reception",
    date: "4 May",
    time: "2 PM onwards: Reception at Club Mahindra Kandaghat.",
    venue: "Club Mahindra Kandaghat",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
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
