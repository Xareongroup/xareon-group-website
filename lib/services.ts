export interface ServiceProject {
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface RelatedService {
  name: string;
  href: string;
  description: string;
}

export interface ServicePageContent {
  path: string;
  name: string;
  serviceType: string;
  title: string;
  description: string;
  eyebrow: string;
  heroCopy: string;
  overview: string[];
  commonProjects: ServiceProject[];
  processNote: string;
  faqs: ServiceFaq[];
  relatedServices: RelatedService[];
}

export const drywallRepairService: ServicePageContent = {
  path: "/services/drywall-repair",
  name: "Drywall Repair",
  serviceType: "Drywall repair and finishing",
  title: "Drywall Repair Services in the DMV | XAREON GROUP",
  description:
    "Drywall patching, wall repair, ceiling drywall repair, finishing, and paint preparation for homes and businesses across Maryland, Washington, DC, and Northern Virginia.",
  eyebrow: "Drywall Repair",
  heroCopy:
    "Repair holes, cracks, dents, and damaged wall or ceiling sections with careful patching, surface preparation, and finishing.",
  overview: [
    "Damaged drywall can make an otherwise well-maintained room feel unfinished. XAREON GROUP handles practical drywall repairs for homeowners, property managers, and businesses with localized wall or ceiling damage.",
    "The work can include removing loose material, fitting a stable patch, applying joint compound, sanding, and preparing the repaired surface for paint. We focus on the damaged area and explain what the repair requires before work is scheduled.",
  ],
  commonProjects: [
    {
      title: "Holes and dents",
      description:
        "Patching damage from impacts, removed fixtures, anchors, door hardware, or everyday wear.",
    },
    {
      title: "Cracks and damaged seams",
      description:
        "Repairing appropriate non-structural cracks, loose tape, and localized joint damage before refinishing.",
    },
    {
      title: "Small ceiling repairs",
      description:
        "Repairing limited ceiling drywall damage after the source of the damage has been addressed.",
    },
    {
      title: "Access-opening patches",
      description:
        "Closing drywall openings left after completed plumbing, electrical, or other access work.",
    },
    {
      title: "Damaged sections",
      description:
        "Replacing and finishing localized drywall sections that are too damaged for a simple fill repair.",
    },
    {
      title: "Preparation for paint",
      description:
        "Sanding and smoothing repaired areas so the wall or ceiling is ready for an appropriate finish coat.",
    },
  ],
  processNote:
    "Photos are especially helpful for showing the size, location, and surface condition of drywall damage.",
  faqs: [
    {
      question: "What kinds of drywall damage can you repair?",
      answer:
        "We handle many localized repairs, including holes, dents, cracks, loose tape, damaged sections, small ceiling areas, and openings left after completed access work. We will review the damage before confirming the scope.",
    },
    {
      question: "Can you repair drywall on a ceiling?",
      answer:
        "Yes, limited ceiling drywall repairs may be appropriate. The source of any leak or ongoing damage should be corrected first so the new repair is not immediately compromised.",
    },
    {
      question: "Will the repaired area be ready for paint?",
      answer:
        "Drywall repair can include compound, sanding, and surface preparation. Paint requirements depend on the surrounding finish and the scope included in your estimate.",
    },
    {
      question: "Can you patch openings after plumbing or electrical work?",
      answer:
        "Yes, once the underlying trade work is complete and the opening is ready to close, we can evaluate patching and finishing the drywall access area.",
    },
    {
      question: "Should I send photos with my estimate request?",
      answer:
        "Yes. Wide photos of the room and closer photos of the damage help us understand the location, approximate size, and surface condition before following up.",
    },
  ],
  relatedServices: [
    {
      name: "Interior Painting",
      href: "/services/interior-painting",
      description: "Finish refreshed walls and rooms with careful interior painting.",
    },
    {
      name: "Partition Wall Installation",
      href: "/services/partition-walls",
      description: "Plan non-load-bearing framing, new drywall, and finished room divisions.",
    },
  ],
};

export const interiorPaintingService: ServicePageContent = {
  path: "/services/interior-painting",
  name: "Interior Painting",
  serviceType: "Interior painting",
  title: "Interior Painting Services in the DMV | XAREON GROUP",
  description:
    "Interior wall and room painting with surface preparation, minor patching, and careful finishing across Maryland, Washington, DC, and Northern Virginia.",
  eyebrow: "Interior Painting",
  heroCopy:
    "Refresh rooms and interior surfaces with thoughtful preparation, protection of surrounding areas, and a clean, consistent finish.",
  overview: [
    "Interior painting can update a single room, bring consistency to connected spaces, or provide the finishing step after repairs. XAREON GROUP works with homeowners and businesses on practical interior painting projects of varying sizes.",
    "A good result begins before the finish coat. The planned scope may include protecting nearby surfaces, addressing minor imperfections, sanding appropriate areas, and preparing walls for an even application.",
  ],
  commonProjects: [
    {
      title: "Bedrooms and living rooms",
      description:
        "Refreshing frequently used rooms with coordinated wall colors and clean edges.",
    },
    {
      title: "Hallways and stairways",
      description:
        "Repainting high-traffic interior spaces that collect marks, scuffs, and everyday wear.",
    },
    {
      title: "Kitchens and bathrooms",
      description:
        "Updating suitable interior wall and ceiling surfaces while working carefully around fixtures and finishes.",
    },
    {
      title: "Closets and smaller spaces",
      description:
        "Completing compact areas where preparation and access still require attention to detail.",
    },
    {
      title: "Minor patching and preparation",
      description:
        "Addressing small holes and surface imperfections included in the painting scope before finish coats.",
    },
    {
      title: "Painting after drywall repair",
      description:
        "Blending repaired areas into the surrounding room when painting is included in the agreed project scope.",
    },
  ],
  processNote:
    "Share the rooms, surfaces, current condition, and any color decisions already made when requesting an estimate.",
  faqs: [
    {
      question: "What interior spaces can you paint?",
      answer:
        "Projects may include bedrooms, living rooms, hallways, stairways, kitchens, bathrooms, closets, and other appropriate interior spaces. We confirm the exact rooms and surfaces in the estimate.",
    },
    {
      question: "Does interior painting include wall preparation?",
      answer:
        "Preparation depends on existing conditions and the agreed scope. It may include protecting surrounding surfaces, sanding appropriate areas, and addressing minor holes or imperfections before painting.",
    },
    {
      question: "Can drywall repairs be completed before painting?",
      answer:
        "Yes. We can evaluate drywall patching and preparation as part of the project so the repaired surface is ready for the planned paint finish.",
    },
    {
      question: "Do you provide exterior painting?",
      answer:
        "This page describes interior painting. If your project includes exterior surfaces, tell us in the estimate request so we can determine whether it fits the services currently available.",
    },
    {
      question: "What details should I include with my request?",
      answer:
        "Include the rooms or areas involved, approximate surface condition, any known repairs, and photos when available. These details help us prepare for the estimate conversation.",
    },
  ],
  relatedServices: [
    {
      name: "Drywall Repair",
      href: "/services/drywall-repair",
      description: "Repair holes, cracks, and damaged sections before finishing walls.",
    },
    {
      name: "Partition Wall Installation",
      href: "/services/partition-walls",
      description: "Create and finish an appropriate non-load-bearing interior division.",
    },
  ],
};

export const generalHomeRepairsService: ServicePageContent = {
  path: "/services/general-home-repairs",
  name: "General Home Repairs",
  serviceType: "General home repair",
  title: "General Home Repair Services in the DMV | XAREON GROUP",
  description:
    "General home repair and installation help for drywall, doors, trim, shelving, mounting, assembly, fixtures, and smaller projects across the DMV region.",
  eyebrow: "General Home Repairs",
  heroCopy:
    "Take care of the smaller repairs, installations, and finishing tasks that keep a home or business working well and looking complete.",
  overview: [
    "Not every project fits one specialty. XAREON GROUP helps homeowners and businesses address individual repairs or combine several smaller tasks into a clearly defined project.",
    "Tell us what needs attention, where it is located, and whether you have photos or product details. We will review the requested work and clarify which items can be included before scheduling.",
  ],
  commonProjects: [
    {
      title: "Minor drywall and paint touch-ups",
      description:
        "Addressing localized wall damage, small patches, and appropriate finishing work.",
    },
    {
      title: "Doors, windows, trim, and caulking",
      description:
        "Handling practical adjustments, repairs, and finish details around common interior features.",
    },
    {
      title: "Shelving and curtain rods",
      description:
        "Installing common wall-mounted household items with attention to placement and secure attachment.",
    },
    {
      title: "Furniture assembly",
      description:
        "Assembling household, office, fitness, and similar ready-to-assemble items according to supplied instructions.",
    },
    {
      title: "TV and fixture installation",
      description:
        "Mounting TVs and installing appropriate non-specialty fixtures or accessories within the agreed scope.",
    },
    {
      title: "Smart-home devices",
      description:
        "Installing supported doorbells, locks, cameras, thermostats, and related household devices where appropriate.",
    },
  ],
  processNote:
    "For a multi-item list, include a photo and short description of each task so the full scope can be reviewed together.",
  faqs: [
    {
      question: "Can I request several small repairs at once?",
      answer:
        "Yes. A grouped list is helpful when you have several smaller tasks. Include a short description and photo of each item so we can review the overall scope.",
    },
    {
      question: "What if I am not sure which service fits my project?",
      answer:
        "Choose General Home Repairs on the estimate form and describe what needs attention. We can review the details and determine whether the requested work fits our current services.",
    },
    {
      question: "Do you handle plumbing or electrical work?",
      answer:
        "We only describe limited minor repairs and fixture-related tasks. Send the exact details so we can determine whether the work is appropriate or requires a separately qualified trade professional.",
    },
    {
      question: "Can you install items I already purchased?",
      answer:
        "Many assembly, mounting, shelving, curtain-rod, fixture, and smart-device projects begin with customer-supplied products. Include product information and photos when requesting an estimate.",
    },
    {
      question: "Do you work with businesses as well as homeowners?",
      answer:
        "Yes. The current website supports both residential and commercial estimate requests. Describe the property type and requested repairs in the form.",
    },
  ],
  relatedServices: [
    {
      name: "Door Installation & Repair",
      href: "/services/door-installation-repair",
      description: "Address interior door alignment, replacement, and compatible hardware.",
    },
    {
      name: "Furniture Assembly",
      href: "/services/furniture-assembly",
      description: "Plan a focused furniture assembly project for one item or several pieces.",
    },
  ],
};

export const furnitureAssemblyService: ServicePageContent = {
  path: "/services/furniture-assembly",
  name: "Furniture Assembly",
  serviceType: "Furniture and equipment assembly",
  title: "Furniture Assembly Services in the DMV | XAREON GROUP",
  description:
    "Furniture assembly for beds, dressers, desks, tables, chairs, shelving, storage furniture, office furniture, and compatible fitness equipment across the DMV.",
  eyebrow: "Furniture Assembly",
  heroCopy:
    "Turn packaged furniture and compatible equipment into properly assembled, ready-to-use pieces by following the supplied instructions and reviewing each item before work begins.",
  overview: [
    "Furniture assembly can involve one essential piece or several items for a room, home, or workplace. XAREON GROUP assembles common ready-to-assemble furniture for homeowners and businesses, including beds, dressers, desks, tables, chairs, bookshelves, shelving units, cabinets, and storage furniture.",
    "The project scope is based on the supplied product, manufacturer instructions, available parts, assembly area, and requested placement. Customers across Montgomery County and the broader DMV region can share product details and photos so each item can be reviewed before scheduling.",
  ],
  commonProjects: [
    {
      title: "Beds and bedroom furniture",
      description:
        "Assembling compatible bed frames, dressers, nightstands, and related ready-to-assemble bedroom pieces.",
    },
    {
      title: "Desks, tables, and chairs",
      description:
        "Putting together common home and office desks, dining or utility tables, and compatible seating according to supplied instructions.",
    },
    {
      title: "Bookshelves and shelving units",
      description:
        "Assembling freestanding bookshelves, storage shelves, and similar furniture while reviewing any placement or anchoring instructions supplied with the product.",
    },
    {
      title: "Cabinets and storage furniture",
      description:
        "Assembling compatible freestanding cabinets, organizers, and storage pieces for living, work, or utility spaces.",
    },
    {
      title: "Office and fitness equipment",
      description:
        "Assembling compatible office furniture and customer-provided fitness equipment when the product, instructions, parts, and work area are suitable.",
    },
    {
      title: "Multi-item assembly projects",
      description:
        "Reviewing several furniture items together for a move-in, room setup, home office, or other clearly documented project.",
    },
  ],
  processNote:
    "Include the product name or model, assembly instructions when available, the number of boxes or items, and photos of the planned assembly area.",
  faqs: [
    {
      question: "What types of furniture can you assemble?",
      answer:
        "Projects may include compatible beds, dressers, desks, tables, chairs, bookshelves, shelving units, cabinets, storage furniture, and office furniture. Share the product details so the exact item and scope can be reviewed.",
    },
    {
      question: "Can I request assembly for several furniture items at once?",
      answer:
        "Yes. Multi-item projects can be reviewed together. Provide a list of every item, the quantity of each, product links or model information, and photos of the boxes and assembly area when available.",
    },
    {
      question: "Do you assemble fitness equipment?",
      answer:
        "Compatible customer-provided fitness equipment may be considered when complete instructions and parts are available and the planned location is suitable. Product details are needed before the scope can be confirmed.",
    },
    {
      question: "What should I do before the assembly appointment?",
      answer:
        "Keep the boxes, hardware, and instructions together, confirm that the assembly area is accessible, and identify the intended location for each finished item. Let us know about stairs or other access considerations in advance.",
    },
    {
      question: "Can furniture assembly be combined with other home repairs?",
      answer:
        "Yes. Use General Home Repairs when furniture assembly is one part of a mixed task list. Use this Furniture Assembly service when assembly is the main focus of the project.",
    },
  ],
  relatedServices: [
    {
      name: "General Home Repairs",
      href: "/services/general-home-repairs",
      description: "Combine assembly with a clearly documented list of other household tasks.",
    },
    {
      name: "Fixture Installation",
      href: "/services/fixture-installation",
      description: "Plan compatible wall-mounted shelving, mirrors, and household accessories.",
    },
  ],
};

export const featuredServices = [
  drywallRepairService,
  interiorPaintingService,
  generalHomeRepairsService,
  furnitureAssemblyService,
] as const;
