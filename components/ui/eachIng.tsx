import Image from "next/image";
import { Heart } from "lucide-react";

const colorMap: Record<string, string> = {
  red: "text-red-500",
  green: "text-green-500",
  yellow: "text-yellow-500",
  
}; 

const getDomainName = (url: string) => {
    try {
      const hostname = new URL(url).hostname; 
      return hostname.split(".")[0]; 
    } catch {
      return "Source";
    }
  };

function EUBaned(){
  return(<><span               
                className="border-red-200 border-2 bg-red-50 inline-flex items-center rounded-md border px-1 py-1 text-xs md:text-sm font-medium gap-1 text-red-700"
              ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-triangle-alert w-5 h-5 mr-1" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                EU Banned
              </span></>)}

function EUrestricted({thr}:any){
  return(<span
  className="border-orange-300 border-2 bg-orange-50 inline-flex items-center rounded-md border px-1 py-1 text-xs md:text-sm font-medium gap-1 text-orange-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="w-6 h-6 mr-1"
    aria-hidden="true"
  >
    <line x1="12" y1="6" x2="12" y2="14"></line>
    <circle cx="12" cy="18" r="0.5"></circle>
  </svg>
  EU Restricted
</span>
)
}

function WaterDroplet({ color }: { color: string }) {
  console.log(color)
  return (
    <div className="flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        className={`w-10 h-10 ${colorMap[color] || "text-gray-500"}`}
        fill="currentColor"                  
        stroke="black"                       
        strokeWidth="2"                      
      >
        <path d="M32 2C24 14 12 26 12 40c0 11 9 20 20 20s20-9 20-20C52 26 40 14 32 2z" />
      </svg>
    </div>
  );
}


export function EachIng({item}:any){
  const imgName=item.cc=='green'?'heart':'precaution';
    return(<div className="border border-black w-full md:w-[70%] flex flex-col mb-2 p-4">
        <div className="flex justify-between">
          <div className="flex text-center justify-start">
            <WaterDroplet color={item.cc}/>
            <div className=" ml-3 text-left">
              <p className="md:text-xl font-bold">
            {item.match === "fuzzy" ? (
              <>
                {item.ingr?.n || item.input}{" "}
                <span className="text-gray-400 text-sm">({item.input})</span>
              </>
            ) : (
              item.input
            )}
          </p>
                {/* <p className="md:text-xl font-bold">{item.input}</p> */}
                <span className="md:text-sm text-xs text-gray-500">{item.ingr.fun}</span>
            </div>
        </div> 
        {item.ban && <EUBaned/>}
        {item.res && <><div className="flex flex-col text-center"><EUrestricted/><span className="text-orange-700 text-sm" >max: {item.res.thr}</span></div></>
}
        </div>
        
        <div className="my-3">
            <p className="font-normal text-gray-700 text-[15px] md:text-[19px]">{item.exp}</p>
        </div>
        <div className="md:flex w-full my-2 mx-4">
            <div className="md:w-[60%] flex md:border-gray-400">
              <div className="flex flex-col  items-center justify-center">
                <Image
                src={`/images/${imgName}.png`}
                alt="Health Icon"
                width={30}   
                height={30}  
                className=""
              />
              </div>
            <div className="flex items-center justify-center">
              <span className="mx-2">-</span>
              <p className="text-gray-700 text-[14px] md:text-sm">{item.h_e}</p>
            </div>
              
            </div>

    <div className=" md:w-[40%] flex   md:border-gray-400">
      <div className="flex flex-col  items-center justify-center md:ml-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe w-5 h-5 text-green-700 " aria-hidden="true"> <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
      <path d="M2 12h20"></path>
    </svg>
      </div>
      <div className="flex items-center justify-center">
          <span className="mx-2">-</span>
          <p className="text-gray-700 text-[14px] md:text-sm">{item.env}</p>
        </div>
        </div>
    </div>
    <div className="md:flex md:justify-between">
      <div className="flex">
        <div className="flex">
        <Image src="/images/link.png" alt="link Icon"  width={30} height={20} className=""/> 
        <span className="">Links</span>
        <span className="ml-3 text-gray-700">:</span>
      </div>
      <div>
        {Array.isArray(item.link) && item.link.map((l, idx) => (
  <a
    key={idx}
    href={l}
    target="_blank"
    rel="noopener noreferrer"
    className="font-medium text-blue-600 mx-2 underline hover:no-underline"
  >
    {getDomainName(l)}
  </a>
))}
        
      </div>
      </div>
      <div className="text-green-700 p-2 md:p-0 text-xs">{item.match} match</div>
      
    </div>

    </div>)
}