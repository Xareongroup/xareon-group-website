import { Star } from "lucide-react";

const reviews = [
  {
    name: "Michael T.",
    location: "Rockville, MD",
    review:
      "Excellent workmanship and very professional. They mounted our TV perfectly and cleaned everything afterward.",
  },
  {
    name: "Sarah L.",
    location: "Washington, DC",
    review:
      "Fast response, honest pricing, and quality work. We'll definitely hire XAREON GROUP again.",
  },
  {
    name: "David R.",
    location: "Fairfax, VA",
    review:
      "Installed our smart doorbell and security cameras quickly. Everything works flawlessly.",
  },
];

export default function Reviews() {
  return (
    <section
      id="reviews"
      className="bg-slate-50 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 md:text-sm">
            Customer Reviews
          </span>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-5xl">
            What Our Customers Say
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:mt-6 md:text-lg">
            Customer satisfaction is our highest priority. Here's what
            homeowners say about working with XAREON GROUP.
          </p>

        </div>

        {/* Reviews */}

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3 md:gap-8">

          {reviews.map((review) => (

            <div
              key={review.name}
              className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl md:p-8"
            >

              <div className="mb-5 flex text-yellow-400">

                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    fill="currentColor"
                    size={20}
                  />
                ))}

              </div>

              <p className="flex-grow text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                "{review.review}"
              </p>

              <div className="mt-6 border-t border-slate-100 pt-5">

                <h3 className="text-lg font-bold text-slate-900">
                  {review.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {review.location}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}