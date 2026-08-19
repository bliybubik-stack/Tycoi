const OBJECTS = [

/* =========================
   CONVEYORS 1-20
========================= */

{
    id:"conv_basic",
    name:"Basic Conveyor",
    category:"conveyor",
    icon:"→",
    cost:10,
    speed:1,
    type:"conveyor",
    description:"Standard transport belt."
},

{
    id:"conv_fast",
    name:"Fast Conveyor",
    category:"conveyor",
    icon:"≫",
    cost:35,
    speed:2,
    type:"conveyor",
    description:"Moves items twice as fast."
},

{
    id:"conv_ultra",
    name:"Ultra Conveyor",
    category:"conveyor",
    icon:"»",
    cost:100,
    speed:4,
    type:"conveyor",
    description:"Extremely fast transport."
},

{
    id:"conv_slow",
    name:"Slow Conveyor",
    category:"conveyor",
    icon:"·",
    cost:5,
    speed:.5,
    type:"conveyor",
    description:"Cheap but slow."
},

{
    id:"conv_left",
    name:"Left Conveyor",
    category:"conveyor",
    icon:"←",
    cost:12,
    speed:1,
    direction:"left",
    type:"conveyor",
    description:"Moves items left."
},

{
    id:"conv_right",
    name:"Right Conveyor",
    category:"conveyor",
    icon:"→",
    cost:12,
    speed:1,
    direction:"right",
    type:"conveyor",
    description:"Moves items right."
},

{
    id:"conv_up",
    name:"Up Conveyor",
    category:"conveyor",
    icon:"↑",
    cost:12,
    speed:1,
    direction:"up",
    type:"conveyor",
    description:"Moves items upward."
},

{
    id:"conv_down",
    name:"Down Conveyor",
    category:"conveyor",
    icon:"↓",
    cost:12,
    speed:1,
    direction:"down",
    type:"conveyor",
    description:"Moves items downward."
},

{
    id:"conv_corner",
    name:"Corner Conveyor",
    category:"conveyor",
    icon:"└",
    cost:18,
    speed:1,
    type:"conveyor",
    description:"Turns production lines."
},

{
    id:"conv_split",
    name:"Splitter Conveyor",
    category:"conveyor",
    icon:"Y",
    cost:50,
    speed:1,
    type:"conveyor",
    description:"Splits items into two paths."
},

{
    id:"conv_merge",
    name:"Merge Conveyor",
    category:"conveyor",
    icon:"X",
    cost:50,
    speed:1,
    type:"conveyor",
    description:"Combines two paths."
},

{
    id:"conv_cross",
    name:"Cross Conveyor",
    category:"conveyor",
    icon:"+",
    cost:70,
    speed:1,
    type:"conveyor",
    description:"Crosses production lines."
},

{
    id:"conv_accel",
    name:"Accelerator Belt",
    category:"conveyor",
    icon:"⚡",
    cost:120,
    speed:5,
    type:"conveyor",
    description:"Accelerates items."
},

{
    id:"conv_magnetic",
    name:"Magnetic Belt",
    category:"conveyor",
    icon:"M",
    cost:200,
    speed:3,
    type:"conveyor",
    description:"Magnetically moves metal items."
},

{
    id:"conv_heavy",
    name:"Heavy Conveyor",
    category:"conveyor",
    icon:"H",
    cost:300,
    speed:2,
    type:"conveyor",
    description:"Designed for heavy materials."
},

{
    id:"conv_light",
    name:"Light Conveyor",
    category:"conveyor",
    icon:"L",
    cost:80,
    speed:3,
    type:"conveyor",
    description:"Cheap high-speed belt."
},

{
    id:"conv_quantum",
    name:"Quantum Belt",
    category:"conveyor",
    icon:"Q",
    cost:1000,
    speed:10,
    type:"conveyor",
    description:"Items almost teleport."
},

{
    id:"conv_void",
    name:"Void Belt",
    category:"conveyor",
    icon:"Ø",
    cost:2500,
    speed:15,
    type:"conveyor",
    description:"Consumes almost no space."
},

{
    id:"conv_infinite",
    name:"Infinite Belt",
    category:"conveyor",
    icon:"∞",
    cost:10000,
    speed:25,
    type:"conveyor",
    description:"Endgame transport."
},

{
    id:"conv_master",
    name:"Master Conveyor",
    category:"conveyor",
    icon:"◆",
    cost:100000,
    speed:50,
    type:"conveyor",
    description:"The ultimate belt."
},


/* =========================
   MACHINES 21-40
========================= */

{
    id:"machine_press",
    name:"Press",
    category:"machine",
    icon:"P",
    cost:100,
    multiplier:1.2,
    type:"machine",
    description:"Compresses materials."
},

{
    id:"machine_cutter",
    name:"Cutter",
    category:"machine",
    icon:"C",
    cost:150,
    multiplier:1.3,
    type:"machine",
    description:"Cuts materials."
},

{
    id:"machine_furnace",
    name:"Furnace",
    category:"machine",
    icon:"F",
    cost:250,
    multiplier:1.5,
    type:"machine",
    description:"Processes raw materials."
},

{
    id:"machine_mixer",
    name:"Mixer",
    category:"machine",
    icon:"M",
    cost:350,
    multiplier:1.7,
    type:"machine",
    description:"Combines materials."
},

{
    id:"machine_grinder",
    name:"Grinder",
    category:"machine",
    icon:"G",
    cost:500,
    multiplier:2,
    type:"machine",
    description:"Grinds materials."
},

{
    id:"machine_melter",
    name:"Melter",
    category:"machine",
    icon:"W",
    cost:700,
    multiplier:2.2,
    type:"machine",
    description:"Melts resources."
},

{
    id:"machine_drill",
    name:"Drill",
    category:"machine",
    icon:"D",
    cost:900,
    multiplier:2.5,
    type:"machine",
    description:"Extracts underground materials."
},

{
    id:"machine_refinery",
    name:"Refinery",
    category:"machine",
    icon:"R",
    cost:1200,
    multiplier:3,
    type:"machine",
    description:"Refines raw resources."
},

{
    id:"machine_assembler",
    name:"Assembler",
    category:"machine",
    icon:"A",
    cost:2000,
    multiplier:3.5,
    type:"machine",
    description:"Builds products."
},

{
    id:"machine_fabricator",
    name:"Fabricator",
    category:"machine",
    icon:"F",
    cost:3000,
    multiplier:4,
    type:"machine",
    description:"Advanced manufacturing."
},

{
    id:"machine_laser",
    name:"Laser Cutter",
    category:"machine",
    icon:"L",
    cost:5000,
    multiplier:5,
    type:"machine",
    description:"Precision processing."
},

{
    id:"machine_nuclear",
    name:"Nuclear Processor",
    category:"machine",
    icon:"N",
    cost:10000,
    multiplier:7,
    type:"machine",
    description:"Extreme processing."
},

{
    id:"machine_quantum",
    name:"Quantum Processor",
    category:"machine",
    icon:"Q",
    cost:25000,
    multiplier:10,
    type:"machine",
    description:"Processes matter at quantum scale."
},

{
    id:"machine_ai",
    name:"AI Processor",
    category:"machine",
    icon:"AI",
    cost:50000,
    multiplier:15,
    type:"machine",
    description:"Artificial intelligence powered production."
},

{
    id:"machine_nanoforge",
    name:"Nanoforge",
    category:"machine",
    icon:"NF",
    cost:100000,
    multiplier:20,
    type:"machine",
    description:"Creates microscopic components."
},

{
    id:"machine_antimatter",
    name:"Antimatter Core",
    category:"machine",
    icon:"AM",
    cost:250000,
    multiplier:30,
    type:"machine",
    description:"Dangerously powerful."
},

{
    id:"machine_dimension",
    name:"Dimension Engine",
    category:"machine",
    icon:"D",
    cost:1000000,
    multiplier:50,
    type:"machine",
    description:"Produces matter from dimensions."
},

{
    id:"machine_time",
    name:"Time Machine",
    category:"machine",
    icon:"T",
    cost:5000000,
    multiplier:100,
    type:"machine",
    description:"Production exists before it happens."
},

{
    id:"machine_universal",
    name:"Universal Factory",
    category:"machine",
    icon:"U",
    cost:25000000,
    multiplier:250,
    type:"machine",
    description:"A factory inside your factory."
},

{
    id:"machine_absolute",
    name:"Absolute Machine",
    category:"machine",
    icon:"◆",
    cost:100000000,
    multiplier:1000,
    type:"machine",
    description:"Endgame machine."
},


/* =========================
   UTILITY 41-60
========================= */

{
    id:"collector",
    name:"Collector",
    category:"utility",
    icon:"$",
    cost:50,
    type:"collector",
    description:"Collects finished products."
},

{
    id:"collector_big",
    name:"Large Collector",
    category:"utility",
    icon:"$",
    cost:500,
    type:"collector",
    multiplier:2,
    description:"Large collection area."
},

{
    id:"storage",
    name:"Storage",
    category:"utility",
    icon:"S",
    cost:100,
    capacity:100,
    type:"storage",
    description:"Stores products."
},

{
    id:"storage_big",
    name:"Large Storage",
    category:"utility",
    icon:"S",
    cost:500,
    capacity:1000,
    type:"storage",
    description:"Stores lots of products."
},

{
    id:"power",
    name:"Power Generator",
    category:"utility",
    icon:"P",
    cost:200,
    power:100,
    type:"power",
    description:"Provides factory power."
},

{
    id:"power_large",
    name:"Power Plant",
    category:"utility",
    icon:"PP",
    cost:2000,
    power:1000,
    type:"power",
    description:"Large-scale power."
},

{
    id:"speed_booster",
    name:"Speed Booster",
    category:"utility",
    icon:"S",
    cost:1000,
    multiplier:1.5,
    type:"booster",
    description:"Speeds nearby machines."
},

{
    id:"speed_booster_2",
    name:"Hyper Booster",
    category:"utility",
    icon:"H",
    cost:10000,
    multiplier:3,
    type:"booster",
    description:"Massively boosts production."
},

{
    id:"range_booster",
    name:"Range Booster",
    category:"utility",
    icon:"R",
    cost:1500,
    range:4,
    type:"booster",
    description:"Extends nearby machine range."
},

{
    id:"buffer",
    name:"Buffer",
    category:"utility",
    icon:"B",
    cost:500,
    capacity:250,
    type:"storage",
    description:"Temporary item storage."
},

{
    id:"splitter",
    name:"Industrial Splitter",
    category:"utility",
    icon:"Y",
    cost:750,
    type:"splitter",
    description:"Splits item streams."
},

{
    id:"filter",
    name:"Filter",
    category:"utility",
    icon:"F",
    cost:900,
    type:"filter",
    description:"Filters production."
},

{
    id:"router",
    name:"Router",
    category:"utility",
    icon:"R",
    cost:1200,
    type:"router",
    description:"Routes products."
},

{
    id:"teleporter",
    name:"Teleporter",
    category:"utility",
    icon:"T",
    cost:5000,
    type:"teleporter",
    description:"Instantly moves items."
},

{
    id:"charger",
    name:"Charger",
    category:"utility",
    icon:"C",
    cost:750,
    type:"charger",
    description:"Charges machines."
},

{
    id:"repair",
    name:"Repair Station",
    category:"utility",
    icon:"+",
    cost:1500,
    type:"repair",
    description:"Repairs machines."
},

{
    id:"cooler",
    name:"Cooler",
    category:"utility",
    icon:"C",
    cost:2000,
    type:"cooler",
    description:"Prevents overheating."
},

{
    id:"warehouse",
    name:"Warehouse",
    category:"utility",
    icon:"W",
    cost:10000,
    capacity:10000,
    type:"storage",
    description:"Massive storage."
},

{
    id:"bank",
    name:"Factory Bank",
    category:"utility",
    icon:"$",
    cost:50000,
    type:"bank",
    description:"Generates passive money."
},

{
    id:"core",
    name:"Factory Core",
    category:"utility",
    icon:"◆",
    cost:1000000,
    type:"core",
    description:"Central factory control."
},


/* =========================
   SPECIAL 61-100
========================= */

{
    id:"spawner_basic",
    name:"Basic Spawner",
    category:"special",
    icon:"●",
    cost:25,
    interval:2,
    value:1,
    type:"spawner",
    description:"Spawns basic items."
},

{
    id:"spawner_fast",
    name:"Fast Spawner",
    category:"special",
    icon:"●",
    cost:100,
    interval:1,
    value:2,
    type:"spawner",
    description:"Spawns items faster."
},

{
    id:"spawner_rare",
    name:"Rare Spawner",
    category:"special",
    icon:"◆",
    cost:500,
    interval:3,
    value:10,
    type:"spawner",
    description:"Spawns valuable items."
},

{
    id:"spawner_epic",
    name:"Epic Spawner",
    category:"special",
    icon:"◆",
    cost:2500,
    interval:4,
    value:50,
    type:"spawner",
    description:"Spawns epic items."
},

{
    id:"spawner_legendary",
    name:"Legendary Spawner",
    category:"special",
    icon:"★",
    cost:10000,
    interval:5,
    value:250,
    type:"spawner",
    description:"Extremely valuable items."
},

{
    id:"multiplier_2x",
    name:"2× Multiplier",
    category:"special",
    icon:"2×",
    cost:1000,
    multiplier:2,
    type:"multiplier",
    description:"Doubles item value."
},

{
    id:"multiplier_3x",
    name:"3× Multiplier",
    category:"special",
    icon:"3×",
    cost:5000,
    multiplier:3,
    type:"multiplier",
    description:"Triples item value."
},

{
    id:"multiplier_5x",
    name:"5× Multiplier",
    category:"special",
    icon:"5×",
    cost:25000,
    multiplier:5,
    type:"multiplier",
    description:"Five times value."
},

{
    id:"multiplier_10x",
    name:"10× Multiplier",
    category:"special",
    icon:"10×",
    cost:100000,
    multiplier:10,
    type:"multiplier",
    description:"Ten times value."
},

{
    id:"multiplier_100x",
    name:"100× Multiplier",
    category:"special",
    icon:"100×",
    cost:10000000,
    multiplier:100,
    type:"multiplier",
    description:"Absolutely stupid multiplier."
},

{
    id:"splitter_basic",
    name:"Basic Splitter",
    category:"special",
    icon:"Y",
    cost:250,
    type:"splitter",
    description:"Splits production."
},

{
    id:"merger",
    name:"Merger",
    category:"special",
    icon:"X",
    cost:250,
    type:"merger",
    description:"Combines production."
},

{
    id:"portal",
    name:"Factory Portal",
    category:"special",
    icon:"O",
    cost:5000,
    type:"portal",
    description:"Links distant factory areas."
},

{
    id:"gravity",
    name:"Gravity Well",
    category:"special",
    icon:"G",
    cost:10000,
    type:"gravity",
    description:"Pulls items toward it."
},

{
    id:"blackhole",
    name:"Black Hole",
    category:"special",
    icon:"●",
    cost:100000,
    multiplier:20,
    type:"blackhole",
    description:"Consumes and massively rewards items."
},

{
    id:"clone",
    name:"Clone Machine",
    category:"special",
    icon:"C",
    cost:250000,
    multiplier:2,
    type:"clone",
    description:"Duplicates products."
},

{
    id:"duplicator",
    name:"Duplicator",
    category:"special",
    icon:"D",
    cost:500000,
    multiplier:3,
    type:"clone",
    description:"Creates multiple copies."
},

{
    id:"time_booster",
    name:"Time Booster",
    category:"special",
    icon:"T",
    cost:1000000,
    multiplier:5,
    type:"booster",
    description:"Speeds factory time."
},

{
    id:"infinity",
    name:"Infinity Core",
    category:"special",
    icon:"∞",
    cost:100000000,
    multiplier:1000,
    type:"core",
    description:"Breaks the production limit."
},

{
    id:"portal_a",
    name:"Portal A",
    category:"special",
    icon:"A",
    cost:1000,
    type:"portal",
    description:"Factory teleport endpoint."
},

{
    id:"portal_b",
    name:"Portal B",
    category:"special",
    icon:"B",
    cost:1000,
    type:"portal",
    description:"Factory teleport endpoint."
},

{
    id:"research",
    name:"Research Lab",
    category:"special",
    icon:"R",
    cost:5000,
    type:"research",
    description:"Unlocks new technology."
},

{
    id:"upgrade",
    name:"Upgrade Station",
    category:"special",
    icon:"↑",
    cost:3000,
    type:"upgrade",
    description:"Upgrades nearby machines."
},

{
    id:"luck",
    name:"Luck Machine",
    category:"special",
    icon:"?",
    cost:10000,
    multiplier:1.5,
    type:"luck",
    description:"Increases rare production."
},

{
    id:"jackpot",
    name:"Jackpot Machine",
    category:"special",
    icon:"$",
    cost:50000,
    multiplier:10,
    type:"jackpot",
    description:"Small chance for huge rewards."
},

{
    id:"event",
    name:"Event Machine",
    category:"special",
    icon:"!",
    cost:100000,
    type:"event",
    description:"Triggers random factory events."
},

{
    id:"weather",
    name:"Weather Controller",
    category:"special",
    icon:"W",
    cost:250000,
    type:"weather",
    description:"Changes factory weather."
},

{
    id:"moon",
    name:"Moon Converter",
    category:"special",
    icon:"M",
    cost:1000000,
    multiplier:25,
    type:"machine",
    description:"Converts lunar material."
},

{
    id:"sun",
    name:"Solar Converter",
    category:"special",
    icon:"S",
    cost:5000000,
    multiplier:50,
    type:"machine",
    description:"Converts solar energy."
},

{
    id:"dimension",
    name:"Dimension Portal",
    category:"special",
    icon:"D",
    cost:25000000,
    multiplier:100,
    type:"portal",
    description:"Connects another dimension."
},

{
    id:"galaxy",
    name:"Galaxy Processor",
    category:"special",
    icon:"G",
    cost:100000000,
    multiplier:250,
    type:"machine",
    description:"Processes entire galaxies."
},

{
    id:"universe",
    name:"Universe Processor",
    category:"special",
    icon:"U",
    cost:1000000000,
    multiplier:1000,
    type:"machine",
    description:"Processes entire universes."
},

{
    id:"singularity",
    name:"Singularity",
    category:"special",
    icon:"●",
    cost:10000000000,
    multiplier:5000,
    type:"blackhole",
    description:"The final machine."
},

{
    id:"reality",
    name:"Reality Engine",
    category:"special",
    icon:"R",
    cost:100000000000,
    multiplier:10000,
    type:"core",
    description:"Reality itself becomes production."
},

{
    id:"void_core",
    name:"Void Core",
    category:"special",
    icon:"Ø",
    cost:1000000000000,
    multiplier:50000,
    type:"core",
    description:"Production from nothing."
},

{
    id:"omega",
    name:"OMEGA",
    category:"special",
    icon:"Ω",
    cost:10000000000000,
    multiplier:100000,
    type:"core",
    description:"There is no machine beyond this."
},

{
    id:"hidden",
    name:"???",
    category:"special",
    icon:"?",
    cost:999999999999999,
    multiplier:999999,
    type:"secret",
    description:"You probably shouldn't have this."
},

{
    id:"developer",
    name:"Developer Machine",
    category:"special",
    icon:"DEV",
    cost:0,
    multiplier:1000000,
    type:"secret",
    description:"Definitely not supposed to be here."
}
];
