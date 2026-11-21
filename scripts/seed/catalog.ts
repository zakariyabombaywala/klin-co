/**
 * Kiln & Co. catalogue content: written in the brand voice, no placeholders.
 * Prices are in cents. `photoQuery` steers the Unsplash search in seed:photos.
 */

export const GLAZES = {
  oat: "Speckled oat",
  sage: "Sage celadon",
  charcoal: "Charcoal matte",
  salt: "Sea salt",
  ochre: "Ochre",
  terracotta: "Raw terracotta",
} as const;

export type GlazeKey = keyof typeof GLAZES;

export interface CategorySeed {
  slug: string;
  name: string;
  description: string;
}

export interface CollectionSeed {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  featured: boolean;
  products: string[];
  photoQuery: string;
}

export interface VariantSeed {
  glaze?: GlazeKey | "mixed";
  size?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface ProductSeed {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string[];
  materials: string;
  care: string;
  variants: VariantSeed[];
  featured?: boolean;
  /** How long ago the piece was added, for "newest" sorting and "New" badges. */
  addedDaysAgo: number;
  photoQuery: string;
}

export const categories: CategorySeed[] = [
  {
    slug: "mugs",
    name: "Mugs & cups",
    description: "Everyday mugs, cups and coffee gear, sized for the way you actually drink.",
  },
  { slug: "bowls", name: "Bowls", description: "Breakfast bowls to big salad bowls, thrown deep enough to be useful." },
  {
    slug: "plates",
    name: "Plates",
    description: "Dinner, side and serving plates with a soft rim and a matte underside.",
  },
  { slug: "vases", name: "Vases", description: "Bud vases, bottles and moon jars for a single stem or an armful." },
  {
    slug: "planters",
    name: "Planters",
    description: "Planters with drainage and saucers, glazed outside and raw within.",
  },
  {
    slug: "gift-sets",
    name: "Gift sets",
    description: "Pieces we've paired up and boxed in recycled paper, ready to give.",
  },
];

const MATERIALS = {
  table:
    "Wheel-thrown speckled buff stoneware, fired to 1,240°C. Lead-free, food-safe glaze. The foot is left unglazed so you can feel the clay.",
  vase: "Wheel-thrown stoneware, fired to 1,240°C. Glazed inside so it holds water. Unglazed, sanded foot that won't scratch furniture.",
  planter:
    "Wheel-thrown stoneware with a drainage hole. Glazed outside, left raw inside so roots can breathe. Matching saucer included.",
};

const CARE = {
  table:
    "Dishwasher and microwave safe. Avoid moving it straight from the fridge to a hot oven, as sudden temperature changes can crack stoneware. Speckles and small variations in glaze are part of each piece.",
  vase: "Rinse with warm water and a drop of soap. Not for the dishwasher, as the raw foot can mark. Change flower water every couple of days and your stems will last longer.",
  planter:
    "Wipe the outside with a damp cloth. Empty the saucer after watering so roots don't sit in water. Bring inside before the first frost; stoneware can crack if wet clay freezes.",
};

export const products: ProductSeed[] = [
  // ------------------------------------------------------------------ Mugs & cups
  {
    slug: "everyday-mug",
    title: "The Everyday Mug",
    subtitle: "12 oz, with a thumb rest",
    category: "mugs",
    featured: true,
    addedDaysAgo: 210,
    photoQuery: "handmade ceramic mug",
    description: [
      "The mug we reach for first. It holds a proper 12 oz pour, the handle fits three fingers, and a small thumb rest sits right where your thumb lands.",
      "We trim the base by hand so it sits flat and steady, then leave the foot raw. It's the piece most people start with, and the one they come back for in other glazes.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 3200, stock: 34 },
      { glaze: "sage", price: 3200, stock: 21 },
      { glaze: "charcoal", price: 3200, stock: 17 },
    ],
  },
  {
    slug: "big-morning-mug",
    title: "The Big Morning Mug",
    subtitle: "16 oz, for slow starts",
    category: "mugs",
    addedDaysAgo: 160,
    photoQuery: "large ceramic coffee mug",
    description: [
      "For the days that need a second cup in the first one. A wide, generous 16 oz body with a rounded handle you can hook a finger through while you read.",
      "The walls are a touch thicker than our everyday mug, so it keeps coffee warm through the crossword.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 3800, stock: 18 },
      { glaze: "salt", price: 3800, stock: 12 },
    ],
  },
  {
    slug: "espresso-cups",
    title: "Espresso Cups, Set of Two",
    subtitle: "3 oz, handleless",
    category: "mugs",
    addedDaysAgo: 120,
    photoQuery: "ceramic espresso cups",
    description: [
      "Two small cups that sit comfortably in the palm. Thrown thin at the lip so the crema meets you first, thicker at the base to hold the heat.",
      "They stack, they travel well, and they make a very good gift for the person who already owns a better coffee machine than you.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "charcoal", price: 3600, stock: 14 },
      { glaze: "ochre", price: 3600, stock: 9 },
    ],
  },
  {
    slug: "handleless-latte-cup",
    title: "Handleless Latte Cup",
    subtitle: "10 oz, made to be held",
    category: "mugs",
    addedDaysAgo: 75,
    photoQuery: "handleless ceramic cup",
    description: [
      "A tall, soft-sided cup with no handle, so you hold the warmth instead of the mug. Throwing lines are left visible on the outside for grip.",
      "Good for lattes, tea, or a small glass of wine on the balcony.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 2800, stock: 22 },
      { glaze: "sage", price: 2800, stock: 16 },
      { glaze: "terracotta", price: 2800, stock: 11 },
    ],
  },
  {
    slug: "stoneware-tumbler",
    title: "Stoneware Tumbler",
    subtitle: "8 oz, for water by the bed",
    category: "mugs",
    addedDaysAgo: 240,
    photoQuery: "ceramic tumbler glass",
    description: [
      "A simple straight-sided tumbler for water, juice or a short pour of something stronger. It feels cool in the hand and lighter than it looks.",
      "We've marked these down while we make room for a new glaze. Same clay, same care, just a little less.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "salt", price: 2400, compareAtPrice: 3000, stock: 26 },
      { glaze: "charcoal", price: 2400, compareAtPrice: 3000, stock: 19 },
    ],
  },
  {
    slug: "speckled-camp-mug",
    title: "Speckled Camp Mug",
    subtitle: "11 oz, with a flared rim",
    category: "mugs",
    addedDaysAgo: 30,
    photoQuery: "speckled enamel style ceramic mug",
    description: [
      "Our take on the classic enamel camp mug, in stoneware that won't chip or rust. The rim flares slightly so it's easy to drink from and easy to wash.",
      "Iron in the clay comes through the glaze as dark freckles. No two are speckled quite the same.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 3000, stock: 24 },
      { glaze: "salt", price: 3000, stock: 20 },
    ],
  },
  {
    slug: "pour-over-dripper",
    title: "Pour-Over Dripper",
    subtitle: "Fits a #2 cone filter",
    category: "mugs",
    featured: true,
    addedDaysAgo: 95,
    photoQuery: "ceramic pour over coffee dripper",
    description: [
      "A single-cup dripper with internal ribs that keep the filter off the wall, so water flows evenly through the grounds. It sits on almost any mug, including ours.",
      "Stoneware holds heat well, so pre-warm it with a splash of hot water and your brew stays steady from the first pour to the last.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 4800, stock: 13 },
      { glaze: "charcoal", price: 4800, stock: 8 },
    ],
  },
  {
    slug: "teacup-and-saucer",
    title: "Teacup & Saucer",
    subtitle: "7 oz, with a deep saucer",
    category: "mugs",
    addedDaysAgo: 55,
    photoQuery: "ceramic teacup and saucer",
    description: [
      "A low, open teacup on a saucer deep enough to hold a biscuit or a spent tea bag. The handle is small and pinched by hand.",
      "We make these in small runs, and they go quickly. If your glaze is sold out, leave your email and we'll let you know when the next firing comes out.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "salt", price: 4200, stock: 3 },
      { glaze: "sage", price: 4200, stock: 2 },
    ],
  },
  {
    slug: "stacking-cups",
    title: "Stacking Cups, Set of Four",
    subtitle: "6 oz, nest neatly",
    category: "mugs",
    addedDaysAgo: 14,
    photoQuery: "stacked ceramic cups",
    description: [
      "Four small cups that nest into one neat tower, for tea, espresso or a sip of something with dessert. Choose four in one glaze, or a mix of our favourites.",
      "The mixed set changes with each firing, so yours might arrive slightly different from the photos.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 8400, stock: 6 },
      { glaze: "mixed", price: 8400, stock: 0 },
    ],
  },

  // ------------------------------------------------------------------ Bowls
  {
    slug: "breakfast-bowl",
    title: "Breakfast Bowl",
    subtitle: "6 in, for cereal, yoghurt and soup",
    category: "bowls",
    featured: true,
    addedDaysAgo: 200,
    photoQuery: "ceramic breakfast bowl",
    description: [
      "The bowl that does everything before noon and most things after. Steep enough sides for cereal and milk, wide enough for a proper soup.",
      "It fits in the palm of your hand on the sofa, and in the top rack of the dishwasher.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 2800, stock: 40 },
      { glaze: "sage", price: 2800, stock: 28 },
      { glaze: "charcoal", price: 2800, stock: 22 },
    ],
  },
  {
    slug: "deep-noodle-bowl",
    title: "Deep Noodle Bowl",
    subtitle: "7.5 in, holds a full broth",
    category: "bowls",
    addedDaysAgo: 85,
    photoQuery: "ramen bowl ceramic",
    description: [
      "A deep bowl for ramen, pho and laksa, with room for the broth and everything that goes on top. The rim is rolled so it's comfortable to lift and sip from.",
      "The outside is left matte to the halfway point, so it won't slip out of wet hands.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "charcoal", price: 4200, stock: 15 },
      { glaze: "ochre", price: 4200, stock: 12 },
    ],
  },
  {
    slug: "wide-serving-bowl",
    title: "Wide Serving Bowl",
    subtitle: "For the middle of the table",
    category: "bowls",
    addedDaysAgo: 150,
    photoQuery: "large ceramic serving bowl",
    description: [
      "A low, wide bowl for salads, roast vegetables or a heap of pasta to pass around. The shallow shape shows off what's in it.",
      "Throwing something this wide takes practice, and each one carries a few marks from the potter's hands on the outside wall.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", size: "Medium, 10 in", price: 7800, stock: 9 },
      { glaze: "oat", size: "Large, 12 in", price: 9600, stock: 6 },
      { glaze: "sage", size: "Medium, 10 in", price: 7800, stock: 7 },
      { glaze: "sage", size: "Large, 12 in", price: 9600, stock: 4 },
    ],
  },
  {
    slug: "nesting-prep-bowls",
    title: "Nesting Prep Bowls, Set of Three",
    subtitle: "4, 5 and 6 in",
    category: "bowls",
    addedDaysAgo: 260,
    photoQuery: "nesting ceramic bowls",
    description: [
      "Three bowls that nest into one, for whisking eggs, holding chopped garlic or serving olives. They take up the space of one bowl in the cupboard.",
      "On sale while we change our glaze recipe. The new batch will be a shade lighter.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "salt", price: 5400, compareAtPrice: 6800, stock: 11 },
      { glaze: "terracotta", price: 5400, compareAtPrice: 6800, stock: 8 },
    ],
  },
  {
    slug: "shallow-pasta-bowl",
    title: "Shallow Pasta Bowl",
    subtitle: "9 in, with a wide rim",
    category: "bowls",
    addedDaysAgo: 40,
    photoQuery: "pasta bowl ceramic plate",
    description: [
      "Halfway between a plate and a bowl, the shape restaurants serve pasta and risotto in. The wide rim gives you somewhere to rest a fork and frames the food.",
      "It's also our favourite for a big Sunday salad with everything in it.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 3600, stock: 25 },
      { glaze: "salt", price: 3600, stock: 18 },
      { glaze: "charcoal", price: 3600, stock: 13 },
    ],
  },
  {
    slug: "little-dip-bowls",
    title: "Little Dip Bowls, Set of Four",
    subtitle: "3 in, for sauces and salt",
    category: "bowls",
    addedDaysAgo: 20,
    photoQuery: "small ceramic dipping bowls",
    description: [
      "Four tiny bowls for soy sauce, flaky salt, olive oil or a pinch of chilli. They earn their place on the table at every meal.",
      "Pinched by hand from offcuts of clay, so the rims wander a little. We like them that way.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "ochre", price: 3200, stock: 17 },
      { glaze: "sage", price: 3200, stock: 14 },
    ],
  },
  {
    slug: "footed-fruit-bowl",
    title: "Footed Fruit Bowl",
    subtitle: "11 in, on a turned foot",
    category: "bowls",
    addedDaysAgo: 110,
    photoQuery: "ceramic fruit bowl footed",
    description: [
      "A wide bowl raised on a turned foot, so lemons and pears sit up where you can see them and air can move underneath.",
      "This one sold out in its last firing. Leave your email and we'll tell you as soon as the next batch is out of the kiln.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 8800, stock: 0 },
      { glaze: "charcoal", price: 8800, stock: 0 },
    ],
  },
  {
    slug: "big-salad-bowl",
    title: "Big Salad Bowl",
    subtitle: "Our largest bowl",
    category: "bowls",
    addedDaysAgo: 65,
    photoQuery: "big ceramic salad bowl",
    description: [
      "The biggest bowl we can fit on the wheel, for salads that feed a crowd or bread dough on its first rise. It's heavy enough not to slide when you toss.",
      "Glazed in sea salt, a soft gloss white that breaks to cream on the rim and makes greens look very green.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "salt", size: "11 in", price: 12000, stock: 5 },
      { glaze: "salt", size: "13 in", price: 14000, stock: 3 },
    ],
  },

  // ------------------------------------------------------------------ Plates
  {
    slug: "dinner-plate",
    title: "Dinner Plate",
    subtitle: "10.5 in, with a soft rim",
    category: "plates",
    featured: true,
    addedDaysAgo: 220,
    photoQuery: "handmade stoneware dinner plate",
    description: [
      "A dinner plate with a gently raised rim that keeps sauce on the plate and peas off the table. Flat in the middle, so steak knives don't skate.",
      "Collect them in one glaze or mix all four; they're made to sit happily together.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 3800, stock: 46 },
      { glaze: "sage", price: 3800, stock: 31 },
      { glaze: "charcoal", price: 3800, stock: 27 },
      { glaze: "salt", price: 3800, stock: 33 },
    ],
  },
  {
    slug: "side-plate",
    title: "Side Plate",
    subtitle: "8 in, for toast and cake",
    category: "plates",
    addedDaysAgo: 215,
    photoQuery: "small ceramic side plate",
    description: [
      "The plate for toast, a slice of cake, or the cheese course. It's the size you'll use most often without noticing.",
      "Pairs with the dinner plate in every glaze.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 2600, stock: 38 },
      { glaze: "sage", price: 2600, stock: 26 },
      { glaze: "charcoal", price: 2600, stock: 21 },
    ],
  },
  {
    slug: "oval-serving-platter",
    title: "Oval Serving Platter",
    subtitle: "For roasts and long lunches",
    category: "plates",
    addedDaysAgo: 130,
    photoQuery: "oval ceramic serving platter",
    description: [
      "An oval platter with a low wall, for a whole roast chicken, a side of salmon or an afternoon's worth of cheese and figs.",
      "Each one is shaped over a plaster mould while the clay is soft, then finished by hand, so the edges ripple slightly.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", size: "Medium, 14 in", price: 9200, stock: 7 },
      { glaze: "oat", size: "Large, 17 in", price: 11800, stock: 4 },
      { glaze: "salt", size: "Medium, 14 in", price: 9200, stock: 6 },
    ],
  },
  {
    slug: "dessert-plates",
    title: "Dessert Plates, Set of Four",
    subtitle: "7 in, in mixed glazes",
    category: "plates",
    addedDaysAgo: 280,
    photoQuery: "dessert plates ceramic set",
    description: [
      "Four small plates for cake, tart and the last of the cheese. Choose ochre, or sage, or bring both out at once.",
      "Last season's set, now reduced. They're the same plates, and they'll last just as long.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "ochre", price: 6400, compareAtPrice: 8000, stock: 10 },
      { glaze: "sage", price: 6400, compareAtPrice: 8000, stock: 7 },
    ],
  },
  {
    slug: "coupe-plate",
    title: "Coupe Plate",
    subtitle: "9 in, rimless",
    category: "plates",
    addedDaysAgo: 10,
    photoQuery: "coupe plate ceramic",
    description: [
      "A rimless plate that curves up gently from the centre, so it looks just as good with a plain omelette as a composed salad.",
      "New this month, in a deliberately small first run. The raw terracotta version shows the clay body underneath a thin, clear glaze.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "terracotta", price: 3400, stock: 4 },
      { glaze: "salt", price: 3400, stock: 3 },
    ],
  },
  {
    slug: "lidded-butter-dish",
    title: "Lidded Butter Dish",
    subtitle: "Holds a standard stick",
    category: "plates",
    addedDaysAgo: 100,
    photoQuery: "ceramic butter dish",
    description: [
      "A butter dish with a domed lid that keeps butter soft enough to spread and safe from crumbs. The lid has a small knob, pulled by hand.",
      "It fits a standard stick, or a block of European butter cut in half.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 4600, stock: 12 },
      { glaze: "charcoal", price: 4600, stock: 9 },
    ],
  },

  // ------------------------------------------------------------------ Vases
  {
    slug: "bud-vase",
    title: "Bud Vase",
    subtitle: "For a single stem",
    category: "vases",
    featured: true,
    addedDaysAgo: 180,
    photoQuery: "small ceramic bud vase",
    description: [
      "A small vase with a narrow neck that holds one stem upright: a sprig of rosemary, a single tulip, the first daffodil of spring.",
      "Line three along a windowsill, or keep one by the sink for whatever you picked on the walk home.",
    ],
    materials: MATERIALS.vase,
    care: CARE.vase,
    variants: [
      { glaze: "charcoal", size: "Small, 4 in", price: 1800, stock: 30 },
      { glaze: "charcoal", size: "Tall, 6 in", price: 2400, stock: 22 },
      { glaze: "oat", size: "Small, 4 in", price: 1800, stock: 27 },
      { glaze: "oat", size: "Tall, 6 in", price: 2400, stock: 19 },
    ],
  },
  {
    slug: "bottle-vase",
    title: "Bottle Vase",
    subtitle: "9 in, with a slim neck",
    category: "vases",
    addedDaysAgo: 140,
    photoQuery: "ceramic bottle vase",
    description: [
      "A bottle-shaped vase with a slim neck for a few branches of blossom or dried grasses. It looks just as good standing empty on a shelf.",
      "The sage glaze pools darker where the shoulder turns, and lighter where it runs thin.",
    ],
    materials: MATERIALS.vase,
    care: CARE.vase,
    variants: [
      { glaze: "sage", price: 5600, stock: 10 },
      { glaze: "salt", price: 5600, stock: 8 },
    ],
  },
  {
    slug: "moon-jar",
    title: "Moon Jar",
    subtitle: "Thrown in two halves",
    category: "vases",
    addedDaysAgo: 45,
    photoQuery: "moon jar ceramic white",
    description: [
      "Inspired by the Korean tradition, our moon jar is thrown as two bowls and joined at the middle while the clay is still soft. The seam is left just visible.",
      "Each one leans a little as it fires, so no two sit quite the same. It's the most time we spend on any single piece in the studio.",
    ],
    materials: MATERIALS.vase,
    care: CARE.vase,
    variants: [
      { glaze: "salt", size: "Medium, 10 in", price: 14000, stock: 3 },
      { glaze: "salt", size: "Large, 13 in", price: 16000, stock: 2 },
    ],
  },
  {
    slug: "ribbed-vase",
    title: "Ribbed Vase",
    subtitle: "8 in, carved by hand",
    category: "vases",
    addedDaysAgo: 300,
    photoQuery: "ribbed ceramic vase",
    description: [
      "A cylinder vase with ribs carved one by one into the leather-hard clay. The glaze breaks over each ridge, so the texture shows even from across the room.",
      "Reduced while we retire this shape. When these are gone, they're gone.",
    ],
    materials: MATERIALS.vase,
    care: CARE.vase,
    variants: [
      { glaze: "terracotta", price: 6800, compareAtPrice: 8600, stock: 6 },
      { glaze: "charcoal", price: 6800, compareAtPrice: 8600, stock: 5 },
    ],
  },
  {
    slug: "tall-amphora",
    title: "Tall Amphora",
    subtitle: "16 in, for branches",
    category: "vases",
    addedDaysAgo: 25,
    photoQuery: "tall ceramic floor vase",
    description: [
      "Our tallest vase, with a wide shoulder and a heavy base so it stays steady under a full branch of eucalyptus or cherry blossom.",
      "Thrown in sections and joined on the wheel. We only fit a few in each firing.",
    ],
    materials: MATERIALS.vase,
    care: CARE.vase,
    variants: [
      { glaze: "ochre", price: 11000, stock: 2 },
      { glaze: "oat", price: 11000, stock: 3 },
    ],
  },
  {
    slug: "studio-pitcher",
    title: "Studio Pitcher",
    subtitle: "1.2 litres, pours cleanly",
    category: "vases",
    addedDaysAgo: 70,
    photoQuery: "ceramic pitcher jug",
    description: [
      "A pitcher with a pulled spout that pours without dripping. Use it for water at the table, or as a loose, casual vase for garden flowers.",
      "The handle is pulled from a single coil of clay and fits the whole hand.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 6400, stock: 9 },
      { glaze: "sage", price: 6400, stock: 7 },
    ],
  },
  {
    slug: "squat-vase",
    title: "Squat Vase",
    subtitle: "5 in, wide and low",
    category: "vases",
    addedDaysAgo: 5,
    photoQuery: "round ceramic vase",
    description: [
      "A round, low vase for short-stemmed flowers: ranunculus, garden roses, a fistful of sweet peas. The wide mouth lets the stems fall loosely.",
      "Just out of the kiln, in charcoal and ochre.",
    ],
    materials: MATERIALS.vase,
    care: CARE.vase,
    variants: [
      { glaze: "charcoal", price: 4400, stock: 15 },
      { glaze: "ochre", price: 4400, stock: 12 },
    ],
  },

  // ------------------------------------------------------------------ Planters
  {
    slug: "planter-with-saucer",
    title: "Planter with Saucer",
    subtitle: "Raw terracotta, three sizes",
    category: "planters",
    featured: true,
    addedDaysAgo: 190,
    photoQuery: "terracotta planter with plant",
    description: [
      "A classic planter with a drainage hole and its own saucer, left mostly raw so the terracotta can breathe and wick away extra water.",
      "A thin band of glaze at the rim keeps the top clean when you water. Pick the size that fits your plant's root ball with a finger's width to spare.",
    ],
    materials: MATERIALS.planter,
    care: CARE.planter,
    variants: [
      { glaze: "terracotta", size: "4 in", price: 2800, stock: 36 },
      { glaze: "terracotta", size: "6 in", price: 3800, stock: 24 },
      { glaze: "terracotta", size: "8 in", price: 5200, stock: 15 },
    ],
  },
  {
    slug: "hanging-planter",
    title: "Hanging Planter",
    subtitle: "With a cotton rope hanger",
    category: "planters",
    addedDaysAgo: 90,
    photoQuery: "hanging ceramic planter",
    description: [
      "A shallow planter that hangs from three loops of undyed cotton rope. Perfect for trailing plants like string of pearls or pothos.",
      "There's no drainage hole, so add a layer of pebbles at the bottom and water little and often.",
    ],
    materials:
      "Wheel-thrown stoneware, glazed inside and out. No drainage hole. Hung on 1 m of undyed cotton rope with a brass ring.",
    care: CARE.planter,
    variants: [
      { glaze: "salt", price: 4400, stock: 13 },
      { glaze: "sage", price: 4400, stock: 10 },
    ],
  },
  {
    slug: "footed-planter",
    title: "Footed Planter",
    subtitle: "7 in, raised on three feet",
    category: "planters",
    addedDaysAgo: 250,
    photoQuery: "ceramic plant pot modern",
    description: [
      "A planter lifted on three small feet, so air can move underneath and your shelf stays dry. Includes a matching saucer that tucks between the feet.",
      "Marked down as we finish the last of this clay body.",
    ],
    materials: MATERIALS.planter,
    care: CARE.planter,
    variants: [
      { glaze: "charcoal", price: 5800, compareAtPrice: 7200, stock: 8 },
      { glaze: "oat", price: 5800, compareAtPrice: 7200, stock: 6 },
    ],
  },
  {
    slug: "herb-trough",
    title: "Windowsill Herb Trough",
    subtitle: "16 in long, for three herbs",
    category: "planters",
    addedDaysAgo: 35,
    photoQuery: "herbs in ceramic pot windowsill",
    description: [
      "A long, narrow trough that fits a kitchen windowsill and holds three herb plants side by side. Basil, parsley and thyme are a good place to start.",
      "Two drainage holes and a matching tray keep the sill dry.",
    ],
    materials: MATERIALS.planter,
    care: CARE.planter,
    variants: [
      { glaze: "terracotta", price: 6200, stock: 9 },
      { glaze: "salt", price: 6200, stock: 7 },
    ],
  },
  {
    slug: "propagation-bulb",
    title: "Propagation Bulb",
    subtitle: "For cuttings in water",
    category: "planters",
    addedDaysAgo: 60,
    photoQuery: "plant cutting in small vase",
    description: [
      "A small round vessel with a narrow opening that holds a cutting upright while it grows roots. Watch for the first white root in a week or two.",
      "Small and quick to make, but they sell out fast. If yours is gone, ask us to tell you when it's back.",
    ],
    materials: MATERIALS.vase,
    care: CARE.vase,
    variants: [
      { glaze: "salt", price: 2600, stock: 4 },
      { glaze: "ochre", price: 2600, stock: 0 },
    ],
  },
  {
    slug: "large-floor-planter",
    title: "Large Floor Planter",
    subtitle: "For a fiddle-leaf or olive tree",
    category: "planters",
    addedDaysAgo: 170,
    photoQuery: "large indoor plant pot",
    description: [
      "A big, heavy planter for the plant that anchors the room. The walls are thick enough to stay put on the floor and keep the roots cool.",
      "We throw these in two pieces and join them, which is why we only make a handful each season.",
    ],
    materials: MATERIALS.planter,
    care: CARE.planter,
    variants: [
      { glaze: "charcoal", size: "12 in", price: 15000, stock: 2 },
      { glaze: "charcoal", size: "14 in", price: 16000, stock: 0 },
    ],
  },

  // ------------------------------------------------------------------ Gift sets
  {
    slug: "coffee-for-two",
    title: "Coffee for Two",
    subtitle: "Two everyday mugs and a dripper",
    category: "gift-sets",
    featured: true,
    addedDaysAgo: 80,
    photoQuery: "two ceramic mugs coffee",
    description: [
      "Two of our everyday mugs and a pour-over dripper, boxed together for slow weekend mornings. It costs less than buying them separately.",
      "Wrapped in recycled paper with a handwritten card, if you'd like to add a message at checkout.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 9600, stock: 10 },
      { glaze: "charcoal", price: 9600, stock: 6 },
    ],
  },
  {
    slug: "table-for-four",
    title: "Table for Four",
    subtitle: "Four dinner plates and four bowls",
    category: "gift-sets",
    addedDaysAgo: 115,
    photoQuery: "stoneware dinnerware set table",
    description: [
      "Four dinner plates and four breakfast bowls in one glaze: everything you need for a first proper dinner party.",
      "A good wedding or new-home gift, and our most generous saving on the full set.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "salt", price: 16000, stock: 5 },
      { glaze: "oat", price: 16000, stock: 4 },
    ],
  },
  {
    slug: "little-gift-box",
    title: "The Little Gift Box",
    subtitle: "A bud vase and an espresso cup",
    category: "gift-sets",
    addedDaysAgo: 50,
    photoQuery: "ceramic gift small vase cup",
    description: [
      "A small bud vase and a single espresso cup, tucked into a kraft box. Our most popular thank-you gift.",
      "Each box is packed by hand in the studio and posted within two working days.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 4500, stock: 16 },
      { glaze: "sage", price: 4500, stock: 11 },
    ],
  },
  {
    slug: "new-home-set",
    title: "The New Home Set",
    subtitle: "Serving bowl, two mugs and a bud vase",
    category: "gift-sets",
    addedDaysAgo: 230,
    photoQuery: "ceramics gift set home",
    description: [
      "A medium serving bowl, two everyday mugs and a bud vase, for someone with new keys and empty shelves.",
      "We've reduced this set for the season. It's the same four pieces, boxed together and ready to give.",
    ],
    materials: MATERIALS.table,
    care: CARE.table,
    variants: [
      { glaze: "oat", price: 12800, compareAtPrice: 15200, stock: 5 },
      { glaze: "sage", price: 12800, compareAtPrice: 15200, stock: 3 },
    ],
  },
];

export const collections: CollectionSeed[] = [
  {
    slug: "the-morning-ritual",
    name: "The Morning Ritual",
    tagline: "Mugs, cups and coffee gear for slow starts",
    description:
      "Everything that makes the first hour of the day better: a mug that fits your hand, a dripper that makes good coffee easy, and a small plate for toast.",
    featured: true,
    photoQuery: "morning coffee ceramic mug table",
    products: [
      "everyday-mug",
      "big-morning-mug",
      "pour-over-dripper",
      "espresso-cups",
      "handleless-latte-cup",
      "teacup-and-saucer",
      "speckled-camp-mug",
      "breakfast-bowl",
      "side-plate",
      "coffee-for-two",
    ],
  },
  {
    slug: "the-everyday-table",
    name: "The Everyday Table",
    tagline: "Plates and bowls made for the dishwasher",
    description:
      "Dinnerware for every night of the week: plates and bowls in glazes that mix and match, tough enough for daily use and good-looking enough for guests.",
    featured: true,
    photoQuery: "stoneware plates bowls dinner table",
    products: [
      "dinner-plate",
      "side-plate",
      "shallow-pasta-bowl",
      "breakfast-bowl",
      "deep-noodle-bowl",
      "wide-serving-bowl",
      "big-salad-bowl",
      "oval-serving-platter",
      "lidded-butter-dish",
      "table-for-four",
    ],
  },
  {
    slug: "the-green-corner",
    name: "The Green Corner",
    tagline: "Planters and vases for things that grow",
    description:
      "Planters with proper drainage, vessels for cuttings and vases for whatever is in season. Clay and plants have always got on well.",
    featured: true,
    photoQuery: "plants in ceramic pots shelf",
    products: [
      "planter-with-saucer",
      "hanging-planter",
      "herb-trough",
      "footed-planter",
      "propagation-bulb",
      "large-floor-planter",
      "bud-vase",
      "bottle-vase",
      "squat-vase",
    ],
  },
  {
    slug: "gifts-under-60",
    name: "Gifts Under $60",
    tagline: "Small things, made slowly",
    description:
      "Thoughtful, handmade and easy to wrap: our favourite pieces for birthdays, thank-yous and the friend who has everything.",
    featured: true,
    photoQuery: "small handmade ceramic gift",
    products: [
      "little-gift-box",
      "bud-vase",
      "espresso-cups",
      "stoneware-tumbler",
      "little-dip-bowls",
      "propagation-bulb",
      "teacup-and-saucer",
      "hanging-planter",
      "handleless-latte-cup",
    ],
  },
];
