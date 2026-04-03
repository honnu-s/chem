'use client'
import { Navbar } from "@/components/nav";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useInView } from 'react-intersection-observer';
import { useRouter } from "next/navigation";
import { LightRays } from "@/components/ui/light-rays";

function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const transform = {
    up: inView ? "translateY(0)" : "translateY(28px)",
    left: inView ? "translateX(0)" : "translateX(-28px)",
    right: inView ? "translateX(0)" : "translateX(28px)",
  }[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        opacity: inView ? 1 : 0,
        transform,
      }}
    >
      {children}
    </div>
  );
}

function Hero() {
  const router = useRouter();
  const { ref, inView } = useInView({ triggerOnce: true });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-screen">
      <LightRays color="#d0ffe6ff" speed={4} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-center min-h-screen gap-12">
        {/* Text */}
        <motion.div ref={ref} style={{ y: yText }} className="flex-1 flex flex-col justify-center">
         
          <h1
            className={`text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-5 transition-all duration-1000 delay-100 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
          >
            Know exactly what&apos;s{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-emerald-600">on your skin.</span>
              <span className="absolute bottom-1 left-0 w-full h-2 bg-emerald-100 -z-0" />
            </span>
          </h1>

          <p
            className={`text-base md:text-lg text-gray-600 mb-8 max-w-xl leading-relaxed transition-all duration-1000 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
          >
            ChemGuard checks every ingredient in your cosmetic against EU safety law —
            flagging banned chemicals, explaining health effects, and rating environmental impact.
            In seconds.
          </p>

          <div className={`flex flex-wrap items-center gap-4 transition-all duration-1000 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <button
              onClick={() => router.push("/check")}
              className="bg-gray-900 text-white font-bold py-3.5 px-8 shadow-[4px_4px_0px_#10b981] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 text-sm"
            >
              Analyse Your Product →
            </button>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div style={{ y: yImage }} className="hidden md:flex flex-shrink-0 justify-center items-center mr-16">
          <div className="relative">
            <div className="absolute inset-0  translate-x-3 translate-y-3" />
            <Image
              src="/images/home.png"
              alt="ChemGuard ingredient analysis"
              width={240}
              height={240}
              className="relative z-10"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustBar() {
  const stats = [
    { number: "1,700+", label: "Chemicals banned by EU" },
    { number: "~11", label: "Banned by US FDA" },
    { number: "7,000+", label: "Ingredients in our database" },
    { number: "<5s", label: "For a full ingredient report" },
  ];

  return (
    <section className="border-t border-b border-gray-200 bg-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <FadeIn key={s.label} delay={i * 80}>
            <div className="flex flex-col gap-1 border-l-2 border-emerald-400 pl-4">
              <span className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-none">
                {s.number}
              </span>
              <span className="text-xs text-gray-500 mt-1">{s.label}</span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="bg-white py-24 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase mb-3">
            Why This Matters
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 max-w-2xl leading-tight">
            The same product. A very{" "}
            <span className="text-emerald-600">different formula.</span>
          </h2>
          <p className="mt-5 text-gray-600 max-w-2xl text-base leading-relaxed">
            Products sold in India — and many other markets — can legally contain
            chemicals that are{" "}
            <span className="font-semibold text-gray-900">outright banned in Europe</span>.
            Not restricted. Banned. Because the science says they cause harm.
            Most consumers never know.
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { flag: "🇺🇸", country: "US FDA", banned: "~11", note: "chemicals banned in cosmetics", highlight: false },
            { flag: "🇯🇵", country: "Japan", banned: "~70", note: "chemicals restricted", highlight: false },
            { flag: "🇪🇺", country: "European Union", banned: "1,700+", note: "banned or restricted chemicals", highlight: true },
          ].map((item, i) => (
            <FadeIn key={item.country} delay={i * 100}>
              <div className={`p-6 border-2 ${item.highlight ? "border-emerald-500 bg-emerald-50 shadow-[4px_4px_0px_#10b981]" : "border-gray-200 bg-white"}`}>
                <p className="text-2xl mb-1">{item.flag}</p>
                <p className="text-sm font-bold text-gray-700">{item.country}</p>
                <p className={`text-4xl font-extrabold mt-1 ${item.highlight ? "text-emerald-600" : "text-gray-900"}`}>
                  {item.banned}
                </p>
                <p className="text-gray-500 text-sm mt-1">{item.note}</p>
                {item.highlight && (
                  <p className="mt-3 text-xs text-emerald-700 font-semibold">
                    ChemGuard uses this standard ✓
                  </p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={300}>
          <p className="mt-8 text-gray-400 text-sm max-w-xl leading-relaxed">
            Every chemical on the EU banned list was reviewed by the Scientific Committee
            on Consumer Safety (SCCS) — independent scientists, not industry lobbyists.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function RealExample() {
  const slides = [
    {
      tag: "Real Product · On shelves today",
      heading: "A BB Cream widely sold in India — with a banned ingredient inside",
      body: "This is not a hypothetical. This is a real product you can buy right now. The ingredient list contains a chemical banned in the EU since 2022 — and most people reading the label would never know.",
      image: "/images/example-product.png",
      imageAlt: "BB Cream product sold in India",
      reverse: false,
    },
    {
      tag: "The Ingredient List",
      heading: "Butylphenyl Methylpropional — listed as a fragrance ingredient",
      body: "There it is on the label. Butylphenyl Methylpropional (also known as Lilial) was banned by the EU in 2022 due to reproductive toxicity concerns. It's still legal in India and appears openly in the ingredient list.",
      image: "/images/example-ing.png",
      imageAlt: "Ingredient list showing EU-banned chemical",
      reverse: true,
    },
    {
      tag: "EU Verification",
      heading: "Verified on the official EU COSING database",
      body: "Butylphenyl Methylpropional is listed under EU Annex II — prohibited in all cosmetics sold in Europe. ChemGuard flags it instantly the moment it appears in any ingredient list you paste.",
      image: "/images/eu-proof.png",
      imageAlt: "EU COSING database showing banned status",
      reverse: false,
      link: true,
    },
  ];

  return (
    <section className="bg-gray-50 py-24 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase mb-3">
            A Real Example
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 max-w-2xl leading-tight">
            This is not hypothetical.{" "}
            <span className="text-emerald-600">This is a product on shelves right now.</span>
          </h2>
        </FadeIn>

        <div className="mt-16 flex flex-col gap-20">
          {slides.map((slide, i) => (
            <FadeIn key={slide.tag} delay={100}>
              <div className={`flex flex-col ${slide.reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-10 items-center`}>
                <div className="md:w-1/2 flex justify-center">
                  <div className="border-1 border-black shadow-[4px_4px_0px_#000] overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      width={480}
                      height={360}
                      className="object-contain w-full max-h-80"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">
                    {slide.tag}
                  </span>
                  <h3 className="mt-2 text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
                    {slide.heading}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base">
                    {slide.body}
                  </p>
                  {slide.link && (
                    <a
                      href="https://ec.europa.eu/growth/sectors/cosmetics/cosing_en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-emerald-700 text-sm font-semibold hover:underline"
                    >
                      Verify on EU COSING yourself →
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExampleReport() {
  return (
    <section className="bg-white py-24 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <FadeIn direction="left" className="md:w-1/2">
          <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase mb-3">
            What You Get
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            A full safety profile.{" "}
            <span className="text-emerald-600">For every single ingredient.</span>
          </h2>
          <p className="mt-5 text-gray-600 text-base leading-relaxed">
            Paste any ingredient list — from sunscreen, moisturiser, shampoo, anything.
            ChemGuard returns a complete report: ban status, health effect, environmental
            label, and a colour-coded safety rating.
          </p>
          
        </FadeIn>

        <FadeIn direction="right" delay={150} className="md:w-1/2 flex justify-center">
          <div className=" overflow-hidden">
            <Image
              src="/images/example.png"
              alt="ChemGuard ingredient analysis report"
              width={500}
              height={400}
              className="object-contain w-full"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function HowItWorks() {
  const router = useRouter();
  const steps = [
    {
      num: "01",
      title: "Paste or photograph",
      desc: "Copy the ingredient list from any product, or upload a photo of the label.",
    },
    {
      num: "02",
      title: "Instant database match",
      desc: "Every ingredient is checked against our EU Annex II & III database — exact and fuzzy matching catches alternate names.",
    },
    {
      num: "03",
      title: "AI safety enrichment",
      desc: "Each matched ingredient gets a colour code, health effect summary, and environmental label.",
    },
    {
      num: "04",
      title: "Your full report",
      desc: "See every ingredient at a glance. Download as Excel to save or share.",
    },
  ];

  return (
    <section className="bg-gray-50 py-24 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 max-w-xl leading-tight">
            Paste. Analyse. Know exactly what&apos;s on your skin.
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 100}>
              <div className="border-l-4 border-emerald-500 pl-5 h-full">
                <span className="text-5xl font-extrabold text-emerald-100 leading-none select-none">
                  {step.num}
                </span>
                <h3 className="mt-2 text-sm font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={400}>
          <div className="mt-14 flex justify-start">
            <button
              onClick={() => router.push("/check")}
              className="bg-gray-900 text-white font-bold py-3.5 px-8 text-sm shadow-[4px_4px_0px_#10b981] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200"
            >
              Try It Now →
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function CTA() {
  const router = useRouter();
  return (
    <section className="bg-gray-900 py-24 px-6">
      <FadeIn>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            What&apos;s actually in your moisturiser?
          </h2>
          <p className="mt-4 text-gray-400 text-base leading-relaxed">
            Paste any ingredient list. ChemGuard will tell you exactly what each one is,
            whether it&apos;s banned in the EU, and what it does to your body and the
            environment.
          </p>
          <button
            onClick={() => router.push("/check")}
            className="mt-8 inline-flex items-center gap-2 bg-emerald-500 text-white font-bold py-4 px-10 shadow-[4px_4px_0px_#fff] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 text-base"
          >
            Analyse Your Ingredients →
          </button>
          <p className="mt-4 text-gray-600 text-xs">
            Free to use · Sign in with Google to unlock full report
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t-2 border-black">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-sm font-extrabold mb-3">About ChemGuard</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Built after noticing how many everyday cosmetics contain chemicals banned
            in Europe. A transparency tool for consumers — not a medical device, but a
            starting point for informed choices.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-extrabold mb-3">Why EU Standards?</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            The EU bans 1,700+ cosmetic chemicals versus ~11 by the US FDA. Every
            substance was reviewed by independent scientists (SCCS) — the world&apos;s
            most protective standard.
          </p>
          <a
            href="https://ec.europa.eu/growth/sectors/cosmetics/cosing_en"
            target="_blank"
            rel="noopener"
            className="text-emerald-600 hover:underline text-sm mt-2 inline-block font-medium"
          >
            EU COSING Database →
          </a>
        </div>
        <div>
          <h3 className="text-sm font-extrabold mb-3">Contact</h3>
          <p className="text-gray-500 text-sm mb-1">Got feedback or questions?</p>
          <p className="text-sm font-medium">honnu621@gmail.com</p>
          <div className="flex gap-4 mt-3">
            <a
              href="https://github.com/honnu-s"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 text-sm font-medium"
            >
              GitHub
            </a>
          </div>
          <p className="text-gray-400 text-xs mt-6">
            © {new Date().getFullYear()} ChemGuard. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
            Safety profiles enriched using AI, grounded in PubChem, ECHA, NCBI & EWG.
            Ban/restriction data from EU Annex II & III directly.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustBar />
      <Problem />
      <RealExample />
      <ExampleReport />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}
