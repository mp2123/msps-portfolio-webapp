export type CraftCocktailIngredient = {
  amount: string;
  item: string;
};

export type CraftCocktailSeed = {
  slug: string;
  name: string;
  style: string;
  spiritBase: string;
  glassware: string;
  garnish?: string;
  shortDescription: string;
  imageUrl: string;
  ingredients: CraftCocktailIngredient[];
  method: string[];
  notes?: string;
};

export const EXAMPLE_CRAFT_COCKTAILS: CraftCocktailSeed[] = [
  {
    slug: "negroni",
    name: "Negroni",
    style: "Bittersweet stirred classic",
    spiritBase: "Gin",
    glassware: "Double rocks",
    garnish: "Orange peel",
    shortDescription:
      "A bitter-sweet, equal-parts classic that shows restraint, balance, and clean stirred technique.",
    imageUrl: "/cocktails/negroni.png",
    ingredients: [
      { amount: "1 oz", item: "London dry gin" },
      { amount: "1 oz", item: "Campari" },
      { amount: "1 oz", item: "Sweet vermouth" },
    ],
    method: [
      "Add all ingredients to a mixing glass with plenty of cold ice.",
      "Stir until fully chilled and lightly diluted.",
      "Strain over a large cube in a chilled double rocks glass.",
      "Express an orange peel over the drink and drop it in.",
    ],
    notes: "Example seeded recipe for the portfolio. Your spreadsheet can replace this later.",
  },
  {
    slug: "paper-plane",
    name: "Paper Plane",
    style: "Modern equal-parts sour",
    spiritBase: "Bourbon",
    glassware: "Coupe",
    garnish: "None",
    shortDescription:
      "A sharp, modern classic with bright citrus and amaro structure that drinks fast but stays balanced.",
    imageUrl: "/cocktails/paper-plane.png",
    ingredients: [
      { amount: "3/4 oz", item: "Bourbon" },
      { amount: "3/4 oz", item: "Aperol" },
      { amount: "3/4 oz", item: "Amaro Nonino" },
      { amount: "3/4 oz", item: "Fresh lemon juice" },
    ],
    method: [
      "Add all ingredients to a shaker with cold ice.",
      "Shake hard until the tin is well chilled.",
      "Double strain into a chilled coupe.",
      "Serve with no garnish for a clean presentation.",
    ],
    notes: "This is a seeded example; final drinks can be spreadsheet-backed once your recipe sheet arrives.",
  },
  {
    slug: "last-word",
    name: "Last Word",
    style: "Herbal equal-parts sour",
    spiritBase: "Gin",
    glassware: "Coupe",
    garnish: "Brandied cherry or none",
    shortDescription:
      "A vivid, high-aroma classic that rewards precise equal-parts builds and a crisp, cold shake.",
    imageUrl: "/cocktails/last-word.png",
    ingredients: [
      { amount: "3/4 oz", item: "Gin" },
      { amount: "3/4 oz", item: "Green Chartreuse" },
      { amount: "3/4 oz", item: "Maraschino liqueur" },
      { amount: "3/4 oz", item: "Fresh lime juice" },
    ],
    method: [
      "Add all ingredients to a shaker with cold ice.",
      "Shake until bright, cold, and slightly frosted.",
      "Double strain into a chilled coupe.",
      "Garnish only if it adds clarity; the drink stands on aroma and balance alone.",
    ],
  },
  {
    slug: "old-fashioned",
    name: "Old Fashioned",
    style: "Spirit-forward stirred classic",
    spiritBase: "Bourbon",
    glassware: "Double rocks",
    garnish: "Orange peel",
    shortDescription:
      "A benchmark stirred whiskey drink where dilution, texture, and restraint matter more than theatrics.",
    imageUrl: "/cocktails/old-fashioned.png",
    ingredients: [
      { amount: "2 oz", item: "Bourbon" },
      { amount: "1/4 oz", item: "Rich demerara syrup" },
      { amount: "2 dashes", item: "Angostura bitters" },
      { amount: "1 dash", item: "Orange bitters" },
    ],
    method: [
      "Add all ingredients to a mixing glass with ice.",
      "Stir until chilled, glossy, and properly diluted.",
      "Strain over a large clear cube in a chilled rocks glass.",
      "Express an orange peel over the top and discard or place neatly.",
    ],
  },
  {
    slug: "margarita",
    name: "Margarita",
    style: "Bright agave sour",
    spiritBase: "Tequila",
    glassware: "Coupe or rocks",
    garnish: "Lime wheel",
    shortDescription:
      "A citrus-forward agave classic that depends on acid balance, fresh juice, and tight shake discipline.",
    imageUrl: "/cocktails/margarita.png",
    ingredients: [
      { amount: "2 oz", item: "Blanco tequila" },
      { amount: "1 oz", item: "Cointreau" },
      { amount: "3/4 oz", item: "Fresh lime juice" },
      { amount: "1/4 oz", item: "Agave syrup" },
    ],
    method: [
      "Add all ingredients to a shaker with ice.",
      "Shake hard until cold and integrated.",
      "Double strain into a chilled coupe or over fresh ice in a salt-rimmed rocks glass.",
      "Garnish with a lime wheel.",
    ],
  },
  {
    slug: "espresso-martini",
    name: "Espresso Martini",
    style: "Modern after-dinner classic",
    spiritBase: "Vodka",
    glassware: "Coupe",
    garnish: "Three espresso beans",
    shortDescription:
      "A clean, high-energy modern classic where texture, crema, and coffee quality matter as much as the base spirit.",
    imageUrl: "/cocktails/espresso-martini.png",
    ingredients: [
      { amount: "1 1/2 oz", item: "Vodka" },
      { amount: "1 oz", item: "Fresh espresso" },
      { amount: "3/4 oz", item: "Coffee liqueur" },
      { amount: "1/4 oz", item: "Simple syrup" },
    ],
    method: [
      "Add all ingredients to a shaker with plenty of cold ice.",
      "Shake hard and long to build crema and chill the drink fully.",
      "Double strain into a chilled coupe.",
      "Garnish with three espresso beans centered on the crema.",
    ],
  },
];

export const COCKTAIL_PREVIEW_NAMES = EXAMPLE_CRAFT_COCKTAILS.map((cocktail) => cocktail.name);
