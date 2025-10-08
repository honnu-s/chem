'use client'
import { Navbar } from "@/components/nav";
import Image from "next/image";
import { useInView } from 'react-intersection-observer';
import { useRouter } from "next/navigation";


export default function Home() {
  const router=useRouter();
  const { ref:refH, inView:headinView } = useInView({ triggerOnce: true });
  const { ref:refd, inView:dinView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: refAnim, inView: animInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref:refEu, inView:EuinView } = useInView({ triggerOnce: true });

  return (
<><div><Navbar/>
<section>
   <div className="flex h-screen  justify-center p-4  max-w-7xl bg-white p-8">
          
          <div ref={refH} className="w-7/10 flex flex-col justify-center">
            <h1  
      className={`md:text-5xl text-3xl font-bold mb-6 transition-all duration-1000 ${
        headinView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
      }`}>
             Know What's Inside Your Cosmetics 

            </h1>
            <p  className={`md:text-lg text-sm text-gray-700 mb-6 transition-all duration-1000 ${
        headinView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
      }`}>
              ChemGuard scans your cosmetic ingredients to detect banned or restricted chemicals under EU law, while also explaining their function, health effects, and environmental impact
            </p>
            <button onClick={()=>{
              router.push('/check')
            }} className={ `w-50  bg-emerald-700 hover:text-emerald-600  border-2 hover:border-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-1000 ${
        headinView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
      }` }>
              Analyze Ingredients
            </button>
          </div>

         
          <div className="w-3/10 flex justify-center items-center">
                  <Image src="/images/home.png" alt="home Icon"  width={200} height={200} className=""/> 

            
          </div>
        </div>
</section>
<section className="bg_square-pattren">
  <div><p className="text-center text-4xl font-bold px-4 pt-4">Why ChemGuard?</p></div>
  <div className="md:flex  p-10 pb-20 items-center justify-center">
  <div ref={refd} className={ `flex-1 m-4 text-center border border-black bg-white shadow-md rounded p-4 flex flex-col items-center justify-center h-64 transition-all duration-700 ${
            dinView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}>
    <Image src='/images/ban.png' width={80}  height={80} alt="ban-icon" />
   <p className="p-2">Detect banned & restricted chemicals (based on EU Annex II & III)</p>
     </div> 

     <div ref={refd} className={`border border-black flex-1 m-4 text-center flex-col bg-white shadow-md rounded p-4 flex items-center justify-center h-64 transform transition-all duration-700 delay-200 ${
            dinView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}> 
       <Image src="/images/botanical.png" alt="botanical-icon" width={100} height={100} />
       <p className="p-2">Understand ingredient purpose – Is it an emollient, preservative, surfactant, fragrance</p> 
       </div>
       </div>
       </section>
       <section ref={refEu} className="bg-emerald-50 py-16">
          <div className={`max-w-4xl mx-auto px-6 border-l-4 border-emerald-600 pl-6 transition-all duration-1000 ${
        EuinView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
      }`}>
            <h2 className="text-3xl font-bold mb-4">Why EU Standards?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              I chose <span className="font-semibold">EU regulations</span> because they have the strictest cosmetic safety laws. Other countries like the US or Japan have fewer banned chemicals, meaning products there may still contain harmful ingredients.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Using EU Annex II & III ensures ChemGuard provides science-backed, reliable results. Your safety and informed choices are my priority.
            </p>
            <a href="https://ec.europa.eu/growth/sectors/cosmetics/cosing_en" target="_blank" className="mt-4 inline-block text-emerald-600 hover:underline font-medium">
              Explore EU Cosmetic Regulations
            </a>
          </div>
        </section>
<section ref={refAnim} className="bg_square-pattren p-20">
  <h1 className={`text-center text-3xl  font-bold mb-12 transition-all duration-1000 ${
      animInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
    }`}>How It Works</h1>
  <div className={`flex flex-col md:flex-row w-full h-full gap-8 transition-all duration-1000 delay-200 ${
      animInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
    }`}>
    
    <div className="flex-1 text-center border border-black bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center h-64 transition-transform duration-300 hover:scale-105">
      <div className="w-20 h-20 rounded-full border-2 border-black  bg-gradient-to-br from-sky-300 to-sky-500 flex items-center justify-center text-black text-xl font-bold mb-4">1</div>
      <h2 className="text-lg font-bold mb-2">Input Method</h2>
      <p className="text-gray-700 text-sm">Choose to paste ingredients manually or let AI extract them from a product name.</p>
    </div>

    <div className="flex-1 text-center border border-black bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center h-64 transition-transform duration-300 hover:scale-105">
      <div className="w-20 h-20 rounded-full border-2 border-black bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-black text-xl font-bold mb-4">2</div>
      <h2 className="text-lg font-bold mb-2">Analysis</h2>
      <p className="text-gray-700 text-sm">Our system analyzes each ingredient against EU safety regulations.</p>
    </div>

    <div className="flex-1 text-center border border-black bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center h-64 transition-transform duration-300 hover:scale-105">
      <div className="w-20 h-20 rounded-full border-2 border-black bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-black text-xl font-bold mb-4">3</div>
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

        
 <section className="bg-black text-white border-2 border-black ">
  <footer className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
      <h3 className="text-xl font-bold mb-4">About ChemGuard</h3>
      <p className="text-gray-300 text-sm">
        I built <span className=" font-bold">ChemGuard</span> to help people make safer cosmetic choices. 
        Many products hide harmful chemicals, so my goal is to make ingredient analysis simple, clear, and trustworthy.
      </p>
      <p className="text-gray-300 text-sm mt-2">
        It’s not just a project for fun—I wanted a tool that protects your health and the environment.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-bold mb-4">Why EU Standards?</h3>
      <p className="text-gray-300 text-sm">
        I chose <span className="font-bold">EU regulations</span> because the EU has the strictest and most trusted cosmetic safety laws in the world. 
        Other countries like the US or Japan have fewer banned chemicals, which means products there may still contain harmful ingredients.
      </p>
      <p className="text-gray-300 text-sm mt-2">
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
      <p className="text-gray-300 text-sm mb-2">
        Got feedback or questions? I’d love to hear from you! <br/>
        Email: honnu621@gmail.com
      </p>
      <div className="flex space-x-4 mt-2">
        <a href="https://github.com/" target="_blank" className="text-gray-400 hover:text-gray-900">GitHub</a>
        <a href="https://linkedin.com/" target="_blank" className="text-gray-400 hover:text-gray-900">LinkedIn</a>
        <a href="https://twitter.com/" target="_blank" className="text-gray-400 hover:text-gray-900">Twitter</a>
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
