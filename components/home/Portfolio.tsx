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
  className="bg-white py-24"
>      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Recent Projects
          </span>

          <h2 className="mt-4 text-4xl font-bold text-slate-900">
            Our Work Speaks for Itself
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Take a look at some of our recent home improvement,
            repair, installation and smart home projects completed
            throughout Maryland, Washington DC and Northern Virginia.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {projects.map((project) => (

            <div
              key={project.title}
              className="group overflow-hidden rounded-2xl shadow-lg"
            >

              <div className="relative h-72 overflow-hidden">

                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

              </div>

              <div className="bg-white p-6">

                <h3 className="text-2xl font-bold text-slate-900">
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