'use client'
import { Navbar } from "@/components/nav";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useInView } from 'react-intersection-observer';
import { useRouter } from "next/navigation";
import { LightRays } from "@/components/ui/light-rays";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

export function WhyEuStickySection() {
  const content = [
  {
    title: "India’s Reality",
    description:
      "Many cosmetic products sold in India still use chemicals banned in the EU like Glow and Lovely BB Cream.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <img
          src="/images/example-product.png"
          width={100}
          height={100}
          alt="Indian cosmetic label containing EU-banned ingredients"
          className="object-contain"
        />
      </div>
    ),
  },
  {
    title: "Example: Popular Product",
    description:
      "Here’s a real example: a BB Cream widely sold in India lists 'Butylphenyl Methylpropional' and other restricted chemicals — banned under EU Annex II. ChemGuard flags such ingredients instantly to help users stay safe.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <Image
          src="/images/example-ing.png"
          width={300}
          height={300}
          alt="Indian Cream containing EU-banned chemicals"
          className="object-cover"
        />
      </div>
    ),
  },
  {
    title: "Proof on EU Cosing Website",
    description:
      "This chemical 'Butylphenyl Methylpropional' is banned in the EU under Annex II. You can verify it on the official EU COSING website. ChemGuard helps you identify these chemicals easily.",
    content: (
      <div className="flex flex-col h-full w-full items-center justify-center bg-white text-black p-6 text-center text-lg font-semibold">
        <Image
          src="/images/eu-proof.png"
          width={600}
          height={600}
          alt="EU banned chemical screenshot"
          className="object-contain max-h-[70vh]"
        />
      </div>
    ),
  },
  {
    title: "ChemGuard Overview",
    description: "ChemGuard instantly detects banned and restricted chemicals in your cosmetics for safer choices.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-white text-black text-lg font-semibold">
        ChemGuard helps you stay safe by highlighting harmful ingredients in everyday products.
      </div>
    ),
  },
];


  return (
    <section
      id="why-eu"
      className="relative  w-full bg-white flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#ffffff" }} 
    >
      <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold my-4 ">
            Why EU Standards?
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            The European Union enforces the world’s most comprehensive cosmetic safety
            laws. Many everyday products in India still include chemicals banned in
            Europe — that’s why ChemGuard aligns with EU Annex II & III to ensure
            ingredient transparency and consumer safety.
          </p>
        </div>
      <div className="w-full min-h-screen max-w-6xl bg-white" style={{ backgroundColor: "#ffffff" }}>
  <StickyScroll 
    content={content} 
    contentClassName="bg-white text-black" 
  />
</div>
    </section>
  );
};



 
export default function Home() {
  const router=useRouter();
  const { ref:refH, inView:headinView } = useInView({ triggerOnce: true });
  const { ref:refd, inView:dinView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: refAnim, inView: animInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref:refEu, inView:EuinView } = useInView({ triggerOnce: true });
   const sectionRef = useRef(null);
   const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });


  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  
  return (
<><div><Navbar/>
<div>
        <Navbar />
        <section ref={sectionRef} className="relative overflow-hidden">
          <LightRays  color="#d0ffe6ff" 
          speed={4} />
          <div className="flex h-screen justify-center p-4 max-w-7xl bg-white p-8 mx-auto">
            
            <motion.div
              ref={refH}
              style={{ y: yText }}
              className="w-7/10 flex flex-col justify-center z-10"
            >
              <h1
                className={`md:text-6xl text-3xl font-extrabold mb-6 transition-all duration-1000 ${
                  headinView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                }`}
              >
                Know What's Inside Your Cosmetics
              </h1>
              <p
                className={`md:text-lg text-sm text-gray-700 mb-6 transition-all duration-1000 ${
                  headinView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                }`}
              >
                ChemGuard scans your cosmetic ingredients to detect banned or restricted
                chemicals under EU law, while also explaining their function, health effects,
                and environmental impact.
              </p>
              <button
                onClick={() => router.push("/check")}
                className={`w-fit shadow-[6px_6px_0px_black] bg-gradient-to-r from-emerald-700 to-emerald-500 hover:from-emerald-600 hover:to-emerald-400 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-700 ${
                  headinView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                Analyze Ingredients
              </button>
            </motion.div>

            <motion.div
              style={{ y: yImage }}
              className="w-3/10 flex justify-center items-center"
            >
              <Image src="/images/home.png" alt="home Icon" width={200} height={200} />
            </motion.div>
          </div>

        </section>
      </div>
<section className="bg_square-pattren">
  <div><p className="text-center  text-4xl font-bold px-4 pt-4">Why ChemGuard?</p></div>
  <div className="md:flex  p-10 pb-20 items-center justify-center">
  <div ref={refd} className={ ` flex-1 m-4 text-center border-2  bg-white shadow-[6px_6px_0px_black] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200  p-4 flex flex-col items-center justify-center h-64 transition-all duration-700 ${
            dinView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}>
    <Image src='/images/ban.png' width={80}  height={80} alt="ban-icon" />
   <p className="p-2">Detect banned & restricted chemicals (based on EU Annex II & III)</p>
     </div> 

     <div ref={refd} className={`border-2  flex-1 m-4 text-center flex-col bg-white shadow-[6px_6px_0px_black] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200  p-4 flex items-center justify-center h-64 transform transition-all duration-700 delay-200 ${
            dinView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}> 
       <Image src="/images/botanical.png" alt="botanical-icon" width={100} height={100} />
       <p className="p-2">Understand ingredient purpose – Is it an emollient, preservative, surfactant, fragrance</p> 
       </div>
       </div>
       </section>
       <WhyEuStickySection />


       
<section ref={refAnim} className="bg_square-pattren md:p-20">
  <h1 className={`text-center text-3xl  font-bold mb-12 transition-all duration-1000 ${
      animInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
    }`}>How It Works</h1>
  <div className={`flex flex-col md:flex-row w-full h-full gap-8 transition-all duration-1000 delay-200 ${
      animInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
    }`}>
    
    <div className="flex-1 text-center border border-black bg-white shadow-[3px_3px_0px_black]
 rounded-lg p-6 flex flex-col items-center justify-center h-64 transition-transform duration-300 hover:scale-105">
      <div className="w-20 h-20 rounded-full border-2 border-black  bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black text-xl font-bold mb-4">1</div>
      <h2 className="text-lg font-bold mb-2">Input Method</h2>
      <p className="text-gray-700 text-sm">Choose to paste ingredients manually or let AI extract them from a product name.</p>
    </div>

    <div className="flex-1 text-center border border-black bg-white shadow-[3px_3px_0px_black]
 rounded-lg p-6 flex flex-col items-center justify-center h-64 transition-transform duration-300 hover:scale-105">
      <div className="w-20 h-20 rounded-full border-2 border-black bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black text-xl font-bold mb-4">2</div>
      <h2 className="text-lg font-bold mb-2">Analysis</h2>
      <p className="text-gray-700 text-sm">Our system analyzes each ingredient against EU safety regulations.</p>
    </div>

    <div className="flex-1 text-center border border-black bg-white shadow-[3px_3px_0px_black]
 rounded-lg p-6 flex flex-col items-center justify-center h-64 transition-transform duration-300 hover:scale-105">
      <div className="w-20 h-20 rounded-full border-2 border-black bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black text-xl font-bold mb-4">3</div>
      <h2 className="text-lg font-bold mb-2">Results</h2>
      <p className="text-gray-700 text-sm">Get detailed safety information, benefits, and restriction status.</p>
    </div>

  </div>
</section>

<section className="bg-white py-20 flex  ">
  <div className="w-full  flex flex-col md:flex-row justify-between  px-6">
    
    <div className="md:w-3/5 flex flex-col justify-center ">
      <p className="text-3xl  md:text-3xl font-bold mb-6">
        See ChemGuard in Action
      </p>
      <p className="text-gray-700  mb-4">
        When you provide an ingredient list, ChemGuard instantly detects banned, restricted, and safe chemicals according to EU Annex II & III. 
        It also provides clear explanations about their purpose, potential health risks, and environmental impact.
      </p>      
    </div>

    <div className="md:w-2/5 flex justify-center">
      <Image 
        src="/images/example.png" 
        alt="Example Output" 
        width={400} 
        height={400} 
        className="rounded-lg shadow-lg"
      />
    </div>

  </div>
</section>

        
 <section className="bg-white text-black border-2 border-black ">
  <footer className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
      <h3 className="text-xl font-bold mb-4">About ChemGuard</h3>
      <p className="text-black text-sm">
        I built <span className=" font-bold">ChemGuard</span> to help people make safer cosmetic choices. 
        Many products hide harmful chemicals, so my goal is to make ingredient analysis simple, clear, and trustworthy.
      </p>
      <p className="text-black text-sm mt-2">
        It’s not just a project for fun—I wanted a tool that protects your health and the environment.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-bold mb-4">Why EU Standards?</h3>
      <p className="text-black text-sm">
        I chose <span className="font-bold">EU regulations</span> because the EU has the strictest and most trusted cosmetic safety laws in the world. 
        Other countries like the US or Japan have fewer banned chemicals, which means products there may still contain harmful ingredients.
      </p>
      <p className="text-black text-sm mt-2">
        By using EU Annex II & III as a foundation, ChemGuard ensures you get science-backed, reliable results every time.
      </p>
      <a
        href="https://ec.europa.eu/growth/sectors/cosmetics/cosing_en"
        target="_blank"
        className="text-sky-600 hover:underline text-sm mt-2 inline-block"
      >
        Explore EU Cosmetic Regulations
      </a>
    </div>

    <div>
      <h3 className="text-xl font-bold mb-4">Contact & Socials</h3>
      <p className="text-black text-sm mb-2">
        Got feedback or questions? I’d love to hear from you! <br/>
        Email: honnu621@gmail.com
      </p>
      <div className="flex space-x-4 mt-2">
        <a rel="noopener noreferrer"  href="https://github.com/honnu-s" target="_blank" className="text-gray-400 hover:text-gray-900">GitHub</a>
        {/* <a rel="noopener noreferrer" href="https://linkedin.com/" target="_blank" className="text-gray-400 hover:text-gray-900">LinkedIn</a> */}
        {/* <a rel="noopener noreferrer" href="https://twitter.com/" target="_blank" className="text-gray-400 hover:text-gray-900">Twitter</a> */}
      </div>
      <p className="text-sky-700 text-xs mt-6">
        &copy; {new Date().getFullYear()} ChemGuard. Built personally by me. All rights reserved.
      </p>
    </div>
  </footer>
</section>


      
</div>
</> );
}
