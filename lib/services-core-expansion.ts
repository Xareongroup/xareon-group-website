import type { ServicePageContent } from "@/lib/services";

export const smartHomeInstallationService: ServicePageContent = {
  path: "/services/smart-home-installation",
  name: "Smart Home Installation",
  serviceType: "Smart-home device installation and basic setup",
  title: "Smart Home Installation Services in the DMV | XAREON GROUP",
  description:
    "Installation, mounting, and basic setup for compatible video doorbells, smart locks, thermostats, cameras, and customer-provided smart-home devices across the DMV.",
  eyebrow: "Smart Home Installation",
  heroCopy:
    "Install and set up compatible customer-provided smart-home devices at appropriate existing locations without expanding the project into new wiring or network engineering.",
  overview: [
    "Smart-home projects often combine physical installation with a straightforward device setup. XAREON GROUP installs compatible video doorbells, smart locks, thermostats, cameras, and similar customer-provided devices after reviewing the product, intended location, existing conditions, and supplied instructions.",
    "The agreed scope may include mounting, replacement at an appropriate existing location, and basic pairing with a customer-controlled phone or account. Customers in Montgomery County and across the DMV retain control of passwords and subscription decisions, and projects requiring new circuits, concealed wiring, or advanced network work must be handled by an appropriately qualified provider.",
  ],
  commonProjects: [
    { title: "Video doorbells", description: "Installing compatible customer-provided video doorbells at appropriate existing locations and supporting basic device pairing." },
    { title: "Smart locks", description: "Replacing compatible door hardware with a customer-provided smart lock when the door and existing preparation are suitable." },
    { title: "Smart thermostats", description: "Installing a compatible thermostat at an appropriate existing location after product and system compatibility are reviewed." },
    { title: "Indoor and outdoor cameras", description: "Mounting compatible customer-provided cameras in reviewed locations with accessible power or supported battery operation." },
    { title: "Device mounting and placement", description: "Positioning compatible sensors, hubs, displays, and related devices using suitable customer-provided hardware." },
    { title: "Basic setup and pairing", description: "Supporting ordinary device startup and pairing while the customer enters and retains control of account credentials." },
  ],
  processNote:
    "Share the device model, supplied instructions, proposed location, existing device or wiring conditions, and nearby power or network details without sending passwords.",
  faqs: [
    { question: "What smart-home devices can you install?", answer: "Projects may include compatible video doorbells, smart locks, thermostats, cameras, sensors, hubs, and similar customer-provided devices. Product and location details must be reviewed before the scope is confirmed." },
    { question: "Can you pair the device with my phone or account?", answer: "Basic pairing may be included. You should enter passwords and other private account information yourself; XAREON GROUP does not need to collect or retain customer passwords." },
    { question: "Does this service include new wiring or electrical circuits?", answer: "No. This page covers compatible devices at appropriate existing locations. New circuits, concealed wiring, service changes, or other licensed electrical work require an appropriately qualified trade professional." },
    { question: "Do you configure subscriptions or provide network engineering?", answer: "No. Subscription choices remain between the customer and device provider. Basic connection steps may be reviewed, but advanced Wi-Fi design, network troubleshooting, and managed account services are outside this scope." },
    { question: "What should I include with my estimate request?", answer: "Include the device brand and model, photos of the intended location and any existing device, relevant compatibility information, and a description of the setup you want completed." },
  ],
  relatedServices: [
    { name: "Fixture Installation", href: "/services/fixture-installation", description: "Install compatible household fixtures, accessories, shelving, and mirrors." },
    { name: "General Home Repairs", href: "/services/general-home-repairs", description: "Combine smart-device installation with a mixed list of practical household tasks." },
  ],
};

export const minorPlumbingRepairsService: ServicePageContent = {
  path: "/services/minor-plumbing-repairs",
  name: "Minor Plumbing Repairs",
  serviceType: "Minor accessible plumbing fixture repair and replacement",
  title: "Minor Plumbing Repair Services in the DMV | XAREON GROUP",
  description:
    "Narrowly scoped faucet, tub-spout, fixture-hardware, and other accessible minor plumbing repair or replacement work for suitable existing locations across the DMV.",
  eyebrow: "Minor Plumbing Repairs",
  heroCopy:
    "Address clearly defined, accessible fixture-level plumbing tasks while keeping repiping, sewer, gas, concealed-line, and major drain work outside the service scope.",
  overview: [
    "Some plumbing-related requests involve a compatible fixture or visible piece of hardware rather than a larger plumbing system. XAREON GROUP reviews narrowly scoped work such as compatible faucet or tub-spout replacement and minor accessible fixture-level hardware issues where existing conditions support the proposed task.",
    "This is not full plumbing contracting. Before scheduling work in Montgomery County or elsewhere in the DMV, the existing fixture, accessible connections, replacement product, and visible condition must be reviewed. Repiping, sewer or gas work, concealed supply reconstruction, water mains, major drains, and permit-dependent plumbing require an appropriately licensed plumber.",
  ],
  commonProjects: [
    { title: "Compatible faucet replacement", description: "Replacing a suitable customer-provided faucet at an accessible existing sink location after compatibility is reviewed." },
    { title: "Tub-spout replacement", description: "Replacing a compatible tub spout where the existing accessible connection and surrounding condition support a minor fixture-level project." },
    { title: "Accessible fixture hardware", description: "Replacing compatible handles, aerators, trim pieces, or similar visible fixture hardware when the underlying system is suitable." },
    { title: "Visible fixture-level issues", description: "Reviewing minor, accessible issues associated with a faucet or fixture to determine whether a compatible replacement is appropriate." },
    { title: "Minor leak-related replacement", description: "Replacing a compatible visible fixture or accessible component when that limited scope is appropriate and no concealed repair is required." },
    { title: "Grouped minor fixture tasks", description: "Reviewing several clearly identified, accessible fixture-level items together without expanding into major plumbing work." },
  ],
  processNote:
    "Send photos of the fixture, visible connections, surrounding area, and replacement product information; stop active water damage and arrange emergency help before requesting routine service.",
  faqs: [
    { question: "What counts as a minor plumbing repair?", answer: "This page covers narrowly defined, accessible fixture-level work such as compatible faucet, tub-spout, or visible hardware replacement. The existing condition must be reviewed before the work is accepted." },
    { question: "Can you replace a faucet I already purchased?", answer: "A customer-provided faucet may be suitable when it is compatible with the existing sink, openings, accessible connections, and planned use. Share product details and photos before scheduling." },
    { question: "Do you repair concealed leaks or replace supply lines inside walls?", answer: "No. Concealed leaks, reconstruction inside walls, repiping, water-main work, and similar system-level plumbing require an appropriately licensed plumber." },
    { question: "Do you handle sewer, gas, or major drain work?", answer: "No. Sewer work, gas lines, major drain work, and other specialized or permit-dependent plumbing are outside this minor fixture-level scope." },
    { question: "When should I contact a licensed plumber instead?", answer: "Contact a licensed plumber when the issue involves concealed piping, recurring drainage problems, gas, a water main, extensive leakage, code or permit work, or anything beyond a clearly accessible fixture-level task." },
  ],
  relatedServices: [
    { name: "General Home Repairs", href: "/services/general-home-repairs", description: "Combine an appropriate minor fixture task with other clearly documented home repairs." },
    { name: "Fixture Installation", href: "/services/fixture-installation", description: "Plan compatible mirrors, shelving, bathroom accessories, and household fixtures." },
  ],
};

export const minorElectricalRepairsService: ServicePageContent = {
  path: "/services/minor-electrical-repairs",
  name: "Minor Electrical Repairs",
  serviceType: "Minor existing-location electrical fixture and device repair",
  title: "Minor Electrical Repair Services in the DMV | XAREON GROUP",
  description:
    "Narrowly scoped review and correction of compatible existing-location light-fixture, device-hardware, and other accessible minor electrical issues across the DMV.",
  eyebrow: "Minor Electrical Repairs",
  heroCopy:
    "Review clearly defined, accessible fixture- or device-level electrical issues at existing locations without implying panel, circuit, rewiring, or unrestricted electrical work.",
  overview: [
    "Minor electrical repair requests begin with an existing fixture or device-level issue, not a plan for a new electrical system. XAREON GROUP can review suitable concerns involving compatible light fixtures, visible mounting hardware, exterior covers, or smart-home devices at existing locations where no new circuit or concealed wiring modification is required.",
    "Fixture Installation remains the service for planned installation or replacement of a compatible fixture or accessory. This page addresses a reported existing-location issue that may have a narrow, accessible correction. If review indicates panel, breaker, circuit, concealed-wiring, service-upgrade, permit, or specialized electrical work, the project must be referred to an appropriately licensed electrician.",
  ],
  commonProjects: [
    { title: "Existing light-fixture issues", description: "Reviewing a suitable accessible fixture-level concern to determine whether visible hardware correction or compatible replacement is appropriate." },
    { title: "Loose fixture hardware", description: "Correcting compatible accessible mounting brackets, canopies, or exterior fixture hardware when the electrical system itself does not require modification." },
    { title: "Compatible fixture replacement", description: "Replacing a suitable fixture at an existing location when a narrow replacement resolves the reviewed issue without new wiring or circuitry." },
    { title: "Faceplates and exterior covers", description: "Replacing compatible damaged or missing exterior plates and covers that do not require concealed-wiring changes." },
    { title: "Existing-location smart devices", description: "Installing a compatible smart-home device at an appropriate existing powered location when electrical modification is unnecessary." },
    { title: "Grouped minor electrical items", description: "Reviewing several documented fixture- or device-level concerns while excluding panel, circuit, and concealed-wiring work." },
  ],
  processNote:
    "Provide photos, the existing fixture or device details, replacement-product information, and a description of the issue; do not touch exposed or unsafe electrical components.",
  faqs: [
    { question: "How is this different from Fixture Installation?", answer: "Fixture Installation is for a planned compatible fixture or accessory installation. Minor Electrical Repairs begins with an existing fixture- or device-level issue and is limited to an appropriate accessible correction or existing-location replacement." },
    { question: "Do you install new circuits or concealed wiring?", answer: "No. New circuits, new wiring, concealed-wiring reconstruction, service changes, and similar electrical-system work are outside this scope." },
    { question: "Do you work on electrical panels or breakers?", answer: "No. Panel work, breaker replacement, service upgrades, and high-voltage specialty work require an appropriately licensed electrician." },
    { question: "Can a nonworking light fixture be reviewed?", answer: "A compatible existing fixture may be reviewed to determine whether the issue fits a narrow visible fixture-level correction or replacement. Circuit or concealed-wiring problems must be handled by a licensed electrician." },
    { question: "What information should I send with my request?", answer: "Send photos of the fixture or device and surrounding area, describe what is happening, and include replacement-product details if you already have a compatible item." },
  ],
  relatedServices: [
    { name: "Fixture Installation", href: "/services/fixture-installation", description: "Plan compatible replacement fixtures and household accessory installations." },
    { name: "Smart Home Installation", href: "/services/smart-home-installation", description: "Install and complete basic setup for compatible customer-provided smart devices." },
  ],
};

export const kitchenInstallationService: ServicePageContent = {
  path: "/services/kitchen-installation",
  name: "Kitchen Installation",
  serviceType: "Kitchen component installation and finish improvements",
  title: "Kitchen Installation Services in the DMV | XAREON GROUP",
  description:
    "Narrowly scoped kitchen cabinet, shelving, hardware, trim, wall repair, painting, and compatible component installation for practical DMV improvement projects.",
  eyebrow: "Kitchen Installation",
  heroCopy:
    "Complete clearly defined kitchen component and finish work without presenting the service as unrestricted renovation, structural, plumbing, electrical, or gas contracting.",
  overview: [
    "Kitchen installation work can focus on selected components and finishes rather than a full renovation. XAREON GROUP reviews compatible customer-provided cabinets or storage components, shelving, hardware, trim, wall patching, painting, and accessory installation as clearly documented projects.",
    "The existing room, product specifications, wall conditions, layout, and required specialty-trade connections must be understood before work is scheduled in Montgomery County or elsewhere in the DMV. Structural changes, countertops outside the agreed supported scope, major appliance connections, and plumbing, electrical, gas, or permit work may require separately qualified professionals.",
  ],
  commonProjects: [
    { title: "Compatible cabinets and storage", description: "Installing or replacing suitable customer-provided cabinet or storage components after dimensions, support, and existing conditions are reviewed." },
    { title: "Shelving and organization", description: "Installing compatible kitchen shelves and organization components using appropriate mounting locations and supplied hardware." },
    { title: "Handles, pulls, and hardware", description: "Installing compatible customer-provided cabinet handles, pulls, hinges, and related visible hardware within the agreed scope." },
    { title: "Trim and finish details", description: "Completing appropriate non-structural trim, caulking, and finish transitions associated with the reviewed installation." },
    { title: "Wall repair and painting", description: "Patching localized drywall damage and completing agreed interior painting where component work affects surrounding finishes." },
    { title: "Small kitchenette projects", description: "Reviewing narrowly defined component and finish work for a small kitchenette without including unsupported trade or structural scope." },
  ],
  processNote:
    "Share room photos, measurements, product specifications, a complete component list, and any known plumbing, electrical, gas, countertop, or appliance dependencies.",
  faqs: [
    { question: "Is this a full kitchen remodeling service?", answer: "No. This page describes narrowly scoped component installation and finish improvements. The accepted estimate will identify the exact cabinets, shelving, hardware, trim, wall repair, painting, or accessory work included." },
    { question: "Can you install customer-provided cabinets?", answer: "Compatible cabinet or storage components may be considered after product dimensions, wall support, layout, and existing conditions are reviewed. Structural or specialty-trade dependencies are not assumed." },
    { question: "Can wall repair and painting be included?", answer: "Yes. Localized drywall repair and interior painting may be included when they are part of the documented kitchen installation and finish scope." },
    { question: "Does this include plumbing, electrical, gas, or appliance connections?", answer: "Those services are not automatically included. Work involving specialty-trade connections, new circuits, gas, major plumbing, or permit requirements must be handled by appropriately qualified professionals." },
    { question: "What details help with a kitchen installation estimate?", answer: "Provide photos, measurements, product links or specifications, the number and location of components, and details about any existing surfaces or connected systems that may affect the work." },
  ],
  relatedServices: [
    { name: "General Home Repairs", href: "/services/general-home-repairs", description: "Plan a mixed list of smaller kitchen and household repair tasks." },
    { name: "Interior Painting", href: "/services/interior-painting", description: "Prepare and paint appropriate kitchen walls and surrounding interior surfaces." },
  ],
};

export const bathroomImprovementsService: ServicePageContent = {
  path: "/services/bathroom-improvements",
  name: "Bathroom Improvements",
  serviceType: "Cosmetic bathroom improvements and finish repairs",
  title: "Bathroom Improvement Services in the DMV | XAREON GROUP",
  description:
    "Practical bathroom drywall repair, painting, trim, caulking, mirrors, shelving, accessories, and compatible cosmetic fixture improvements across the DMV.",
  eyebrow: "Bathroom Improvements",
  heroCopy:
    "Refresh practical bathroom finishes and accessories with a defined cosmetic scope that avoids unsupported structural, waterproofing, plumbing, and electrical claims.",
  overview: [
    "A bathroom can benefit from targeted repairs and finish updates without becoming a full remodeling project. XAREON GROUP reviews practical work such as localized drywall repair, interior painting, trim, caulking, mirrors, shelving, bathroom accessories, and compatible cosmetic fixture or hardware replacement.",
    "Each project is scoped around visible, accessible conditions and appropriate customer-provided products. For homes and businesses across Montgomery County and the broader DMV region, major plumbing renovation, shower-pan or waterproofing-system replacement, structural work, major electrical changes, and permit-dependent work remain outside this service unless handled by separately qualified professionals.",
  ],
  commonProjects: [
    { title: "Localized drywall repair", description: "Repairing suitable holes, dents, access openings, or limited damaged drywall after any active moisture source has been corrected." },
    { title: "Bathroom painting", description: "Preparing and painting appropriate walls, ceilings, trim, or other agreed interior surfaces as part of a cosmetic refresh." },
    { title: "Trim and caulking", description: "Completing appropriate visible trim repairs, finish transitions, and non-structural cosmetic caulking within the agreed scope." },
    { title: "Mirrors and shelving", description: "Installing compatible customer-provided mirrors, shelves, and organization components at reviewed mounting locations." },
    { title: "Bathroom accessories", description: "Installing compatible towel bars, robe hooks, toilet-paper holders, and similar customer-provided accessories." },
    { title: "Cosmetic fixture improvements", description: "Replacing suitable visible fixture trim or accessory components when no major plumbing or electrical modification is required." },
  ],
  processNote:
    "Send photos of the entire bathroom and each requested repair or component, along with product details and information about any prior moisture, plumbing, or electrical issue.",
  faqs: [
    { question: "Is Bathroom Improvements a full remodeling service?", answer: "No. This page covers a defined cosmetic and finish scope such as drywall repair, painting, trim, caulking, mirrors, shelving, accessories, and appropriate fixture-level improvements." },
    { question: "Can you repair bathroom drywall and repaint it?", answer: "Suitable localized drywall repair and interior painting may be combined after the cause of any active leak or ongoing moisture damage has been corrected." },
    { question: "Can you install mirrors, shelves, and bathroom accessories?", answer: "Yes, compatible customer-provided mirrors, shelves, towel bars, hooks, holders, and similar accessories may be installed after mounting locations and wall conditions are reviewed." },
    { question: "Does this service include shower pans or major waterproofing?", answer: "No. Shower-pan replacement, major waterproofing systems, structural repairs, and concealed moisture reconstruction are outside this cosmetic improvement scope." },
    { question: "When are specialty trades required?", answer: "Major plumbing, new or modified electrical work, structural changes, waterproofing systems, and permit-dependent work require appropriately qualified professionals outside this defined service." },
  ],
  relatedServices: [
    { name: "Interior Painting", href: "/services/interior-painting", description: "Prepare and paint appropriate bathroom walls, ceilings, and trim." },
    { name: "Drywall Repair", href: "/services/drywall-repair", description: "Repair suitable localized wall or ceiling damage after the source is resolved." },
  ],
};

export const coreExpansionServices = [
  smartHomeInstallationService,
  minorPlumbingRepairsService,
  minorElectricalRepairsService,
  kitchenInstallationService,
  bathroomImprovementsService,
] as const;
