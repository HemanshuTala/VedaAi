"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAssignmentStore } from "@/store/assignmentStore";
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

const PlusIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 1L10.5 7H16.5L11.5 10.5L13 16.5L9 13L5 16.5L6.5 10.5L1.5 7H7.5L9 1Z" fill="currentColor" />
  </svg>
);

const MenuIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Bored Ape Avatar Component (Figma Exact Match)
const BoredApeAvatar = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} rounded-full shrink-0`}>
    <circle cx="50" cy="50" r="50" fill="#FFEAA7"/>
    {/* Ears */}
    <circle cx="20" cy="48" r="9" fill="#D35400"/>
    <circle cx="20" cy="48" r="5" fill="#E67E22"/>
    <circle cx="80" cy="48" r="9" fill="#D35400"/>
    <circle cx="80" cy="48" r="5" fill="#E67E22"/>
    {/* Ape head */}
    <path d="M25 50 C25 32, 75 32, 75 50 C75 70, 25 70, 25 50 Z" fill="#E67E22"/>
    <ellipse cx="50" cy="62" rx="18" ry="12" fill="#FFEAA7"/>
    {/* Big round eyes */}
    <circle cx="41" cy="45" r="7" fill="#FFFFFF"/>
    <circle cx="41" cy="45" r="3" fill="#000000"/>
    <circle cx="59" cy="45" r="7" fill="#FFFFFF"/>
    <circle cx="59" cy="45" r="3" fill="#000000"/>
    {/* Red headband / cap */}
    <path d="M30 33 Q50 25 70 33" stroke="#E74C3C" strokeWidth="6" strokeLinecap="round" fill="none"/>
    {/* Mouth */}
    <path d="M43 64 Q50 68 57 64" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* Cheek outline */}
    <path d="M32 55 Q35 60 40 58" stroke="#D35400" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M68 55 Q65 60 60 58" stroke="#D35400" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Glasses */}
    <rect x="33" y="42" width="34" height="7" rx="2" fill="#2C3E50" opacity="0.85" />
  </svg>
);

// Cloud Upload Icon
const CloudUploadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#303030]">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// Calendar Icon
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Mic Icon
const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8" />
  </svg>
);

// X Close Icon
const XIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// --------------------------------------------------------
// Types & Form Definitions
// --------------------------------------------------------

interface QuestionTypeRow {
  id: string;
  type: string;
  count: number;
  marks: number;
}

const questionTypeOptions = [
  { value: "multiple-choice", label: "Multiple Choice Questions" },
  { value: "short-answer", label: "Short Questions" },
  { value: "diagram-graph", label: "Diagram/Graph-Based Questions" },
  { value: "numerical", label: "Numerical Problems" },
];

export default function CreateAssignment() {
  const router = useRouter();
  const { setAssignment, setJobId } = useAssignmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");

  // Dynamic question type rows matching the mockup design defaults
  const [rows, setRows] = useState<QuestionTypeRow[]>([
    { id: "1", type: "multiple-choice", count: 4, marks: 1 },
    { id: "2", type: "short-answer", count: 3, marks: 2 },
    { id: "3", type: "diagram-graph", count: 5, marks: 5 },
    { id: "4", type: "numerical", count: 5, marks: 5 },
  ]);

  // File Upload Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // Row operations
  const handleIncrementCount = (id: string) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, count: row.count + 1 } : row)));
  };

  const handleDecrementCount = (id: string) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, count: Math.max(1, row.count - 1) } : row)));
  };

  const handleIncrementMarks = (id: string) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, marks: row.marks + 1 } : row)));
  };

  const handleDecrementMarks = (id: string) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, marks: Math.max(1, row.marks - 1) } : row)));
  };

  const handleTypeChange = (id: string, newType: string) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, type: newType } : row)));
  };

  const deleteRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now().toString(),
        type: "multiple-choice",
        count: 1,
        marks: 1,
      },
    ]);
  };

  // Dynamic calculations
  const totalQuestions = rows.reduce((acc, row) => acc + row.count, 0);
  const totalMarks = rows.reduce((acc, row) => acc + row.count * row.marks, 0);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rows.length === 0) {
      alert("Please add at least one question type");
      return;
    }
    if (!dueDate) {
      alert("Please select a due date");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Auto-generate title and subject to satisfy schema requirements
      const defaultTitle = uploadedFile
        ? uploadedFile.name.substring(0, uploadedFile.name.lastIndexOf(".")) || uploadedFile.name
        : `Assignment - ${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}`;

      const defaultSubject = "General";

      formData.append("title", defaultTitle);
      formData.append("subject", defaultSubject);
      formData.append("dueDate", dueDate);

      // Collect questionTypes names
      const qTypes = rows.map((r) => r.type);
      formData.append("questionTypes", JSON.stringify(qTypes));

      formData.append("totalQuestions", totalQuestions.toString());
      formData.append("totalMarks", totalMarks.toString());
      formData.append("difficulty", "mixed");

      if (instructions) {
        formData.append("instructions", instructions);
      }
      if (uploadedFile) {
        formData.append("file", uploadedFile);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/assignments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Save to Zustand store
      setAssignment({
        title: defaultTitle,
        subject: defaultSubject,
        dueDate: dueDate,
        questionTypes: qTypes,
        totalQuestions: totalQuestions,
        totalMarks: totalMarks,
        instructions: instructions,
        difficulty: "mixed",
      });

      setJobId(response.data.jobId);
      router.push(`/result/${response.data.jobId}`);
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex font-sans antialiased overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)" }}
    >
      {/* --------------------------------------------------------
          1. DESKTOP SIDEBAR PANEL (Matching page.tsx layout)
         -------------------------------------------------------- */}
      <Sidebar
        activeTab="assignments"
        libraryBadge={32}
      />

      {/* --------------------------------------------------------
          2. WORKSPACE CONTAINER
         -------------------------------------------------------- */}
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
                Assignment
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

        {/* --------------------------------------------------------
            3. CREATE ASSIGNMENT FORM & CONTENT
           -------------------------------------------------------- */}
        <form onSubmit={onSubmit} className="flex-1 p-4 lg:p-5 max-w-5xl w-full flex flex-col mx-auto">
          
          {/* A. TITLE AND PROGRESS BAR SECTION */}
          <div className="w-full flex flex-col mb-6 px-1">
            {/* Title (Desktop) */}
            <div className="hidden lg:flex items-center justify-between gap-4 w-full mb-6">
              <div>
                <h1
                  className="text-[28px] font-extrabold text-[#1C1C1E] tracking-tight flex items-center gap-2.5"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  <span className="inline-block w-3.5 h-3.5 bg-[#4ADE80] rounded-full border-2 border-white shadow-sm" />
                  Create Assignment
                </h1>
                <p className="text-xs text-[#666666] mt-1 font-semibold">
                  Set up a new assignment for your students
                </p>
              </div>
            </div>

            {/* Subheader: Back Button + Centered Title (Mobile) */}
            <div className="lg:hidden flex items-center relative w-full mb-6">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200"
              >
                <ArrowLeftIcon />
              </button>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  className="font-bold text-[#303030] text-[17px] tracking-[-0.04em]"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Create Assignment
                </span>
              </div>
            </div>

            {/* Horizontal Step Progress Indicator */}
            <div className="w-full max-w-md mx-auto flex items-center gap-1.5 h-1.5 mb-2">
              <div className="flex-1 h-full rounded-full bg-[#303030]" />
              <div className="flex-1 h-full rounded-full bg-[#E5E5EA]" />
            </div>
          </div>

          {/* B. MAIN FORM CARD (Glassmorphism layout) */}
          <div className="flex-1 bg-white/85 backdrop-blur-md border border-white/50 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-5 lg:p-10 flex flex-col relative overflow-hidden z-10">
            
            {/* Header inside the Card */}
            <div className="mb-8">
              <h2
                className="text-xl font-bold text-[#303030] tracking-[-0.04em]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Assignment Details
              </h2>
              <p
                className="text-[rgba(94,94,94,0.8)] text-xs font-medium tracking-[-0.04em] mt-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Basic information about your assignment
              </p>
            </div>

            {/* Drag & Drop File Upload Area */}
            <div className="w-full mb-8">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[20px] p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${
                  isDragActive
                    ? "border-[#FF5623] bg-orange-50/20"
                    : "border-[#D9D9D9] bg-[#FDFDFD] hover:border-gray-400"
                }`}
                style={{ minHeight: 180 }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.txt"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center shadow-sm">
                  <CloudUploadIcon />
                </div>

                <div className="flex flex-col gap-1">
                  <span
                    className="font-bold text-[#303030] text-sm tracking-[-0.04em]"
                    style={{ fontFamily: "var(--font-bricolage)" }}
                  >
                    {uploadedFile ? uploadedFile.name : "Choose a file or drag & drop it here"}
                  </span>
                  <span
                    className="text-[#8E8E93] text-xs font-semibold"
                    style={{ fontFamily: "var(--font-bricolage)" }}
                  >
                    JPEG, PNG, upto 10MB
                  </span>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 bg-[#F0F0F0] hover:bg-gray-200 transition-colors text-xs font-bold text-[#303030] rounded-full shadow-sm"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Browse Files
                </button>
              </div>
              <p
                className="text-[#8E8E93] text-xs text-center mt-2.5 font-medium tracking-[-0.04em]"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                Upload images of your preferred document/image
              </p>
            </div>

            {/* Due Date Input field */}
            <div className="w-full mb-8 flex flex-col gap-2.5">
              <label
                className="font-bold text-[#303030] text-sm tracking-[-0.04em]"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                Due Date
              </label>
              <div className="relative w-full">
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="premium-input w-full px-4 py-3 bg-[#F2F2F7] border border-transparent rounded-[12px] text-sm text-[#303030] outline-none font-semibold"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#8E8E93]">
                  <CalendarIcon />
                </span>
              </div>
            </div>

            {/* Question Type configuration section */}
            <div className="w-full mb-8">
              <label
                className="font-bold text-[#303030] text-sm tracking-[-0.04em] block mb-4"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                Question Type
              </label>

              {/* ----------------------------------------------------
                  QUESTION TYPES: DESKTOP TABLE VIEW
                 ---------------------------------------------------- */}
              <div className="hidden lg:block w-full">
                {/* Headers */}
                <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 text-xs font-bold text-[#8E8E93] uppercase tracking-wider mb-4" style={{ fontFamily: "var(--font-bricolage)" }}>
                  <div className="col-span-6">Question Type</div>
                  <div className="col-span-3 text-center">No. of Questions</div>
                  <div className="col-span-3 text-center">Marks</div>
                </div>

                {/* Rows */}
                <div className="flex flex-col gap-4">
                  {rows.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-4 items-center">
                      {/* Select Dropdown & Delete Icon */}
                      <div className="col-span-6 flex items-center gap-3">
                        <div className="relative flex-1">
                          <select
                            value={row.type}
                            onChange={(e) => handleTypeChange(row.id, e.target.value)}
                            className="premium-input w-full pl-4 pr-10 py-2.5 bg-white border border-[#D9D9D9] rounded-xl text-sm font-semibold text-[#303030] outline-none appearance-none"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {questionTypeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <span className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-gray-500">
                            <ChevronDownIcon />
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => deleteRow(row.id)}
                          disabled={rows.length <= 1}
                          className={`p-1.5 rounded-lg border border-[#D9D9D9] text-[#8E8E93] hover:bg-gray-50 transition-colors ${
                            rows.length <= 1 ? "opacity-40 cursor-not-allowed" : ""
                          }`}
                        >
                          <XIcon />
                        </button>
                      </div>

                      {/* No. of Questions Counter */}
                      <div className="col-span-3 flex justify-center">
                        <div className="flex items-center bg-[#F2F2F7] rounded-xl p-1.5 border border-transparent">
                          <button
                            type="button"
                            onClick={() => handleDecrementCount(row.id)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200/50 rounded-lg text-sm"
                          >
                            —
                          </button>
                          <span
                            className="w-12 text-center font-bold text-sm text-[#303030]"
                            style={{ fontFamily: "var(--font-bricolage)" }}
                          >
                            {row.count}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrementCount(row.id)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200/50 rounded-lg text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Marks Counter */}
                      <div className="col-span-3 flex justify-center">
                        <div className="flex items-center bg-[#F2F2F7] rounded-xl p-1.5 border border-transparent">
                          <button
                            type="button"
                            onClick={() => handleDecrementMarks(row.id)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200/50 rounded-lg text-sm"
                          >
                            —
                          </button>
                          <span
                            className="w-12 text-center font-bold text-sm text-[#303030]"
                            style={{ fontFamily: "var(--font-bricolage)" }}
                          >
                            {row.marks}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrementMarks(row.id)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200/50 rounded-lg text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* ----------------------------------------------------
                  QUESTION TYPES: MOBILE CARD LIST VIEW
                 ---------------------------------------------------- */}
              <div className="lg:hidden flex flex-col gap-4 w-full">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="premium-card rounded-[20px] p-4 flex flex-col gap-4 relative"
                  >
                    {/* Header: Dropdown select & Delete X button */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="relative flex-1">
                        <select
                          value={row.type}
                          onChange={(e) => handleTypeChange(row.id, e.target.value)}
                          className="premium-input w-full pl-3 pr-8 py-2 bg-white border border-[#D9D9D9] rounded-xl text-sm font-semibold text-[#303030] outline-none appearance-none"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {questionTypeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <span className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-gray-500">
                          <ChevronDownIcon />
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteRow(row.id)}
                        disabled={rows.length <= 1}
                        className={`p-1.5 rounded-lg border border-[#E5E5EA] text-[#8E8E93] hover:bg-gray-50 transition-colors ${
                          rows.length <= 1 ? "opacity-40 cursor-not-allowed" : ""
                        }`}
                      >
                        <XIcon />
                      </button>
                    </div>

                    {/* Subrow: No. of Questions and Marks */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-[#F2F2F7] rounded-2xl border border-transparent">
                      {/* Left: No. of Questions */}
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className="text-[10px] uppercase font-bold text-gray-400 tracking-wider"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          No. of Questions
                        </span>
                        <div className="flex items-center mt-1">
                          <button
                            type="button"
                            onClick={() => handleDecrementCount(row.id)}
                            className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200/50 rounded-lg text-xs"
                          >
                            —
                          </button>
                          <span
                            className="w-8 text-center font-bold text-sm text-[#303030]"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {row.count}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrementCount(row.id)}
                            className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200/50 rounded-lg text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Right: Marks */}
                      <div className="flex flex-col items-center gap-1 border-l border-gray-200">
                        <span
                          className="text-[10px] uppercase font-bold text-gray-400 tracking-wider"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          Marks
                        </span>
                        <div className="flex items-center mt-1">
                          <button
                            type="button"
                            onClick={() => handleDecrementMarks(row.id)}
                            className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200/50 rounded-lg text-xs"
                          >
                            —
                          </button>
                          <span
                            className="w-8 text-center font-bold text-sm text-[#303030]"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {row.marks}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrementMarks(row.id)}
                            className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200/50 rounded-lg text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Add Question Type Button */}
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 mt-4 text-sm font-bold text-[#303030] hover:text-[#181818] transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <div className="w-7 h-7 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center shadow-sm">
                  <PlusIcon size={14} />
                </div>
                <span>Add Question Type</span>
              </button>

              {/* Summary Calculations */}
              <div
                className="mt-6 flex flex-col items-end gap-1.5 text-sm font-bold text-[#303030]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span>Total Questions : {totalQuestions}</span>
                <span>Total Marks : {totalMarks}</span>
              </div>
            </div>

            {/* Additional Information textarea */}
            <div className="w-full mb-6 flex flex-col gap-2.5">
              <label
                className="font-bold text-[#303030] text-sm tracking-[-0.04em]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Additional Information (For better output)
              </label>
              <div className="relative w-full">
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={4}
                  className="premium-input w-full px-4 py-3 bg-[#F2F2F7] border border-transparent rounded-[12px] text-sm text-[#303030] outline-none font-semibold resize-none placeholder-gray-400"
                  style={{ fontFamily: "var(--font-inter)" }}
                  placeholder="e.g. Generate a question paper for 3 hour exam duration..."
                />
                <button
                  type="button"
                  className="absolute right-4 bottom-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <MicIcon />
                </button>
              </div>
            </div>

          </div>

          {/* C. BOTTOM NAVIGATION CONTROLS */}
          <div className="mt-6 flex items-center justify-between w-full px-1">
            {/* Previous */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 text-[#303030] font-bold bg-white border border-[#D9D9D9] rounded-full h-11 px-6 shadow-sm hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "var(--font-inter)", minWidth: 120 }}
            >
              <ArrowLeftIcon />
              <span>Previous</span>
            </button>

            {/* Next (Submit) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 text-white font-bold bg-[#1C1C1E] hover:bg-black rounded-full h-11 px-7 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-inter)", minWidth: 120 }}
            >
              <span>{isSubmitting ? "Generating..." : "Next"}</span>
              {!isSubmitting && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

        </form>

        {/* MOBILE BOTTOM NAVIGATION BAR - FIGMA EXACT DARK THEME */}
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
