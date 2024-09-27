import React from "react";

const prohibitedItems = [
  "Adult Material",
  "Agriculture Products (Eg. Ginger, garlic paste or whole)",
  "Air Conditioner/Purifier",
  "Alcoholic Beverages",
  "Animal Products",
  "Animal Supplement",
  "Antiques",
  "Bakery Items",
  "Batteries (Propane, Butane, Hydrogen, Helium)",
  "Battery Shells",
  "Beverages requiring refrigeration or other environmental control",
  "Bubble gum (Singapore)",
  "Bulbs",
  "Candles",
  "Charcoal (Powder, Cream, etc.)",
  "Cigarette / E-cigarette",
  "Coffee",
  "Coins (Silver/Gold)",
  "Currency Notes",
  "Dal (Lentil)",
  "Damaged/broken/used phones of any kind",
  "Debit/Credit Card",
  "Driving Licence",
  "Drone Cameras",
  "DSLR Camera (Without Lens we can ship)",
  "Dyes (Hair, Textile, etc.)",
  "Ghee",
  "Gold, Silver and Gold/Silver Plated Products",
  "Government-issued documents",
  "Hand Sanitizers",
  "Hard Disk Containing Data",
  "Herbs",
  "High Value Gadgets",
  "Hing (Asafoetida)",
  "Honey",
  "Hookah Flavours",
  "Hoverboard",
  "Human and animal remains, Ashes",
  "Incense Sticks",
  "Insulin",
  "Laptop/Desktops",
  "Lasers",
  "Lithium Batteries",
  "Live Organs or Human Remains",
  "Lottery Tickets, Gambling Devices",
  "Magnets",
  "Matchbox",
  "Mattress",
  "Meat of Wild Animals",
  "Medical Samples",
  "Meltable Chocolates",
  "Millets",
  "Money, Fake/Dummy/Collectable Cash, Payment Cards, Traveler Cheques",
  "Mosquito Repellent",
  "Mustard",
  "N95 & 4 Ply, 8 Ply Face Masks",
  "Organic Food (any items which has names as organic can't be shipped)",
  "Paints",
  "Passports, IDs, Stamps, Gift Cards",
  "Peacock Feathers (Any Bird)",
  "Pepper & Salt",
  "Perfumes",
  "Perishable Foods",
  "Pickle",
  "Plants & Seeds (Need Phytosanitary Certificates for seeds)",
  "Pornography",
  "Power Bank",
  "Radar detectors",
  "Rice",
  "Sambac & Tuberose",
  "Sandalwood & Red Sandal",
  "Sealant",
  "Speakers",
  "Spectacles & Lenses",
  "Steel Coating",
  "Television",
  "Tonner & Ink",
  "Toy Weapons, Paint Ball Guns and BB guns, Antique weapons, Knives and Swords, Fake grenades, Items that could be used as weapons, etc.",
  "Turmeric",
  "Vape Liquid",
  "Vibhuti & Kumkum",
  "Walkie Talkie",
];

export default function ProhibitedItems() {
  return (
    <div className="p-6 bg-orange-50">
      <h1
        className="text-2xl font-bold mb-4 text-orange-800"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Prohibited Items
      </h1>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {prohibitedItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center bg-white p-4 rounded-lg shadow-md border border-orange-200 h-24 transform transition duration-300 hover:scale-105 hover:shadow-lg hover:border-orange-400 cursor-not-allowed"
            >
              <p
                className="text-center text-gray-600 font-semibold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
