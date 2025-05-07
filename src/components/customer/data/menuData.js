const addOns = [
  { id: 1, name: 'Boba Pearls', price: 50 },
  { id: 2, name: 'Whipped Cream', price: 20 },
  { id: 3, name: 'Ice Cream', price: 30 },
  { id: 4, name: 'Coffee Shot', price: 20 },
  { id: 5, name: 'Veg Marshmallow', price: 20 },
  { id: 6, name: 'Drizzle', price: 20 },
  { id: 7, name: 'Choco Chips', price: 20 },
  { id: 8, name: 'Alternative Milk', price: 50 },
  { id: 9, name: 'Extra Flavours', price: 20 }
];

const categories = [
  {
    id: 'basics',
    name: 'Basics',
    items: [
      // Initialize all items with available: false by default
      { id: 'b1', name: 'Filter Coffee', description: 'Regular/Large', price: 35, variants: [{ size: 'Regular', price: 35 }, { size: 'Large', price: 50 }], allowsAddOns: true },
      { id: 'b2', name: 'Black Coffee', price: 35, allowsAddOns: true },
      { id: 'b3', name: 'Hot Biscoff', price: 140, allowsAddOns: true },
      { id: 'b4', name: 'Hot Chocolate', description: 'Dark/Bourbon Whiskey', price: 130, variants: [{ type: 'Dark', price: 130 }, { type: 'Bourbon Whiskey', price: 150 }], allowsAddOns: true },
      { id: 'b5', name: 'Cold Brew', description: 'Choose from Vanilla, Orange, Peach, or Free Pour', price: 120, variants: [{ type: 'Classic', price: 120 }, { type: 'Flavored', price: 170 }], allowsAddOns: true },
      { id: 'b6', name: 'Iced Coffee', price: 120, allowsAddOns: true },
      { id: 'b7', name: 'Macchiato Caramel', price: 150, allowsAddOns: true }
    ]
  },
  {
    id: 'latte',
    name: 'Latté',
    items: [
      { id: 'l1', name: 'Vanilla Latté', description: 'Hot/Cold', price: 130, variants: [{ size: 'Hot', price: 130 }, { size: 'Cold', price: 150 }], allowsAddOns: true },
      { id: 'l2', name: 'Hazelnut Latté', description: 'Hot/Cold', price: 130, variants: [{ size: 'Hot', price: 130 }, { size: 'Cold', price: 150 }], allowsAddOns: true },
      { id: 'l3', name: 'Americano', price: 100, variants: [{ size: 'Hot', price: 100 }, { size: 'Cold', price: 120 }], allowsAddOns: true },
      { id: 'l4', name: 'Mocha Latté', description: 'Hot/Cold', price: 130, variants: [{ size: 'Hot', price: 130 }, { size: 'Cold', price: 150 }], allowsAddOns: true }
    ]
  },
  {
    id: 'specials',
    name: 'Clockwork\'s Specials',
    items: [
      { id: 's1', name: 'Iced Nutella Mocha', price: 160, allowsAddOns: true },
      { id: 's2', name: 'Banoffee', price: 170, allowsAddOns: true },
      { id: 's3', name: 'Dulce de Leche', price: 180, allowsAddOns: true },
      { id: 's4', name: 'Choco Malt', price: 160, allowsAddOns: true },
      { id: 's5', name: 'Lotus Biscoff', price: 180, allowsAddOns: true },
      { id: 's6', name: 'Lotus Biscoff Latté', price: 190, allowsAddOns: true },
      { id: 's7', name: 'Strawberry Frappé', price: 160, allowsAddOns: true },
      { id: 's8', name: 'Mango Frappé', price: 160, allowsAddOns: true }
    ]
  },
  {
    id: 'milo',
    name: 'Milo Exclusive',
    items: [
      { id: 'm1', name: 'Milo on the Rocks', price: 160, allowsAddOns: true },
      { id: 'm2', name: 'Milo Dinosaur', price: 249, allowsAddOns: true },
      { id: 'm3', name: 'Iced Milo Latté', price: 169, allowsAddOns: true },
      { id: 'm4', name: 'Milo Buzz', price: 179, allowsAddOns: true },
      { id: 'm5', name: 'Milo Affogato', price: 139, allowsAddOns: true },
      { id: 'm6', name: 'Milo Pudding', price: 80, allowsAddOns: false },
      { id: 'm7', name: 'Milo Float', price: 179, allowsAddOns: true },
      { id: 'm8', name: 'Milo Bubble Tea', price: 210, allowsAddOns: true }
    ]
  },
  {
    id: 'bubbletea',
    name: 'Bubble Tea',
    items: [
      { id: 'bt1', name: 'Thai Red Tea', price: 220, allowsAddOns: true },
      { id: 'bt2', name: 'Taro (Purple Yam)', price: 220, allowsAddOns: true },
      { id: 'bt3', name: 'Matcha Tea', price: 220, allowsAddOns: true }
    ]
  },
  {
    id: 'non-coffee',
    name: 'Out of Coffee',
    items: [
      { id: 'nc1', name: 'Kombucha', description: 'Various flavors available', price: 200, variants: [{ type: 'Classic', price: 200 }, { type: 'Premium', price: 220 }], allowsAddOns: false },
      { id: 'nc2', name: 'Pure Berry', price: 100, allowsAddOns: false },
      { id: 'nc3', name: 'Passion Fruit Tea', price: 100, allowsAddOns: true },
      { id: 'nc4', name: 'Mango Passion', price: 120, allowsAddOns: true },
      { id: 'nc5', name: 'TANGerine', price: 80, allowsAddOns: false },
      { id: 'nc6', name: 'Ice Cold Lemon Mint', price: 100, allowsAddOns: true },
      { id: 'nc7', name: 'Ice Tea', description: 'Lemon or Peach', price: 100, variants: [{ flavor: 'Lemon', price: 100 }, { flavor: 'Peach', price: 100 }], allowsAddOns: true },
      { id: 'nc8', name: 'Granny Smith Tea', price: 120, allowsAddOns: true }
    ]
  },
  {
    id: 'desserts',
    name: 'Desserts',
    items: [
      { id: 'd1', name: 'Korean Cream Cheese Bun', price: 175, allowsAddOns: false },
      { id: 'd2', name: 'Affogato', price: 100, allowsAddOns: false },
      { id: 'd3', name: 'Choco Chunk Cookie', price: 80, allowsAddOns: false },
      { id: 'd4', name: 'Brownie', price: 80, allowsAddOns: false }
    ]
  }
];

export { categories, addOns };