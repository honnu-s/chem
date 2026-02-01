"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Loader2 } from "lucide-react";


export function Analyze() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [analyze,setAnalyze]=useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setError("");
  };

  const handleSubmit = () => {

    const ingredientArray = [];
for (const raw of inputText.split(",")) {
  const trimmed = raw.trim();
  if (trimmed) ingredientArray.push(trimmed);
}
    if (ingredientArray.length === 0) {
      setAnalyze(false)
      toast.error("please provide input")
      return;
    }
    setAnalyze(true)

    localStorage.setItem(
      "analyzeInputs",
      JSON.stringify({ ingredients: ingredientArray })
    );
    router.push("/result");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (max 5MB).");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyzeImage = async () => {
    if (!imageFile) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", imageFile);
      form.append("apikey", process.env.NEXT_PUBLIC_OCR_API_KEY || "");
      form.append("language", "eng");

      const res = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data.IsErroredOnProcessing) {
        throw new Error(data.ErrorMessage?.[0] || "OCR failed");
      }
      console.log(data)
      const text = data.ParsedResults?.[0]?.ParsedText || "";
      setInputText(text);

      toast.success("Text extracted successfully!");

    } catch (err) {
        toast.error("Could not extract text from image.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col md:items-center md:justify-center min-h-screen  bg-emerald-50 md:px-6">
      <div className="max-w-5xl w-full bg-white p-6 shadow-[10px_10px_0px_black] rounded-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Analyze Your Ingredients
          </h1>
          <p className="text-gray-600 mt-2">
            Paste your ingredient list or upload a product label photo
          </p>
        </div>

        {error && (
          <div className="mb-4 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="flex block text-gray-800 font-bold mb-2">
              Ingredients List
            </label>
            <textarea
              value={inputText}
              onChange={handleChange}
              className="w-full h-48 p-3 rounded-xl border border-black focus:border-white focus:ring-2 focus:ring-emerald-400 outline-none text-gray-800"
              placeholder="Paste ingredients here... (e.g., Aqua, Glycerin, etc.)"
            />
          </div>

          <div className="w-full md:w-1/3">
            <label className=" flex block text-gray-800 font-bold mb-2">
              <Upload className="w-5 h-5 text-emerald-600 mr-2" /> 
              Upload Label Photo
            </label>
            <input
               id="ingredientInput"
  placeholder="upload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="w-full border border-gray-300 p-2 rounded-xl text-gray-800 shadow-[3px_3px_0px_black]
"
            />

            {previewUrl && (
              <div className="relative mt-3">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded-xl shadow-md object-contain"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute  top-2 right-2 bg-white p-1 shadow-[3px_3px_0px_black]
 hover:bg-gray-200"
                  aria-label="Remove image"
                >
                  <X size={18} className="text-red-600" />
                </button>
              </div>
            )}

            <button
              onClick={handleAnalyzeImage}
              disabled={loading}
              className="shadow-[3px_3px_0px_black]
 mt-4 w-full bg-emerald-500 text-white font-semibold py-2 rounded-xl hover:bg-emerald-600 transition disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Extract Ingredients"}
            </button>

            {!imageFile && (<>
              <p className="mt-2 text-sm text-gray-600 bg-emerald-50 p-2 rounded-lg">
                <span className="font-bold">Note:</span> Upload only the
                ingredient list. Avoid brand logos or unrelated text , Similar to below.
               
              </p>
              
              <div className="md:relative  md:w-full md:max-w-sm md:h-2 md:mx-auto py-1"><Image src="/images/ingr.jpg" width={170} alt="ingr"    height={0}    className="object-contain rounded" />
</div>
              </>
            )}

          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className={`flex  shadow-[4px_4px_0px_black] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 items-center text-base bg-emerald-600 text-white font-semibold py-3 px-2 md:px-6 rounded-xl  hover:bg-emerald-700 transition`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search mr-2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {analyze?<><Loader2 className="h-5 w-5 animate-spin pl-2" />Analyzing
</>:<>Analyze ingredients</>}
          </button>
        </div>
      </div>
    </section>
  );
}
