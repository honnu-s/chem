"use client";

const data = [
  {
    image: "/images/example-product.png",
    title: "Clean Ingredients",
    desc: "Understand what goes into your cosmetics and how it affects your health.",
  },
  {
    image: "/images/example-ing.png",
    title: "EU Standards",
    desc: "We follow strict EU regulations to ensure maximum safety.",
  },
  {
    image: "/images/eu-proof.png",
    title: "Smart Analysis",
    desc: "AI-powered detection of harmful and restricted chemicals.",
  },
];

export default function ParallaxSections() {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-6xl mx-auto space-y-24 px-4">

        {data.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-10 ${
                !isLeft ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* PARALLAX BOX */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="parallax-box">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="parallax-img"
                  />
                </div>
              </div>

              {/* TEXT */}
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}