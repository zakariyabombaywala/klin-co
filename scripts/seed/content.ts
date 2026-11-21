/** Review copy, customer names and inbox messages for the seed. */

export const firstNames = [
  "Maya",
  "Jonah",
  "Priya",
  "Theo",
  "Rosa",
  "Sam",
  "Hana",
  "Oliver",
  "Ines",
  "Marcus",
  "Leila",
  "Ben",
  "Clara",
  "Dev",
  "Ruth",
  "Kofi",
  "Elena",
  "Tom",
  "Yuki",
  "Grace",
  "Mateo",
  "Nora",
  "Felix",
  "Amara",
  "Iris",
  "Owen",
  "Sofia",
  "Luca",
  "Zoe",
  "Arjun",
  "Freya",
  "Diego",
  "Ada",
  "Kai",
  "Lena",
  "Noah",
];

export const lastNames = [
  "Chen",
  "Okafor",
  "Patel",
  "Brooks",
  "Alvarez",
  "Kim",
  "Moreau",
  "Fischer",
  "Lindqvist",
  "Nakamura",
  "Haddad",
  "O'Neill",
  "Silva",
  "Novak",
  "Hughes",
  "Mensah",
  "Rossi",
  "Ward",
  "Bauer",
  "Costa",
];

export interface ReviewCopy {
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
}

const generic: ReviewCopy[] = [
  {
    rating: 5,
    title: "Even nicer in person",
    body: "The photos don't do the glaze justice. There's so much depth to it, and it feels lovely in the hand.",
  },
  {
    rating: 5,
    title: "Beautifully packed",
    body: "Arrived wrapped in paper with a handwritten note. Not a single chip. You can tell someone cared about it.",
  },
  {
    rating: 5,
    title: "Use it every day",
    body: "Bought one to try and have since ordered three more. It's become the thing everyone in the house reaches for.",
  },
  {
    rating: 4,
    title: "Lovely, slightly different from the photo",
    body: "Mine has more speckles than the one pictured, which I actually prefer. Just know each one is unique.",
  },
  {
    rating: 5,
    title: "Worth the wait",
    body: "It was back-ordered for a couple of weeks, but it was worth it. Solid, well made and it'll last years.",
  },
  {
    rating: 4,
    title: "Great quality",
    body: "Heavier than I expected in a good way. Survived the dishwasher dozens of times with no change to the glaze.",
  },
  {
    rating: 3,
    title: "Nice, but smaller than I thought",
    body: "Good quality and pretty, but check the measurements. I'd imagined it a bit bigger.",
  },
  {
    rating: 5,
    title: "Perfect gift",
    body: "Bought this for my sister's birthday and she messaged me the same day to ask where it was from.",
  },
  {
    rating: 4,
    title: "Really happy with it",
    body: "Exactly as described and quick to arrive. Taking off one star only because I wish it came in more colours.",
  },
  {
    rating: 2,
    title: "Arrived with a small chip",
    body: "There was a tiny chip on the base. Customer service sent a replacement within the week, so no complaints about the service.",
  },
  {
    rating: 5,
    title: "My favourite thing in the kitchen",
    body: "It's simple, it's useful and it makes me happy every time I take it out of the cupboard.",
  },
  {
    rating: 4,
    title: "Solid and handsome",
    body: "Well balanced and sits perfectly flat. The raw foot is a nice touch.",
  },
];

const byCategory: Record<string, ReviewCopy[]> = {
  mugs: [
    {
      rating: 5,
      title: "The perfect handle",
      body: "Three fingers fit through the handle comfortably, which almost never happens. Coffee stays hot for ages.",
    },
    {
      rating: 5,
      title: "My morning mug now",
      body: "Holds a full cup with room for milk. The thumb rest sounds like a gimmick until you use it.",
    },
    { rating: 4, title: "Lovely to drink from", body: "The rim is thin and smooth. Only wish I'd bought two at once." },
    {
      rating: 5,
      title: "Keeps tea warm",
      body: "Thick walls keep my tea warm through a whole chapter. The glaze is gorgeous in morning light.",
    },
    {
      rating: 3,
      title: "Pretty but heavy",
      body: "Beautiful mug but a bit heavy for me when it's full. My partner loves it though.",
    },
    {
      rating: 5,
      title: "Better than my café's cups",
      body: "I make espresso at home and these feel like a proper café cup. Small, sturdy and they hold the heat.",
    },
  ],
  bowls: [
    {
      rating: 5,
      title: "The right depth",
      body: "Deep enough for soup, wide enough for a salad. We use these for almost every meal now.",
    },
    {
      rating: 5,
      title: "Ramen night upgrade",
      body: "Finally a bowl big enough for a proper bowl of noodles with all the toppings.",
    },
    {
      rating: 4,
      title: "Sturdy and beautiful",
      body: "Feels substantial without being clunky. The matte outside is nice to hold.",
    },
    {
      rating: 5,
      title: "Centrepiece of the table",
      body: "Served a big salad in it for friends and three people asked where it was from.",
    },
    {
      rating: 4,
      title: "Nests well",
      body: "Stack neatly in the cupboard. The glaze varies slightly between bowls, which I like.",
    },
  ],
  plates: [
    {
      rating: 5,
      title: "We replaced our whole set",
      body: "Started with two plates, now have eight. They mix beautifully across the different glazes.",
    },
    {
      rating: 5,
      title: "Rim keeps everything in",
      body: "The little raised edge means sauce stays on the plate. Simple, clever design.",
    },
    {
      rating: 4,
      title: "Gorgeous everyday plates",
      body: "Dishwasher safe and haven't chipped after months of use. A touch heavier than our old ones.",
    },
    {
      rating: 5,
      title: "Food looks better on these",
      body: "Something about the colour makes everything look like a cookbook photo.",
    },
  ],
  vases: [
    {
      rating: 5,
      title: "Perfect for one stem",
      body: "I keep it by the kitchen window with whatever's in the garden. Makes a single flower look intentional.",
    },
    {
      rating: 5,
      title: "Stunning shape",
      body: "Looks beautiful empty too. It's become a little sculpture on our bookshelf.",
    },
    {
      rating: 4,
      title: "Lovely, watertight",
      body: "Holds water without any seepage and the base doesn't mark the table.",
    },
    {
      rating: 5,
      title: "A real showpiece",
      body: "Everyone who visits asks about it. You can see the maker's hand in every curve.",
    },
  ],
  planters: [
    {
      rating: 5,
      title: "My plants are thriving",
      body: "The drainage and raw inside really help. My pothos has never looked better.",
    },
    {
      rating: 4,
      title: "Great saucer fit",
      body: "Saucer sits snugly and catches every drop. Wish the 8 inch came in more glazes.",
    },
    {
      rating: 5,
      title: "Beautiful on the windowsill",
      body: "Holds three herbs perfectly and makes the kitchen feel like a little garden.",
    },
    { rating: 4, title: "Good weight", body: "Heavy enough that it doesn't tip over when the plant gets top-heavy." },
  ],
  "gift-sets": [
    {
      rating: 5,
      title: "Wedding present hit",
      body: "Gave this to friends getting married. Beautifully boxed, and they use it every single day.",
    },
    {
      rating: 5,
      title: "Lovely presentation",
      body: "The box and handwritten card made it feel really special. Great value compared to buying separately.",
    },
    { rating: 4, title: "Great gift", body: "Arrived quickly and well packed. The recipient loved it." },
  ],
};

/** Hidden by moderators: off-topic or spam. */
export const hiddenReviews: ReviewCopy[] = [
  {
    rating: 1,
    title: "Check out my shop",
    body: "Great prices on pottery wheels at my website, message me for a discount code.",
  },
  {
    rating: 1,
    title: "Wrong item",
    body: "I meant to order something else entirely. This review is about the courier, who was late.",
  },
];

export function reviewPool(category: string): ReviewCopy[] {
  return [...(byCategory[category] ?? []), ...generic];
}

export const contactMessages = [
  {
    name: "Hana Kim",
    email: "hana.kim@example.com",
    subject: "Wholesale enquiry",
    message:
      "Hi! I run a small café in Portland and would love to use your everyday mugs. Do you offer wholesale pricing for orders of 40 or more?",
    daysAgo: 1,
    status: "new" as const,
  },
  {
    name: "Oliver Brooks",
    email: "oliver.brooks@example.com",
    subject: "Restock of the footed fruit bowl?",
    message:
      "Any idea when the footed fruit bowl in charcoal will be back? I've signed up for the email but wanted to check timing for a gift.",
    daysAgo: 3,
    status: "new" as const,
  },
  {
    name: "Ines Moreau",
    email: "ines.moreau@example.com",
    subject: "Custom dinner set",
    message:
      "We're getting married next spring and wondered if you take commissions for a set of 12 dinner plates in the sage glaze.",
    daysAgo: 6,
    status: "read" as const,
  },
  {
    name: "Marcus Alvarez",
    email: "marcus.alvarez@example.com",
    subject: "Chipped bowl in my order",
    message:
      "One of the breakfast bowls arrived with a small chip on the rim. Photos attached to my order email. What's the best way to sort this?",
    daysAgo: 12,
    status: "archived" as const,
  },
  {
    name: "Yuki Nakamura",
    email: "yuki.nakamura@example.com",
    subject: "Studio visits",
    message: "Do you ever open the studio to visitors or run workshops? I'd love to see how the moon jars are made.",
    daysAgo: 20,
    status: "read" as const,
  },
];
