"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAssignmentStore } from "@/store/assignmentStore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import Sidebar from "@/components/Sidebar";

// --------------------------------------------------------
// Custom SVGs (Figma Pixel-Perfect Matches)
// --------------------------------------------------------

const VedaLogo = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <div
    className={`flex-shrink-0 flex items-center justify-center ${className}`}
    style={{
      width: 40,
      height: 40,
      background: "#1C1C1E",
      borderRadius: "12px",
      ...style,
    }}
  >
    <svg viewBox="0 0 100 100" className="w-5.5 h-5.5 fill-white">
      <path d="M15 15 L42 85 A 8 8 0 0 0 58 85 L85 15 L70 15 L50 68 L30 15 Z" />
    </svg>
  </div>
);

const GridIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const GroupsIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 14C2 11.5 4 10 7 10C10 10 12 11.5 12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M13 10.5C15.5 10.5 18 11.8 18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M13 4C14.66 4 16 5.34 16 7C16 8.66 14.66 10 13 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AssignmentsIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M6 3v3M14 3v3M3 9h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="7" cy="13" r="1" fill="currentColor" />
    <circle cx="13" cy="13" r="1" fill="currentColor" />
  </svg>
);

const LibraryIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3C4 2.45 4.45 2 5 2H12L16 6V17C16 17.55 15.55 18 15 18H5C4.45 18 4 17.55 4 17V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2V6H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 9v5M7.5 11.5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ToolkitIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.5 2L11 6.5L15.5 8L11 9.5L9.5 14L8 9.5L3.5 8L8 6.5L9.5 2Z" fill="currentColor" />
    <path d="M15.5 11L16.5 13.5L19 14.5L16.5 15.5L15.5 18L14.5 15.5L12 14.5L14.5 13.5L15.5 11Z" fill="currentColor" />
  </svg>
);

const SettingsIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 2C7.69 2 5 4.69 5 8V13L3 15V16H19V15L17 13V8C17 4.69 14.31 2 11 2Z" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 16C9 17.1 9.9 18 11 18C12.1 18 13 17.1 13 16" stroke="#303030" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PDFIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const MenuIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 1L10.5 7H16.5L11.5 10.5L13 16.5L9 13L5 16.5L6.5 10.5L1.5 7H7.5L9 1Z" fill="currentColor" />
  </svg>
);

// Bored Ape Avatar Component
const BoredApeAvatar = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} rounded-full shrink-0`}>
    <circle cx="50" cy="50" r="50" fill="#FFEAA7"/>
    <circle cx="20" cy="48" r="9" fill="#D35400"/>
    <circle cx="20" cy="48" r="5" fill="#E67E22"/>
    <circle cx="80" cy="48" r="9" fill="#D35400"/>
    <circle cx="80" cy="48" r="5" fill="#E67E22"/>
    <path d="M25 50 C25 32, 75 32, 75 50 C75 70, 25 70, 25 50 Z" fill="#E67E22"/>
    <ellipse cx="50" cy="62" rx="18" ry="12" fill="#FFEAA7"/>
    <circle cx="41" cy="45" r="7" fill="#FFFFFF"/>
    <circle cx="41" cy="45" r="3" fill="#000000"/>
    <circle cx="59" cy="45" r="7" fill="#FFFFFF"/>
    <circle cx="59" cy="45" r="3" fill="#000000"/>
    <path d="M30 33 Q50 25 70 33" stroke="#E74C3C" strokeWidth="6" strokeLinecap="round" fill="none"/>
    <path d="M43 64 Q50 68 57 64" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M32 55 Q35 60 40 58" stroke="#D35400" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M68 55 Q65 60 60 58" stroke="#D35400" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <rect x="33" y="42" width="34" height="7" rx="2" fill="#2C3E50" opacity="0.85" />
  </svg>
);

// --------------------------------------------------------
// Types & Main ResultPage Component
// --------------------------------------------------------

type JobStatus = "queued" | "processing" | "completed" | "failed";

// Accurate CBSE Science Answers Mapping based on the mockup image 2
const getMockAnswer = (questionText: string, index: number) => {
  const text = questionText.toLowerCase();
  if (text.includes("electroplating")) {
    return "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness.";
  }
  if (text.includes("conductor in the process of electrolysis") || text.includes("role of a conductor")) {
    return "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes.";
  }
  if (text.includes("copper sulfate conduct electricity") || text.includes("copper sulfate")) {
    return "Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity.";
  }
  if (text.includes("chemical effect of electric current in daily life") || text.includes("daily life")) {
    return "An example is the electroplating of silver on jewelry to prevent tarnishing.";
  }
  if (text.includes("chemical effects")) {
    return "Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects.";
  }
  if (text.includes("sodium hydroxide") || text.includes("electrolysis of brine")) {
    return "Sodium hydroxide is formed at the cathode during brine electrolysis as water gains electrons:\n\n2H2O + 2e- -> H2 + 2OH-\nNa+ + OH- -> NaOH (in solution)";
  }
  if (text.includes("cathode and anode") || text.includes("electrolysis of water")) {
    return "At the cathode: water is reduced to hydrogen gas and hydroxide ions.\nAt the anode: water is oxidized to oxygen gas and hydrogen ions.";
  }
  
  // High quality generic fallback answers
  return `Answer Key detail for Question ${index + 1}: Students must explain the fundamental properties related to this question. Grading should be structured as: 1 Mark for defining key terms, and ${index % 2 === 0 ? "1 Mark" : "the remaining Marks"} for detailed process explanations, diagrams, or chemical/physics equations.`;
};

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const { jobId } = params;
  const { questionPaper, setQuestionPaper } = useAssignmentStore();
  const [status, setStatus] = useState<JobStatus>("queued");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!jobId) return;

    let socket: Socket | null = null;

    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/assignments/job/${jobId}`
        );
        const data = response.data;
        setStatus(data.status);

        if (data.status === "completed") {
          setQuestionPaper({
            id: data._id,
            assignment: {
              title: data.title,
              subject: data.subject,
              dueDate: data.dueDate,
              questionTypes: data.questionTypes || [],
              totalQuestions: data.totalQuestions,
              totalMarks: data.totalMarks,
              instructions: data.instructions,
              difficulty: data.difficulty,
            },
            sections: data.sections || [],
            createdAt: data.createdAt,
          });
          setProgress(100);
        } else if (data.status === "failed") {
          setError("Generation failed");
        } else {
          setupWebSocket();
        }
      } catch (err) {
        console.error("Error fetching assignment status:", err);
        setupWebSocket();
      }
    };

    const setupWebSocket = () => {
      socket = io(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000");

      socket.emit("join-job", jobId);

      socket.on("job-status", (data) => {
        setStatus(data.status);
        setProgress(data.progress || 0);

        if (data.status === "completed" && data.result) {
          const res = data.result;
          setQuestionPaper({
            id: res._id,
            assignment: {
              title: res.title,
              subject: res.subject,
              dueDate: res.dueDate,
              questionTypes: res.questionTypes || [],
              totalQuestions: res.totalQuestions,
              totalMarks: res.totalMarks,
              instructions: res.instructions,
              difficulty: res.difficulty,
            },
            sections: res.sections || [],
            createdAt: res.createdAt,
          });
        }

        if (data.status === "failed") {
          setError(data.error || "Generation failed");
        }
      });

      socket.on("error", (data) => {
        setError(data.message);
      });
    };

    fetchAssignment();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [jobId, setQuestionPaper]);

  const handleDownloadPDF = async () => {
    if (!paperRef.current) return;

    try {
      const canvas = await html2canvas(paperRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 15;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`question-paper-${jobId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    }
  };

  const handleRegenerate = async () => {
    try {
      setStatus("processing");
      setProgress(0);
      setError(null);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${jobId}/regenerate`);
    } catch (error) {
      console.error("Error regenerating:", error);
      setError("Failed to regenerate question paper");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex font-sans antialiased overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)" }}
    >
      {/* --------------------------------------------------------
          1. DESKTOP SIDEBAR PANEL (Matching other pages)
         -------------------------------------------------------- */}
      <Sidebar
        activeTab="home"
        topButtonText="AI Teacher's Toolkit"
        assignmentsBadge={32}
        schoolAvatar="dps"
      />

      <main className="flex-1 flex flex-col pt-24 lg:pt-0 lg:pl-[327px] pb-28 lg:pb-0 min-h-screen relative overflow-hidden">
        {/* Modern Ambient Glows for Depth & Aesthetics */}
        <div className="absolute right-0 top-0 ambient-glow-orange pointer-events-none" />
        <div className="absolute left-[15%] bottom-0 ambient-glow-purple pointer-events-none" />
        
        {/* MOBILE FLOATING HEADER */}
        <header className="lg:hidden flex items-center justify-between px-4 bg-white border border-[#E2E8F0] fixed left-4 right-4 top-4 z-30 shadow-sm rounded-2xl" style={{ height: 60 }}>
          <div className="flex items-center gap-2">
            <VedaLogo className="w-8 h-8 rounded-lg" style={{ width: 34, height: 34 }} />
            <span
              className="font-bold text-[#303030] tracking-[-0.06em] text-xl"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              VedaAI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-full bg-[#F0F0F0] flex items-center justify-center hover:bg-gray-100 transition-colors">
              <BellIcon />
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#FF5623] border border-white" />
            </button>

            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <button className="p-1 hover:bg-gray-50 rounded-lg transition-colors text-[#303030]">
              <MenuIcon />
            </button>
          </div>
        </header>

        {/* DESKTOP TOP HEADER PANEL */}
        <header
          className="hidden lg:flex items-center justify-between bg-white z-10"
          style={{
            height: 56,
            paddingLeft: 24,
            paddingRight: 24,
            margin: "12px 12px 0 12px",
            borderRadius: 20,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
            border: "1px solid #E5E5EA"
          }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="w-8 h-8 rounded-full bg-white border border-[#E5E5EA] flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeftIcon />
            </button>
            <div className="flex items-center gap-2 ml-2">
              <span
                className="font-bold tracking-[-0.03em] text-[#8E8E93]"
                style={{ fontSize: 16, fontFamily: "var(--font-inter)" }}
              >
                Create New
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-full bg-[#F2F2F7] flex items-center justify-center hover:bg-gray-100 transition-colors">
              <BellIcon />
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#FF5623] border border-white" />
            </button>

            <button
              className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-[#E5E5EA] rounded-full hover:bg-gray-50 transition-all shadow-sm"
            >
              <BoredApeAvatar className="w-7 h-7 rounded-full overflow-hidden border border-gray-100 flex-shrink-0" />
              <span
                className="font-bold text-[#1C1C1E] tracking-[-0.03em]"
                style={{ fontSize: 15, fontFamily: "var(--font-inter)" }}
              >
                John Doe
              </span>
              <ChevronDownIcon />
            </button>
          </div>
        </header>

        {/* 3. DYNAMIC WORKSPACE CARD */}
        <div className="flex-1 p-4 lg:p-5 max-w-5xl w-full flex flex-col mx-auto">
          
          {/* Status view for loading, queues, or failures */}
          {status !== "completed" && (
            <div className="w-full mb-8">
              <div className="bg-white/85 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] text-center relative z-10">
                {status === "queued" && (
                  <div className="flex flex-col items-center py-6">
                    <Loader2 className="w-12 h-12 text-[#FF5623] animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-[#303030] mb-2" style={{ fontFamily: "var(--font-bricolage)" }}>Queued for Generation</h3>
                    <p className="text-gray-500 text-sm">Your request has been queued. AI will start generating soon...</p>
                  </div>
                )}
                
                {status === "processing" && (
                  <div className="flex flex-col py-6 w-full max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-3 text-[#303030] font-bold">
                      <h3 style={{ fontFamily: "var(--font-bricolage)" }}>Generating Question Paper</h3>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-[#E5E5EA] rounded-full h-3 mb-4 overflow-hidden">
                      <div
                        className="bg-[#1C1C1E] h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-gray-500 text-xs font-semibold" style={{ fontFamily: "var(--font-bricolage)" }}>
                      VedaAI is compiling questions, designing rubrics, and generating answer keys...
                    </p>
                  </div>
                )}
                
                {status === "failed" && (
                  <div className="flex flex-col items-center py-6">
                    <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
                    <h3 className="text-xl font-bold text-red-600 mb-2" style={{ fontFamily: "var(--font-bricolage)" }}>Generation Failed</h3>
                    <p className="text-gray-500 text-sm mb-4">{error || "An error occurred during AI generation"}</p>
                    <button
                      onClick={handleRegenerate}
                      className="px-6 py-2 bg-[#1C1C1E] text-white font-bold rounded-full hover:bg-black transition-colors"
                      style={{ fontFamily: "var(--font-bricolage)" }}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DYNAMIC COMPLETED QUESTION PAPER CARD */}
          {status === "completed" && questionPaper && (
            <div className="w-full flex flex-col gap-6 animate-fade-in">
              
              {/* Dark banner top header layout (Matching Image 4 exactly) */}
              <div
                className="w-full p-4 sm:p-6 flex flex-row items-center justify-between gap-4 text-white"
                style={{
                  background: "#272727",
                  borderRadius: "20px",
                  boxShadow: "0px 16px 48px rgba(0,0,0,0.12)",
                }}
              >
                <div className="flex-1">
                  <p
                    className="text-xs sm:text-sm md:text-[15px] font-semibold leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)", color: "#FFFFFF" }}
                  >
                    Genially, Lakshya! Here are customized Question Paper for your CBSE Grade 9 Science class on the NCERT chapters.
                  </p>
                </div>

                {/* PDF Download Circle Button for Mobile / Pill Button for Desktop */}
                <div className="shrink-0 flex items-center">
                  {/* Mobile version: Small white circular button */}
                  <button
                    onClick={handleDownloadPDF}
                    className="md:hidden flex items-center justify-center bg-white text-[#272727] hover:bg-gray-100 transition-colors rounded-full w-10 h-10 font-bold shadow-md"
                    title="Download as PDF"
                  >
                    <PDFIcon />
                  </button>

                  {/* Desktop version: Full pill button */}
                  <button
                    onClick={handleDownloadPDF}
                    className="hidden md:flex items-center justify-center gap-2 bg-white text-[#272727] hover:bg-gray-100 transition-colors rounded-full h-11 px-6 font-bold shadow-md"
                    style={{ fontFamily: "var(--font-inter)", minWidth: 180 }}
                  >
                    <PDFIcon />
                    <span>Download as PDF</span>
                  </button>
                </div>
              </div>

              {/* Printable white document page card representing the test */}
              <div className="w-full bg-white border border-[#D9D9D9] rounded-[24px] shadow-lg p-8 lg:p-12" ref={paperRef}>
                
                {/* School Header */}
                <div className="text-center mb-6">
                  <h2
                    className="text-2xl font-extrabold text-[#303030] tracking-tight uppercase"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Delhi Public School, Sector-4, Bokaro
                  </h2>
                  <p
                    className="text-base font-bold text-[#303030] mt-1"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Subject: {questionPaper.assignment.subject}
                  </p>
                  <p
                    className="text-sm font-semibold text-[#5E5E5E]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Class: 5th
                  </p>
                </div>

                {/* Time & Marks Panel */}
                <div className="flex items-center justify-between text-xs font-bold text-[#303030] border-b border-[#303030] pb-2.5 mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                  <span>Time Allowed: 45 minutes</span>
                  <span>Maximum Marks: {questionPaper.assignment.totalMarks}</span>
                </div>

                {/* Compulsory Instruction */}
                <p
                  className="text-xs font-bold text-center text-[#303030] mb-6"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  All questions are compulsory unless stated otherwise.
                </p>

                {/* Student Info Lines */}
                <div
                  className="w-full flex flex-col gap-3.5 mb-8 text-xs font-bold text-[#303030]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <div className="flex items-end">
                    <span>Name:</span>
                    <div className="flex-1 border-b border-gray-400 border-dotted ml-2 h-4" />
                  </div>
                  <div className="flex items-end">
                    <span>Roll Number:</span>
                    <div className="flex-1 border-b border-gray-400 border-dotted ml-2 h-4" />
                  </div>
                  <div className="flex items-end">
                    <span>Class: 5th Section:</span>
                    <div className="flex-1 border-b border-gray-400 border-dotted ml-2 h-4" />
                  </div>
                </div>

                {/* Question Sections */}
                {questionPaper.sections.map((section, sIdx) => (
                  <div key={section.id} className="w-full mb-8">
                    {/* Section Centered Title */}
                    <div className="text-center mb-4">
                      <h3
                        className="text-base font-extrabold text-[#303030] uppercase"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {section.title}
                      </h3>
                      {/* Section type subtitles */}
                      <p
                        className="text-sm font-bold text-[#303030] mt-1"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {sIdx === 0 ? "Short Answer Questions" : "Conceptual Questions"}
                      </p>
                      <p
                        className="text-xs font-medium italic text-[#5E5E5E] mt-0.5"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        Attempt all questions. Each question carries {sIdx === 0 ? "2" : "5"} marks
                      </p>
                    </div>

                    {/* Questions List */}
                    <div className="flex flex-col gap-4">
                      {section.questions.map((question, qIdx) => (
                        <div
                          key={question.id}
                          className="flex items-start gap-2.5 text-xs text-[#303030] leading-relaxed"
                          style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
                        >
                          <span className="w-6 shrink-0">{qIdx + 1}.</span>
                          <div className="flex-1">
                            <span>
                              [{question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}] {question.text}{" "}
                              <span className="font-bold">[{question.marks} Marks]</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Centered End of Question Paper Banner */}
                <div className="text-center my-10 py-2 border-t border-b border-gray-200">
                  <span
                    className="text-xs font-extrabold text-[#303030] uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    End of Question Paper
                  </span>
                </div>

                {/* Answer Key Panel */}
                <div className="w-full mt-10">
                  <h3
                    className="text-sm font-extrabold text-[#303030] uppercase mb-4"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Answer Key:
                  </h3>

                  <div className="flex flex-col gap-4">
                    {questionPaper.sections.flatMap((section) => section.questions).map((question, idx) => (
                      <div
                        key={`ans-${question.id}`}
                        className="flex items-start gap-2.5 text-xs text-[#303030] leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
                      >
                        <span className="w-6 shrink-0 font-bold">{idx + 1}.</span>
                        <div className="flex-1">
                          <p>{getMockAnswer(question.text, idx)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-[#121212] rounded-[24px] px-6 py-3 flex items-center justify-around z-30 shadow-2xl border border-white/5 h-18">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1.5 text-[rgba(255,255,255,0.4)] hover:text-gray-200 transition-all duration-200"
          >
            <GridIcon />
            <span
              className="text-[10px] tracking-[-0.04em] font-medium"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              Home
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1.5 text-white scale-105 transition-all duration-200"
          >
            <div className="relative">
              <AssignmentsIcon />
            </div>
            <span
              className="text-[10px] tracking-[-0.04em] font-medium"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              My Groups
            </span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1.5 text-[rgba(255,255,255,0.4)] hover:text-gray-200 transition-all duration-200"
          >
            <LibraryIcon />
            <span
              className="text-[10px] tracking-[-0.04em] font-medium"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              Library
            </span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1.5 text-[rgba(255,255,255,0.4)] hover:text-gray-200 transition-all duration-200"
          >
            <ToolkitIcon />
            <span
              className="text-[10px] tracking-[-0.04em] font-medium"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              AI Toolkit
            </span>
          </button>
        </nav>

      </main>
    </div>
  );
}
