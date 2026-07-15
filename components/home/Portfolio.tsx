import Image from "next/image";

const projects = [
  {
    title: "TV Mounting",
    image: "/images/portfolio/tv.jpg",
  },
  {
    title: "Kitchen Installation",
    image: "/images/portfolio/kitchen.jpg",
  },
  {
    title: "Bathroom Remodeling",
    image: "/images/portfolio/bathroom.jpg",
  },
  {
    title: "Door Installation",
    image: "/images/portfolio/door.jpg",
  },
  {
    title: "Smart Home Setup",
    image: "/images/portfolio/smart-home.jpg",
  },
  {
    title: "Painting Project",
    image: "/images/portfolio/painting.jpg",
  },
];

export default function Portfolio() {
  return (
    <section
      id="portfolio"
      className="bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 md:text-sm">
            Recent Projects
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            Our Work Speaks for Itself
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:mt-6 md:text-lg">
            Take a look at some of our recent home improvement,
            repair, installation and smart home projects completed
            throughout Maryland, Washington DC and Northern Virginia.
          </p>

        </div>

        {/* Projects */}

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3 md:gap-8">

          {projects.map((project) => (

            <div
              key={project.title}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="relative h-64 overflow-hidden md:h-72">

                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

              </div>

              <div className="p-5 md:p-6">

                <h3 className="text-xl font-bold text-slate-900 md:text-2xl">
                  {project.title}
                </h3>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}