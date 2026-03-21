import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Image, X, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ScanPage = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    // Simulate analysis, then navigate to results
    setTimeout(() => {
      navigate("/app/results");
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">Scan Document</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Take a photo or upload a medical bill, EOB, or insurance card
        </p>
      </div>

      <div className="px-5">
        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              {/* Camera option */}
              <label className="bg-card rounded-2xl p-6 shadow-card flex flex-col items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-card">
                  <Camera size={28} className="text-primary-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Take a Photo</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Use your camera to capture the document</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>

              {/* Upload option */}
              <label className="bg-card rounded-2xl p-6 shadow-card flex flex-col items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                  <Upload size={28} className="text-secondary-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Upload from Gallery</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Choose an existing photo or PDF</p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>

              {/* Supported formats */}
              <div className="flex items-center justify-center gap-4 mt-2">
                {["Medical Bills", "EOBs", "Insurance Cards"].map((type) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <FileText size={12} className="text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{type}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Image preview */}
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src={preview}
                  alt="Scanned document"
                  className="w-full max-h-80 object-cover"
                />
                <button
                  onClick={() => setPreview(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/60 backdrop-blur-sm flex items-center justify-center"
                >
                  <X size={16} className="text-primary-foreground" />
                </button>
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-elevated flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-70"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Image size={18} />
                    Analyze Document
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScanPage;
