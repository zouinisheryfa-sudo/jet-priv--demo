// Faits issus des pages publiques https://www.flexjet.com/en-us (voir research/INVENTORY.md)
const B = "https://www.flexjet.com/en-us";
export type Aircraft = { id: string; name: string; cls: string; line: string; href: string; specs: [string, string][] };
const S = (p: string, e: string, r: string, s: string, a: string, b: string): [string, string][] => [
  ["Passengers", p], ["Endurance", e], ["Range", r], ["Speed", s], ["Altitude", a], ["Baggage", b],
];
export const FLEET: Aircraft[] = [
  { id: "g700", name: "Gulfstream G700", cls: "Ultra-long-range", line: "The absolute apex.", href: `${B}/fleet/gulfstream-g700`, specs: S("Up to 15", "10 hrs", "7,750 nm", "567 kts", "51,000 ft", "195 ft³") },
  { id: "g650", name: "Gulfstream G650", cls: "Ultra-long-range", line: "A titan of industry.", href: `${B}/fleet/gulfstream-g650`, specs: S("Up to 15", "10 hrs", "7,000 nm", "530 kts", "51,000 ft", "195 ft³") },
  { id: "g500", name: "Gulfstream G500", cls: "Large cabin", line: "A new measure of luxury.", href: `${B}/fleet/gulfstream-g500`, specs: S("Up to 15", "10 hrs", "5,200 nm", "516 kts", "51,000 ft", "175 ft³") },
  { id: "g450", name: "Gulfstream G450", cls: "Large cabin", line: "Enhancing enterprising opportunities.", href: `${B}/fleet/gulfstream-g450`, specs: S("Up to 16", "9 hrs", "4,344 nm", "470 kts", "45,000 ft", "169 ft³") },
  { id: "p600", name: "Praetor 600 / 600E", cls: "Super-midsize", line: "True pathfinder pedigree.", href: `${B}/fleet/praetor-600`, specs: S("Up to 9", "7 hrs 45", "4,018 nm", "466 kts", "45,000 ft", "155 ft³") },
  { id: "c350", name: "Challenger 350 / 3500", cls: "Super-midsize", line: "True executive evolution.", href: `${B}/fleet/challenger-3500`, specs: S("Up to 9", "7 hrs 45", "3,200 nm", "469 kts", "45,000 ft", "106 ft³") },
  { id: "p500", name: "Praetor 500 / 500E", cls: "Midsize", line: "An explorer of endless horizons.", href: `${B}/fleet/praetor-500`, specs: S("Up to 8", "7 hrs", "3,340 nm", "466 kts", "45,000 ft", "150 ft³") },
  { id: "ph300", name: "Phenom 300 / 300E", cls: "Light cabin", line: "Perfectly adapted for adventure.", href: `${B}/fleet/phenom-300`, specs: S("Up to 7", "4 hrs 30", "1,971 nm", "425 kts", "45,000 ft", "76 ft³") },
  { id: "s76", name: "Sikorsky S-76", cls: "Helicopter", line: "Trend-setting performance & precision.", href: `${B}/fleet/sikorsky-s76`, specs: S("Up to 8", "2 hrs 30", "300 nm", "155 kts", "4,000 ft", "38 ft³") },
];
export type Program = { id: string; name: string; tag: string; text: string; ideal: string; points: string[]; href: string };
export const PROGRAMS: Program[] = [
  { id: "frac", name: "Fractional", tag: "The pinnacle of the Flexjet experience", href: `${B}/programs`,
    text: "The main benefits of whole aircraft ownership, without a single one of the burdens. Consistency, exceptional service and guaranteed access for a predictable cost.",
    ideal: "50+ hours annually", points: ["Guaranteed access", "Short callout time", "Interchange opportunities"] },
  { id: "lease", name: "Lease", tag: "The flexibility of liquidity", href: `${B}/programs`,
    text: "The advantages of a fractional share, replacing the upfront capital outlay with a structured monthly installment.",
    ideal: "50+ hours annually", points: ["Guaranteed access", "Short callout time", "Interchange opportunities"] },
  { id: "card", name: "Jet Card", tag: "Experience the Flexjet difference firsthand", href: `${B}/programs`,
    text: "A debit-style program with transparent, all-inclusive hourly rates. Ideal if you are considering fractional ownership or leasing.",
    ideal: "25+ hours annually", points: ["Immediate private jet access", "Inclusive pricing", "Advanced scheduling"] },
  { id: "heli", name: "Helicopter Access", tag: "Premium rotary-wing travel", href: `${B}/programs`,
    text: "Premium, personalized programs for demanding rotary-wing travelers, including fractional ownership and helicopter management.",
    ideal: "Transfers and short hops", points: ["Fractional ownership", "Management of private helicopters", "Available even at the last minute"] },
];
