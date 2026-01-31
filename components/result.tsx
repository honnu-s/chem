'use client'
import { useState,useEffect,useMemo } from "react";
import axios from "axios";
import { exportToExcel } from "@/excelfilelogic";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {PieChart,Pie,Cell,Tooltip,Legend,ResponsiveContainer,} from "recharts";
import {CircleCheckBig,Minus,TriangleAlert,} from "lucide-react";
import { EachIng } from "./ui/eachIng";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;


function SearchFilterComponent({ onChange }: { onChange: (filters: { search: string; filter1: string; filter2: string }) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter1, setFilter1] = useState("All"); 
  const [filter2, setFilter2] = useState("All"); 
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ search: searchTerm, filter1, filter2 });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, filter1, filter2, onChange]);

  const clearFilters = () => {
    setFilter1("All");
    setFilter2("All");
    setSearchTerm("");
    onChange({ search: "", filter1: "All", filter2: "All" });
  };

  const isAnyFilterSelected =
    filter1 !== "All" || filter2 !== "All"|| searchTerm !== "";
  
   

  return (
    <div className="flex justify-center items-center">
    <div className="w-full md:w-[70%] p-4 border border-gray-300 bg-white ">
    <div className="mb-4 bg-gray-100 flex items-center w-full   rounded focus-within:ring-2 focus-within:ring-gray-400">
  <svg
    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500 h-5 w-5 ml-2"
    aria-hidden="true"
  >
    <path d="m21 21-4.34-4.34"></path>
    <circle cx="11" cy="11" r="8"></circle>
  </svg>

  <input
    type="text"
    placeholder="Search by chemical name"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full p-1  focus:outline-none"
  />
</div>


      <div className="w-auto flex flex-col md:flex-row justify-start md:items-center gap-4">
        <div className="flex items-center gap-2">
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="lucide lucide-funnel w-4 h-4 text-gray-500"
  aria-hidden="true"
>
  <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
</svg>

          <span className="text-xs md:text-lg text-gray-600 font-semibold">Filters:</span>
</div>
        <Select value={filter1} onValueChange={setFilter1}>
          <SelectTrigger className="w-[150px] md:w-[180px] border-none bg-gray-100 ">
            <SelectValue placeholder="Select Option 1" />
          </SelectTrigger>
          <SelectContent className="bg-white border-none shadow-md">
            <SelectItem className="hover:bg-gray-200" value="All">All</SelectItem>
            <SelectItem className="hover:bg-gray-200" value="green">good</SelectItem>
            <SelectItem className="hover:bg-gray-200" value="red">bad</SelectItem>
            <SelectItem className="hover:bg-gray-200" value="yellow">Moderate</SelectItem>

          </SelectContent>
        </Select>

        {/* Filter 2 */}
        <Select value={filter2} onValueChange={setFilter2}>
          <SelectTrigger className="w-[150px] md:w-[180px] border-none bg-gray-100">
            <SelectValue placeholder="Select Option 2" />
          </SelectTrigger>
          <SelectContent className="bg-white border-none shadow-md">
            <SelectItem className="hover:bg-gray-200" value="All">All</SelectItem>
            <SelectItem className="hover:bg-gray-200" value="EUbanned">EU Banned</SelectItem>
            <SelectItem className="hover:bg-gray-200" value="EURestricted">EU Restricted</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Button */}
        {isAnyFilterSelected && (
          <button
            onClick={clearFilters}
            className="w-[180px] border border-gray-300 rounded p-2 bg-red-500 text-white hover:bg-red-600 transition"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
    </div>
  );
}

function AlertBox({ bannedList = [] }: { bannedList: string[] }) {
  const len=bannedList.length;
  if (len=== 0) return null;
  return (
    <div className="flex md:justify-center md:items-center">
    <div
      role="alert"
      className="w-full md:w-[70%] my-6 px-1 md:px-4 py-3 text-sm   border-2 border-red-200 bg-red-50 text-card-foreground"
    >
      <div className="col-start-2 grid   text-sm text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center text-center">
            <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className=" text-red-600 "
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
        <path d="M12 9v4"></path>
        <path d="M12 17h.01"></path>
      </svg>
            <span className="ml-4 md:text-lg text-red-800">
              {len} ingredients banned in the EU detected
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {bannedList.map((chem) => (
              <span
                key={chem}
                className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium gap-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-triangle-alert w-3 h-3 mr-1" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                {chem}
              </span>
            ))}
          </div>
          <p className="text-xs md:text-sm text-red-700 max-w-2xl">
            These ingredients have been banned in the European Union due to
            safety concerns. Please consult regulatory guidelines and consider
            safer alternatives.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

const renderLegend = (props: { counts: { Good: number; Moderate: number; Bad: number }}) => {
  const { counts } = props;
  return (
  <div className="flex justify-center gap-6 mt-4">
    <div className="flex items-center gap-2">
      <TriangleAlert className="w-4 h-4 text-red-600" />
      <span className="text-sm text-gray-700">
        Bad ({counts.Bad})
      </span>
    </div>
    <div className="flex items-center gap-2">
      <CircleCheckBig className="w-4 h-4 text-green-600" />
      <span className="text-sm text-gray-700">
        Good ({counts.Good})
      </span>
    </div>
    <div className="flex items-center gap-2">
      <Minus className="w-4 h-4 text-yellow-600" />
      <span className="text-sm text-gray-700">
        Moderate ({counts.Moderate})
      </span>
    </div>
  </div>)
};

const CustomTooltip = ({ active, payload }:any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-md text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p>{payload[0].value}</p>
      </div>
    );
  }
  return null; 
};

function IngredientSafetyChart({ counts }: { counts: { Good: number; Moderate: number; Bad: number } }) {
  const chartData = [
    { name: "good", value: counts.Good },
    { name: "moderate", value: counts.Moderate },
    { name: "bad", value: counts.Bad },
  ];
  const total=chartData[0].value+chartData[1].value+chartData[2].value;
  return (
    <div className="bg-white border border-black my-6 shadow-md w-full md:w-[70%]  ">
      <div className="grid auto-rows-min gap-1.5 px-6 pt-6 text-center">
        <h4 className="flex items-center justify-center gap-2 text-lg font-semibold">
          <CircleCheckBig className="w-5 h-5 text-green-600" />
          Ingredient Safety Distribution
        </h4>
        <p className="text-sm text-gray-600">
          Analysis of {total} ingredients based on health effects
        </p>
      </div>

      {/* Chart */}
      <div className="px-6 py-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              label
            >
              <Cell key="good" fill="#22c55e" />  
      <Cell key="moderate" fill="#eab308" /> 
      <Cell key="bad" fill="#ef4444" /> 
            </Pie>

            <Tooltip content={<CustomTooltip  payload={chartData}/>} />

            <Legend content={() => renderLegend({ counts })} />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export function Result(){
    const [resultData, setResultData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: "", filter1: "All", filter2: "All" });
    const [error, setError] = useState<string | null>(null);
    const messages = [
    "Loading analysis...",
    "Checking ingredients with AI...",
    "Analyzing health effects...",
    "Comparing against EU banned/restricted lists...",
    "Almost done..."
  ];
  const [msgIndex, setMsgIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2500); 
    return () => clearInterval(interval);
  }, []);

    useEffect(() => {
  const fetchResult = async () => {
    setError(null);
    const storedInputs = localStorage.getItem("analyzeInputs");
    const inputs = storedInputs ? JSON.parse(storedInputs) : null;

    if (!inputs) {
      setLoading(false);
      return;
    }

    const cachedResults = localStorage.getItem("analyzeResults");
    if (cachedResults) {
      const parsedCache = JSON.parse(cachedResults);

      if (JSON.stringify(parsedCache.inputs) === JSON.stringify(inputs)) {
        setResultData(parsedCache.results); 
        console.log(parsedCache.results)
        setLoading(false);
        return; 
      }
    }

const token = localStorage.getItem("jwt");


    try {
      const res = await axios.post(
    `${API_BASE}/check-ingredients`,
    { ingredients: inputs },
     {
    withCredentials: true, 
  }
  );

      console.log(res.data.AI)
      const results = res.data.AI || [];
      setResultData(results);

      localStorage.setItem(
        "analyzeResults",
        JSON.stringify({ inputs, results })
      );
    } catch (err:any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch results. Please try again."); 

    } finally {
      setLoading(false);
    }
  };

  fetchResult();
}, []);

const [timeoutExceeded, setTimeoutExceeded] = useState(false);

useEffect(() => {
  if (!loading) return; 
  if (timeoutExceeded) return;

  const interval = setInterval(() => {
    setMsgIndex((prev) => {
      if (prev < messages.length - 1) return prev + 1;
      return prev; 
    });
  }, 2500);

  // Stop loading if it takes more than 2 minutes
  const timeout = setTimeout(() => {
    setTimeoutExceeded(true);
    setLoading(false);
    setError("Processing is taking too long. Please try again with fewer ingredients.");
  }, 2 * 60 * 1000); 

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
}, [loading, timeoutExceeded]);


const { preFilteredData, counts, bannedList,unmatchedString } = useMemo(() => {
    const counts = { Good: 0, Moderate: 0, Bad: 0 };
    const bannedList: string[] = [];
    let unmatchedString = "";

    const preFilteredData = resultData.filter((item: any) => {
      if (item.match === "un"){
        unmatchedString += (unmatchedString ? ", " : "") + item.input;
        return false;
      }  
      if (!item.ingr) return false;
      if (item.cc === "green") counts.Good++;
      else if (item.cc === "yellow") counts.Moderate++;
      else if (item.cc === "red") counts.Bad++;
      if (item.ban) bannedList.push(item.input);
      return true;
    });
    return { preFilteredData, counts, bannedList,unmatchedString };
  }, [resultData]);

  const filteredResults = useMemo(() => {
    return preFilteredData.filter((item: any) => {
      let match = true;
      if (filters.filter1 !== "All") match = match && item.cc === filters.filter1;
      if (filters.filter2 === "EUbanned") match = match && item.ban !== null;
      else if (filters.filter2 === "EURestricted") match = match && item.res !== null;
      if (filters.search.trim()) match = match && item.input.toLowerCase().includes(filters.search.toLowerCase());
      return match;
    });
  }, [preFilteredData, filters]);


  if (loading && !error  && !timeoutExceeded ) {
    

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-700 animate-pulse">
        {messages[msgIndex]}
      </p>
    </div>
  );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p className="text-sm text-gray-700 text-center">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
    

    

    return(<div>
        <div className="flex items-center justify-center">
            <h1 className="md:text-4xl text-2xl p-2 text-gray-700 font-semibold mx-4 mt-4" >Ingredients Summary</h1>
        </div>
        <div className="md:p-4 md:m-8 ">
            <SearchFilterComponent onChange={setFilters}></SearchFilterComponent>
            <div><AlertBox bannedList={bannedList}></AlertBox></div>
                {(counts.Good + counts.Moderate + counts.Bad > 0) && (
                  <div className="flex justify-center items-center">
      <IngredientSafetyChart counts={counts} /></div>
    )}
            <div className="flex md:justify-center md:items-center flex-col">
              {filteredResults.map((item: any, idx: number) => (
            <EachIng key={idx} item={item} />
          ))}
          {filteredResults.length === 0 && (
  <div className="text-center text-gray-500 my-8">
    No ingredients found matching the current filters.
  </div>
)}

            </div>
    {unmatchedString && (
  <div className="flex justify-center items-center my-6">
    <div className="w-full md:w-[70%] bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 p-5 shadow-md">
      <h3 className="text-lg md:text-xl font-bold text-emerald-800 mb-3 flex items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        </svg>
        Ingredients we couldn't find anything for
      </h3>
      <p className="text-sm md:text-base text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 break-words leading-relaxed">
        {unmatchedString}
      </p>
    </div>
  </div>
)}



    {filteredResults.length > 0 && (
  <button
    onClick={() => {
      const formattedData = filteredResults.map((item: any) => ({
        Ingredient: item.input || "",
        Explanation: item.exp || "",
        "Health Effect / Benefit": item.h_e || "",
        "EU Banned": item.ban ? "Yes" : "No",
        "EU Restricted": item.res ? "Yes" : "No",
      }));

      exportToExcel(formattedData, "Ingredient_Analysis_Report");
    }}
    className="fixed bottom-6 right-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all"
  >
    <Download className="w-5 h-5" />
    Download Excel
  </button>
)}
        </div>
    </div>)
}

