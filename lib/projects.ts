export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  stage: "Before" | "Progress" | "Completed";
  caption: string;
}

export interface ProjectPhase {
  title: string;
  description: string;
}

export interface ProjectLink {
  name: string;
  href: string;
}

export interface ProjectContent {
  slug: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  location: string;
  goal: string;
  summary: string;
  heroImage: ProjectImage;
  images: ProjectImage[];
  phases: ProjectPhase[];
  completedScope: string[];
  relatedServices: ProjectLink[];
}

const imageRoot = "/images/projects/whole-home-restoration-renovation";

const images: ProjectImage[] = [
  { src: `${imageRoot}/kitchen-before-overview.webp`, alt: "Kitchen before demolition and renovation", width: 1320, height: 736, stage: "Before", caption: "Kitchen before the coordinated renovation work." },
  { src: `${imageRoot}/kitchen-before-secondary.webp`, alt: "Second view of the kitchen before renovation", width: 1320, height: 736, stage: "Before", caption: "A second view documenting the original kitchen." },
  { src: `${imageRoot}/kitchen-demolition-progress.webp`, alt: "Kitchen during demolition and preparation", width: 1320, height: 735, stage: "Progress", caption: "Demolition and preparation in progress." },
  { src: `${imageRoot}/kitchen-renovation-complete.webp`, alt: "Completed kitchen renovation with updated cabinets, counters, and flooring", width: 1600, height: 1200, stage: "Completed", caption: "The completed kitchen and adjoining interior." },
  { src: `${imageRoot}/kitchen-renovation-secondary.webp`, alt: "Completed kitchen viewed from the adjoining living area", width: 1600, height: 1200, stage: "Completed", caption: "A second completed view showing the kitchen within the renewed interior." },
  { src: `${imageRoot}/staircase-before.webp`, alt: "Interior staircase before repair and staining", width: 1101, height: 1600, stage: "Before", caption: "The staircase before repair and staining." },
  { src: `${imageRoot}/staircase-hallway-before.webp`, alt: "Staircase and hallway before finishing work", width: 917, height: 1600, stage: "Before", caption: "The staircase and connected hallway before finishing." },
  { src: `${imageRoot}/staircase-after.webp`, alt: "Completed staircase with repaired and stained wood treads", width: 1600, height: 1200, stage: "Completed", caption: "Repaired and stained stair treads with refreshed surrounding finishes." },
  { src: `${imageRoot}/staircase-hallway-after.webp`, alt: "Completed hallway and staircase after painting and flooring work", width: 1600, height: 1200, stage: "Completed", caption: "The completed hallway, flooring, paint, and staircase finishes." },
  { src: `${imageRoot}/flooring-room-before.webp`, alt: "Interior room during preparation before new flooring", width: 910, height: 1600, stage: "Before", caption: "An interior room during preparation for the renewed finishes." },
  { src: `${imageRoot}/lvp-flooring-room-after.webp`, alt: "Completed room with luxury vinyl plank flooring and painted walls", width: 1600, height: 1200, stage: "Completed", caption: "Luxury vinyl plank flooring and completed interior paint finishes." },
  { src: `${imageRoot}/entertainment-wall-complete.webp`, alt: "Completed entertainment wall with mounted television", width: 1600, height: 1200, stage: "Completed", caption: "The completed entertainment wall and television installation." },
  { src: `${imageRoot}/bathroom-upgrades-complete.webp`, alt: "Completed bathroom with updated vanity, fixtures, and finishes", width: 1600, height: 1200, stage: "Completed", caption: "A completed bathroom after the documented upgrades." },
];

export const wholeHomeRestorationProject: ProjectContent = {
  slug: "whole-home-restoration-renovation",
  path: "/projects/whole-home-restoration-renovation",
  title: "Whole-Home Restoration & Renovation Project | XAREON GROUP",
  h1: "Whole-Home Restoration and Renovation",
  description: "Explore a Montgomery County project where XAREON GROUP coordinated kitchen and bathroom upgrades, repairs, flooring, painting, doors, partitions, mounting, and finish work to renew the home’s interior.",
  location: "Montgomery County, Maryland",
  goal: "Repair extensive interior damage and renew the home’s interior.",
  summary: "XAREON GROUP coordinated and completed a connected scope of demolition, repairs, installations, room upgrades, and finish work so the home could be renewed as one cohesive interior.",
  heroImage: images[3],
  images,
  phases: [
    { title: "Demolition and preparation", description: "The kitchen work began with demolition and preparation, while repair needs and finish dependencies were considered across the interior." },
    { title: "Repairs and room improvements", description: "The coordinated scope included kitchen renovation, bathroom upgrades, wall and ceiling repairs, basement partition construction, and new interior doors." },
    { title: "Connected interior finishes", description: "Carpet was replaced with luxury vinyl plank flooring, the interior was painted throughout, and the stairs were repaired and stained alongside decorative finish work." },
    { title: "Installation details", description: "The completed scope also included television mounting, an entertainment-wall installation, and interior sunshade installation." },
  ],
  completedScope: [
    "Kitchen demolition, preparation, renovation, and finish work",
    "Bathroom upgrades",
    "Wall and ceiling repairs",
    "Carpet replacement with luxury vinyl plank flooring",
    "Whole-home interior painting",
    "Stair repair and staining",
    "Decorative finish work",
    "New interior-door installation",
    "Basement partition construction",
    "TV mounting and entertainment-wall installation",
    "Interior sunshade installation",
  ],
  relatedServices: [
    { name: "Kitchen Installation", href: "/services/kitchen-installation" },
    { name: "Bathroom Improvements", href: "/services/bathroom-improvements" },
    { name: "Drywall Repair", href: "/services/drywall-repair" },
    { name: "Interior Painting", href: "/services/interior-painting" },
    { name: "Door Installation & Repair", href: "/services/door-installation-repair" },
    { name: "Partition Walls", href: "/services/partition-walls" },
    { name: "TV Mounting", href: "/services/tv-mounting" },
    { name: "General Home Repairs", href: "/services/general-home-repairs" },
  ],
};

export const projects = [wholeHomeRestorationProject] as const;

export const projectRelatedServicePaths = new Set(
  wholeHomeRestorationProject.relatedServices.map(({ href }) => href),
);
