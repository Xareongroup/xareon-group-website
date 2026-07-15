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
  className="bg-slate-50 py-24"
>      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Customer Reviews
          </span>

          <h2 className="mt-4 text-4xl font-bold text-slate-900">
            What Our Customers Say
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Customer satisfaction is our highest priority. Here's what
            homeowners say about working with XAREON GROUP.
          </p>

        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {reviews.map((review) => (

            <div
              key={review.name}
              className="rounded-2xl bg-white p-8 shadow-lg"
            >

              <div className="mb-6 flex text-yellow-400">

                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />

              </div>

              <p className="text-slate-600 leading-8">
                "{review.review}"
              </p>

              <div className="mt-8">

                <h3 className="font-bold text-slate-900">
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