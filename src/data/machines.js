// Canonical machine catalogue — single source of truth for every page that
// lists or links to individual machines (Machinery grid, Product
// Categories, the Quotation form's machine picker, and the single-product
// detail pages at /machinery/[slug]).
//
// Entries are listed in strict GALLERY-01..29 image order and given their
// name/purpose from that authoritative sequential list. Several images
// share a name (e.g. two different "Pasteurizer Tank" photos) — each still
// gets its own catalog entry and its own unique `slug`, since a slug
// derived from the name alone would collide; the second, third, etc.
// occurrence of a repeated name gets an explicit `slug` below.
//
// `features` and `specifications` come from verified client-provided data
// (01-23). `highlights` and `applications` are left empty until real
// per-machine content is provided — nothing here is invented. The detail
// page only renders a section when it has content. 24-29 have no verified
// spec data yet, so only name/purpose/image are set for them.
export function slugifyMachineName(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Company-wide overview copy already used elsewhere on the site (formerly
// on the Product Categories page) — reused here rather than writing new,
// unverified per-machine descriptions.
const OVERVIEW = [
  "DOSTAN offers a comprehensive range of processing and production machinery engineered for demanding industrial environments. Our equipment supports efficient, hygienic, and consistent production across dairy, ice cream, food, beverage, and related applications. From individual processing units to integrated production systems, every machine is developed with precision and reliability in mind.",
  "Our range includes pasteurizers, homogenizers, continuous freezers, cooling systems, pumps, filtration equipment, and specialized machinery. Each solution can be configured around specific production capacities, process requirements, and facility layouts. Built with robust construction and practical engineering, DOSTAN machines deliver reliable performance for continuous production.",
];

// Shared verified content for the two duplicate-name pairs (Products 03/04
// and 05/09 each use identical client-provided specs — reused by reference
// rather than copy-pasted, so they can never drift apart).
const PASTEURIZER_TANK_FEATURES = [
  "Pressure adjustment by hand wheel with imported springs",
  "Sterile coated seat with ball-type NRV for suction and discharge valves",
  "Sterlite-coated homogenizing valve",
  "Imported SS diaphragm-type sanitary pressure gauge",
  "High-strength steel eccentric shaft and connecting rod assembly",
  "Splash lubrication system",
  "Electrical panel with over-pressure tripping safety",
  "All product-contact parts in SS 304",
  "Heavy-duty zinc-coated homogenizer frame",
  "SS 304 covering panel",
  "Two-stage homogenization",
  "Low RPM triplex plunger pump",
];
const PASTEURIZER_TANK_SPECS = [
  { label: "Capacity", value: "100/200/300/500 LPH to Max." },
  { label: "Power", value: "220-415 Volt / 50Hz / Single / Three Phase" },
  { label: "Insulation", value: "Glass wool" },
  { label: "Type", value: "Triple Layer Jackets, Non-Magnetic" },
  { label: "Motor", value: "Crompton Motors / Equivalent Make" },
  { label: "Heater", value: "3 Phase / 1 Phase" },
  { label: "Body Material", value: "SS 304 Food Grade (8% Nickel)" },
  { label: "Temperature", value: "70 to 85°C" },
];

const PLATE_HEAT_EXCHANGER_FEATURES = [
  "Temperature conversion",
  "Heating and cooling process",
  "Temperature control",
  "Efficient heat transfer",
  "Fluids flow through separate channels without mixing",
];
const PLATE_HEAT_EXCHANGER_SPECS = [
  { label: "PHE Model", value: "Type-A / Type-B / Type-C / Type-D" },
  { label: "Capacity", value: "100 / 200 / 300 / 500 LPH" },
  { label: "Temperature Difference", value: "80°C to 40°C" },
  { label: "Water Flow", value: "1800 to 2000 LPH at 30°C" },
  { label: "Stage", value: "Single and Double Stage available" },
];

const COOLING_TOWER_FEATURES = [
  "Corrosion resistant FRP construction",
  "Energy efficient operation",
  "Easy maintenance",
  "Quiet operation",
  "Integrated water treatment options",
  "User-friendly maintenance",
];
const COOLING_TOWER_SPECS = [
  { label: "Structure", value: "FRP, Square & Round Type" },
  { label: "Fill", value: "PVC" },
  { label: "Power Supply", value: "415 Volt / 50 Hz / AC, 3 Phase" },
  { label: "Header", value: "Galvanized MS" },
  { label: "Motor", value: "Crompton / Equivalent" },
  { label: "Nozzle", value: "Polypropylene (PP)" },
  { label: "Hardwires", value: "HDG.MS. / SS" },
  { label: "Fan Assembly", value: "Cast aluminum alloy / GRP bladed" },
  { label: "Fan Cylinder", value: "FRP" },
  { label: "Gearbox", value: "Worm / Spiral bevel" },
  { label: "Capacity", value: "10TR, 15TR, 20TR, 30TR, 50TR" },
];

// Products 22 and 23 share the same verified spec block (mobile/FOW-type
// refrigeration units) in the client-provided data.
const FOW_UNIT_SPECS = [
  { label: "Models", value: "120 L / 200 L" },
  { label: "Storage Capacity", value: "120 / 200 L" },
  { label: "Temperature Range", value: "-18 to 30°C" },
  { label: "Power Consumption", value: "315 / 340 W" },
  { label: "Current", value: "1.62 / 2.1 A" },
  { label: "Dimensions (120 L)", value: "705 H × 970 W × 640 D mm" },
  { label: "Dimensions (200 L)", value: "860 H × 1035 W × 640 D mm" },
  { label: "Doors", value: "1 / 2 SS doors" },
  { label: "Refrigerant", value: "R-134a" },
  { label: "Stabilizer", value: "0.75 / 1 kW/hr" },
  { label: "Usage", value: "Ice Cream" },
];

const RAW_MACHINES = [
  {
    name: "Ageing Tank",
    purpose: "Ages and conditions ice cream mix before freezing.",
    image: "/images/machines/GALLERY-01.webp",
    gallery: ["/images/machines/GALLERY-01.webp"],
    features: [
      "Batch pasteurization using steam jacket kettle or hot water tank",
      "Cools and stores ice cream mix at 4°C",
      "Slow agitation for complete ageing and improved ice cream structure",
      "Electrical panel with over-pressure tripping safety",
      "All product-contact parts in SS 304",
      "Triple-layer jacket with mirror finish",
      "Thermal processing using steam and hot water",
    ],
    specifications: [
      { label: "Homogenizer Frame", value: "Heavy-duty zinc-coated frame" },
      { label: "Covering Panel", value: "SS 304" },
      { label: "Homogenization", value: "Two-stage" },
      { label: "Pump", value: "Low RPM triplex plunger pump" },
      { label: "Capacity", value: "100/200/300/500 LPH to Max." },
      { label: "Power", value: "220-240 Volt / 50Hz / Single / Three Phase" },
      { label: "Compressor", value: "Emerson / Tecumseh" },
      { label: "Insulation", value: "PUF Insulation" },
      { label: "Motor", value: "Crompton Motor / Equivalent Make" },
      { label: "Refrigerant", value: "R-404a" },
      { label: "Body Material", value: "SS 304 Food Grade (8% Nickel)" },
    ],
  },
  {
    name: "Cooling Tower",
    purpose: "Removes heat from process water.",
    image: "/images/machines/GALLERY-02.webp",
    gallery: ["/images/machines/GALLERY-02.webp"],
    features: COOLING_TOWER_FEATURES,
    specifications: COOLING_TOWER_SPECS,
  },
  {
    name: "Pasteurizer Tank",
    purpose: "Pasteurizes milk and ice cream mix.",
    image: "/images/machines/GALLERY-03.webp",
    gallery: ["/images/machines/GALLERY-03.webp"],
    features: PASTEURIZER_TANK_FEATURES,
    specifications: PASTEURIZER_TANK_SPECS,
  },
  {
    name: "Pasteurizer Tank",
    slug: "pasteurizer-tank-04",
    purpose: "Pasteurizes milk and ice cream mix.",
    image: "/images/machines/GALLERY-04.webp",
    gallery: ["/images/machines/GALLERY-04.webp"],
    features: PASTEURIZER_TANK_FEATURES,
    specifications: PASTEURIZER_TANK_SPECS,
  },
  {
    name: "Plate Heat Exchanger",
    purpose: "Heats or cools process fluids through efficient heat transfer.",
    image: "/images/machines/GALLERY-05.webp",
    gallery: ["/images/machines/GALLERY-05.webp"],
    features: PLATE_HEAT_EXCHANGER_FEATURES,
    specifications: PLATE_HEAT_EXCHANGER_SPECS,
  },
  {
    name: "Milk Pump & Filter",
    purpose: "Pumps and filters milk during processing.",
    image: "/images/machines/GALLERY-06.webp",
    gallery: ["/images/machines/GALLERY-06.webp"],
    features: [
      "Positive displacement technology",
      "Easy integration",
      "Stainless steel construction",
      "Energy efficiency",
    ],
    specifications: [
      { label: "SS Milk Filter Size", value: '1", 2", 3", etc.' },
      { label: "SS Milk Pump Capacity", value: "½ HP, 1 HP, 2 HP, etc." },
      { label: "Power Supply", value: "3 Phase / 1 Phase - 415 V / 50 Hz / AC" },
      { label: "Working", value: "Milk" },
    ],
  },
  {
    name: "Hardening Tunnel",
    purpose: "Rapidly hardens ice cream and frozen products.",
    image: "/images/machines/GALLERY-07.webp",
    gallery: ["/images/machines/GALLERY-07.webp"],
    features: [
      "Specially designed for rapid hardening of candy and ice cream",
      "Robust and elegant design",
      "Efficient refrigerated chambers",
      "Automatic temperature control",
      "Automatic defrost system",
      "High-density PUF insulation",
      "SS 304 inner and outer covers",
      "High airflow system",
      "Compact and space-efficient design",
    ],
    specifications: [
      { label: "Temperature Range", value: "-35°C to -40°C" },
      { label: "Capacity", value: "12, 20, 30 moulds" },
      { label: "Door Type", value: "1-2-4" },
      { label: "Storage", value: "100 L to 300 L" },
      { label: "Power Source", value: "Electric, 220-415 Volt, 50Hz, 3PH" },
      { label: "Defrost Type", value: "Auto-Defrost" },
      { label: "Usage/Application", value: "Food Industry" },
      { label: "Automation Grade", value: "Automatic (Online)" },
      { label: "Working Temperature", value: "-35°C to -45°C" },
      { label: "Compressor", value: "Danfoss / Bitzer / Other" },
      { label: "Condenser", value: "Air Cooled / Water Cooled" },
      { label: "Body Material", value: "Stainless Steel, SS 304/PGI" },
      { label: "Rear & Back Door", value: "1-1, 1-2, 4-4" },
    ],
  },
  {
    name: "Continuous Freezer",
    purpose: "Continuously freezes and aerates ice cream mix.",
    image: "/images/machines/GALLERY-08.webp",
    gallery: ["/images/machines/GALLERY-08.webp"],
    features: [
      "High-conductivity metal hard chrome-plated cylinder",
      "Hollow two-piece construction dasher",
      "Variable-speed AC frequency drive for mix pump",
      "SS diaphragm sanitary pressure gauge",
      "Suction and discharge pressure gauges",
      "Interlock and safety controls",
      "Anti-freeze protection device",
      "SS 304 covering panel",
      "Hot gas supply to freezing cylinder for viscosity control",
      "Hour meter",
    ],
    specifications: [
      { label: "Capacity", value: "200 LPH, 400 LPH, 600 LPH to Max." },
      { label: "Power Supply", value: "415 Volt / 50 Hz / AC, 3 Phase" },
      { label: "Power Consumption", value: "5.8 kW/h" },
      { label: "Compressor", value: "DANFOSS" },
      { label: "Cylinder", value: "Brass with hard chrome plating" },
      { label: "Gear Box Motor", value: "Crompton / Equivalent, 2 HP / 1.5 kW" },
      { label: "Refrigerant", value: "R-404a" },
      { label: "Body Material", value: "SS 304 Food Grade (8% Nickel)" },
    ],
  },
  {
    name: "Plate Heat Exchanger",
    slug: "plate-heat-exchanger-09",
    purpose: "Heats or cools process fluids through efficient heat transfer.",
    image: "/images/machines/GALLERY-09.webp",
    gallery: ["/images/machines/GALLERY-09.webp"],
    features: PLATE_HEAT_EXCHANGER_FEATURES,
    specifications: PLATE_HEAT_EXCHANGER_SPECS,
  },
  {
    name: "SS Mold of Kulfi & Chocobar",
    purpose: "Forms kulfi, ice candy and chocobar products.",
    image: "/images/machines/GALLERY-10.webp",
    gallery: ["/images/machines/GALLERY-10.webp"],
    features: [
      "High-quality stainless steel construction",
      "Precision engineering",
      "Smooth surface finish",
      "Stackable design for space efficiency",
      "All types of kulfi, ice candy and chocobar moulds available with stick holder",
    ],
    specifications: [
      { label: "Size", value: '11" × 12", 12" × 13"' },
      { label: "Capacity", value: "35ML, 40ML, 45ML, 50ML, 55ML to 120ML" },
      { label: "Shape", value: "All shapes available" },
      { label: "Material", value: "Stainless Steel" },
    ],
  },
  {
    name: "Cup & Cone Filling",
    purpose: "Fills ice cream into cups and cones.",
    image: "/images/machines/GALLERY-11.webp",
    gallery: ["/images/machines/GALLERY-11.webp"],
    features: [
      "Compact design",
      "Requires less floor space",
      "Batch coding possible on conveyor",
      "Can be connected in line with a continuous freezer",
      "Real-time monitoring",
      "Energy efficiency",
      "Remote access",
      "Durability",
    ],
    specifications: [
      { label: "Size", value: "1150 mm L × 975 mm W × 1650 H approx." },
      { label: "Filling Quantity", value: "50 ml minimum up to 200 ml" },
      { label: "Dies", value: "48 dies for 50 & 100 ml cup and 60 & 120 ml cone" },
      { label: "Speed Variator", value: "AC frequency drive" },
      { label: "PLC", value: "Mitsubishi / Delta" },
      { label: "Round Cup", value: "Max. diameter 80 mm, height 75 mm" },
      { label: "Round Cone", value: "Max. diameter 60 mm, height 150 mm" },
      { label: "Power Requirement", value: "0.5 HP motor, 50 Hz, 440 Volt, 3 Phase" },
      { label: "Air Supply", value: "1000 litre/minute at 6 kg" },
      { label: "Ingredient Size", value: "10 mm × 10 mm × 10 mm" },
    ],
  },
  {
    name: "Fruit Freezer",
    purpose: "Processes and feeds wet and dry fruit ingredients into ice cream.",
    image: "/images/machines/GALLERY-12.webp",
    gallery: ["/images/machines/GALLERY-12.webp"],
    features: [
      "Separate hopper with agitator for wet and dry ingredients",
      "SS 304 contact parts",
      "Variable-speed electronic frequency control for lifter, rotor, mixer and augers",
      "SS 304 covering panel",
      "Special nickel-alloy blades",
      "Three-blade rotary valve",
      "Aluminum and food-grade plastics",
    ],
    specifications: [
      { label: "Ice Cream Capacity", value: "300–600 L/hr / 800–1200 L/hr" },
      { label: "Hopper 1 Capacity", value: "15 L" },
      { label: "Hopper 2 Capacity", value: "15 L" },
      { label: "Auger 1", value: "10–40 / 22–103" },
      { label: "Auger 2", value: "20–80 / 40–160" },
      { label: "Auger 1 Motor", value: "0.37 kW" },
      { label: "Auger 2 Motor", value: "0.37 kW" },
      { label: "Mixer Motor", value: "0.37 / 0.75 kW" },
      { label: "Lifter Motor", value: "0.75 / 1.1 kW" },
    ],
  },
  {
    name: "Cooling Tower",
    slug: "cooling-tower-13",
    purpose: "Removes heat from process water.",
    image: "/images/machines/GALLERY-13.webp",
    gallery: ["/images/machines/GALLERY-13.webp"],
    features: COOLING_TOWER_FEATURES,
    specifications: COOLING_TOWER_SPECS,
  },
  {
    name: "Servo HMI Pouch Packing Machine",
    purpose: "Automatically fills and seals pouches.",
    image: "/images/machines/GALLERY-14.webp",
    gallery: ["/images/machines/GALLERY-14.webp"],
    features: [
      "Low maintenance and easy access",
      "Advanced servo motor control",
      "High-speed wrapping efficiency",
      "User-friendly HMI touchscreen",
    ],
    specifications: [
      { label: "Product Dimension", value: "As per product - 99/62 mm" },
      { label: "Output", value: "50 to 120 pouch/min, variable speed" },
      { label: "Sealing Type", value: "Centre sealing" },
      { label: "PLC", value: "Delta / Equivalent" },
      { label: "HMI", value: "Fuji / Wecon" },
      { label: "AC Drive", value: "Crompton / Equivalent" },
      { label: "Photo Sensor", value: "Banner" },
      { label: "Encoder", value: "Autonics / Baumer / Equivalent" },
      { label: "Machine Body", value: "SS Covering" },
      { label: "Power Connection", value: "3 Ph / 1 Ph" },
      { label: "Power Requirement", value: "2 HP / Heater - 2 × 125W, 4 × 125W" },
      { label: "Main Motor", value: "1 HP with 1 HP AC Drive" },
      { label: "Machine Dimension", value: "3600 × 1500 × 2000 mm" },
      { label: "Machine Weight", value: "400 to 500 kg" },
      { label: "Dosing System", value: "Manual Filling" },
    ],
  },
  {
    name: "High Pressure Homogenizer",
    purpose: "Homogenizes milk, ice cream and juice under high pressure.",
    image: "/images/machines/GALLERY-15.webp",
    gallery: ["/images/machines/GALLERY-15.webp"],
    features: [
      "Pressure adjustment by hand wheel with imported springs",
      "Sterlite-coated seat with ball-type NRV",
      "Sterlite-coated homogenizing valve",
      "Imported SS diaphragm sanitary pressure gauge",
      "High-strength steel eccentric shaft and connecting rod assembly",
      "Splash lubrication system",
      "Electrical panel with over-pressure tripping safety",
      "SS 304 product-contact parts",
      "Heavy-duty zinc-coated frame",
      "SS 304 covering panel",
      "Two-stage homogenization",
      "Low RPM triplex plunger pump",
    ],
    specifications: [
      { label: "Capacity", value: "200/300/500 LPH to Max." },
      { label: "Power", value: "220-415 Volt / 50Hz / Single / Three Phase" },
      { label: "Operating Pressure", value: "200 Kg/cm² (3000 PSI)" },
      { label: "Input", value: "Milk, Ice Cream & Juice" },
      { label: "Plunger & Piston", value: "3 Nos." },
      { label: "Motor", value: "Crompton / Equivalent" },
      { label: "Pressure Gauge", value: "Akvalo / Equivalent Make" },
      { label: "Pressure Stage", value: "Double Stage" },
      { label: "Valve", value: "Satellite suction & discharge valve" },
    ],
  },
  {
    name: "Ice Candy Making Machine",
    purpose: "Produces frozen ice candies and popsicles.",
    image: "/images/machines/GALLERY-16.webp",
    gallery: ["/images/machines/GALLERY-16.webp"],
    features: [
      "Inner tank SS 316/304",
      "Outer tank SS 304",
      "PUF-insulated brine tank",
      "SS brine spray system",
      "Quick start-up",
      "Easy cleaning",
      "Suitable for continuous production",
      "Pre-wired electric control panel",
      "Thermostat and safety systems",
    ],
    specifications: [
      { label: "Compressor", value: "Emerson / Copeland" },
      { label: "Moulds", value: "6 / 12 / 18 to 72 moulds" },
      { label: "Temperature", value: "-25 to 30°C" },
      { label: "Power Supply", value: "1 Phase or 3 Phase / 415V / 50Hz / AC" },
      { label: "Body Material", value: "SS 304 Food Grade (8% Nickel)" },
      { label: "Cooling", value: "Air Cooled & Water Cooled" },
      { label: "Cooling Coil", value: "Copper Coil" },
      { label: "Insulation", value: "PUF Insulation" },
      { label: "Agitator Motor", value: "Worm Gear Box Motor, Crompton / Equivalent" },
    ],
  },
  {
    name: "Chocolate & Defrost Tank",
    purpose: "Stores, mixes and heats chocolate sauce and food products.",
    image: "/images/machines/GALLERY-17.webp",
    gallery: ["/images/machines/GALLERY-17.webp"],
    features: [
      "Temperature control system",
      "Easy cleaning and maintenance",
      "Automated temperature control",
      "Double-jacketed heating",
      "Suitable for heating, mixing, blending and storage",
    ],
    specifications: [
      { label: "Capacity", value: "40 LTR – 80 LTR" },
      { label: "Power", value: "220-415 Volt / 50Hz / Single / Three Phase" },
      { label: "Insulation", value: "Glass wool" },
      { label: "Type", value: "Triple Layer Jackets, Non-Magnetic" },
      { label: "Heater", value: "1 kW" },
      { label: "Body Material", value: "SS 304 Food Grade (8% Nickel)" },
    ],
  },
  {
    name: "Glycol Deep Freezer",
    purpose: "Provides low-temperature storage for frozen products.",
    image: "/images/machines/GALLERY-18.webp",
    gallery: ["/images/machines/GALLERY-18.webp"],
    features: [
      "Mobile and compact design",
      "High-performance compressor",
      "Stainless steel interior",
      "Energy-efficient operation",
    ],
    specifications: [
      { label: "Models", value: "400 L / 600 L / 800 L / 1000 L / 1200 L" },
      { label: "Storage Capacity", value: "400 / 600 / 800 / 1000 / 1200 L" },
      { label: "Temperature Range", value: "-18 to -25°C" },
      { label: "Power Consumption", value: "350 / 650 / 700 / 1300 / 1300 W" },
      { label: "Current", value: "2.2 / 3 / 4.5 / 6 / 6.5 A" },
      { label: "Refrigerant", value: "R-134a / R-404a depending on model" },
      { label: "Usage", value: "Ice Cream" },
      { label: "Body/Interior", value: "Stainless Steel" },
      { label: "Doors", value: "SS doors according to model" },
    ],
  },
  {
    name: "Cold Room & Blast Room",
    purpose: "Provides controlled cold storage and rapid product freezing.",
    image: "/images/machines/GALLERY-19.webp",
    gallery: ["/images/machines/GALLERY-19.webp"],
    features: [
      "Precise temperature control",
      "Heavy-duty compressor",
      "High-quality insulation",
      "Uniform air circulation",
      "Airtight sweep gasket",
      "PUF insulated panels",
      "Multiple door configurations",
      "Air-cooled, water-cooled or evaporative condenser options",
    ],
    specifications: [
      { label: "Temperature Range", value: "-18°C to 25°C" },
      { label: "Capacity", value: "5 CFT to 1000 CFT, depending on requirements" },
      { label: "Insulation", value: "High-density PUF, 100 mm" },
      { label: "Cooling System", value: "Heavy-duty compressor system" },
      { label: "Refrigerant", value: "R404a" },
      { label: "Interior", value: "Food-grade stainless steel" },
      { label: "Exterior", value: "Corrosion-resistant coated steel / PPGI panels" },
      { label: "Temperature Control", value: "Digital control with real-time display" },
    ],
  },
  {
    name: "Refrigerated Van & TDU",
    purpose:
      "Transports frozen and temperature-sensitive products under controlled temperatures.",
    image: "/images/machines/GALLERY-20.webp",
    gallery: ["/images/machines/GALLERY-20.webp"],
    features: [
      "Mobile and compact design",
      "High-performance compressor",
      "Stainless steel interior",
      "Energy-efficient operation",
      "High-density PUF insulation",
      "Digital temperature control",
      "Airtight insulated doors",
    ],
    specifications: [
      { label: "Temperature Range", value: "-5°C to -20°C" },
      { label: "Capacity", value: "30 / 40 / 80 crates" },
      { label: "Refrigeration System", value: "High-efficiency compressor with R404a" },
      { label: "Cooling/Insulation", value: "High-density PUF" },
      { label: "Body Material", value: "Pre-painted galvanized iron or stainless steel" },
      {
        label: "Temperature Control",
        value: "Digital thermostat with real-time display and alarm",
      },
      { label: "Doors", value: "Insulated airtight doors with magnetic seals and locking system" },
    ],
  },
  {
    name: "Flavour Tank",
    purpose: "Mixes and stores ice cream flavours.",
    image: "/images/machines/GALLERY-21.webp",
    gallery: ["/images/machines/GALLERY-21.webp"],
    features: [
      "Mobile design options",
      "Customizable features",
      "Low maintenance requirements",
      "User-friendly interface",
    ],
    specifications: [
      { label: "Capacity", value: "50 LTR / 100 LTR / 200 LTR / etc." },
      { label: "Shape", value: "Square & Round" },
      { label: "Material", value: "SS 304 Food Grade (8% Nickel)" },
    ],
  },
  {
    name: "Glycol FOW Freezer",
    purpose: "Provides mobile, low-cost freezing for ice cream.",
    image: "/images/machines/GALLERY-22.webp",
    gallery: ["/images/machines/GALLERY-22.webp"],
    features: [
      "Mobile/freezer-on-wheels design",
      "Low initial cost",
      "Low operating cost",
      "Low electrical consumption",
      "Long life cycle",
      "Pollution-free operation",
    ],
    specifications: FOW_UNIT_SPECS,
  },
  {
    name: "FOW / Truck / E-Rickshaw",
    purpose: "Provides mobile refrigerated storage and ice cream distribution.",
    image: "/images/machines/GALLERY-23.webp",
    gallery: ["/images/machines/GALLERY-23.webp"],
    features: [
      "Mobile and compact design",
      "High-performance compressor",
      "Stainless steel interior",
      "Energy-efficient operation",
      "Suitable for mobile ice cream retail/distribution",
    ],
    specifications: FOW_UNIT_SPECS,
  },
  // Products 24-29: no verified spec data provided yet — name/purpose/image
  // only, left over from the prior sequential-mapping pass. Not touched by
  // this update.
  {
    name: "Ice Cream Filling & Packaging Line",
    purpose: "Automates ice cream filling and packaging.",
    image: "/images/machines/GALLERY-24.webp",
    gallery: ["/images/machines/GALLERY-24.webp"],
  },
  {
    name: "Ice Cream Filling & Packaging Line",
    slug: "ice-cream-filling-packaging-line-25",
    purpose: "Automates ice cream filling and packaging.",
    image: "/images/machines/GALLERY-25.webp",
    gallery: ["/images/machines/GALLERY-25.webp"],
  },
  {
    name: "Ice Cream Cup Filling & Sealing Machine",
    purpose: "Fills and seals ice cream cups.",
    image: "/images/machines/GALLERY-26.webp",
    gallery: ["/images/machines/GALLERY-26.webp"],
  },
  {
    name: "Ice Cream Bar / Popsicle Production Line",
    purpose: "Produces ice cream bars and popsicles.",
    image: "/images/machines/GALLERY-27.webp",
    gallery: ["/images/machines/GALLERY-27.webp"],
  },
  {
    name: "Multi-Product Ice Cream Production Line",
    purpose: "Produces multiple ice cream product formats.",
    image: "/images/machines/GALLERY-28.webp",
    gallery: ["/images/machines/GALLERY-28.webp"],
  },
  {
    name: "Ice Cream Cone Filling & Packaging Line",
    purpose: "Fills and packages ice cream cones.",
    image: "/images/machines/GALLERY-29.webp",
    gallery: ["/images/machines/GALLERY-29.webp"],
  },
];

export const MACHINES = RAW_MACHINES.map((machine) => ({
  overview: OVERVIEW,
  features: [],
  highlights: [],
  specifications: [],
  applications: [],
  ...machine,
  // An explicit `slug` (used above wherever a name repeats, since two
  // machines can't share a derived slug) always wins over one derived
  // from `name`.
  slug: machine.slug ?? slugifyMachineName(machine.name),
}));

export function findMachineBySlug(slug) {
  if (!slug) return null;
  const normalized = slugifyMachineName(slug);
  return MACHINES.find((machine) => machine.slug === normalized) ?? null;
}

// Looks up a machine by its detail-page image instead of its name/slug.
// Used wherever a card only has the image to key off of.
export function findMachineByImage(image) {
  if (!image) return null;
  return MACHINES.find((machine) => machine.image === image) ?? null;
}
