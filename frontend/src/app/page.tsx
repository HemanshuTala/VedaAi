"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, MoreVertical, Trash2, Eye } from "lucide-react";
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

// --------------------------------------------------------
// Empty State Illustration Component
// --------------------------------------------------------
const EmptyIllustration = () => (
  <div className="relative w-[300px] h-[300px] flex items-center justify-center">
    {/* Background circle */}
    <div
      className="absolute rounded-full"
      style={{
        width: 240,
        height: 240,
        background: "linear-gradient(179.67deg, #F2F2F2 -15.9%, #EFEFEF 158.68%)",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />

    {/* Document card */}
    <div
      className="absolute rounded-2xl bg-white"
      style={{
        width: 124,
        height: 155,
        left: "50%",
        top: "50%",
        transform: "translate(calc(-50% + 1px), calc(-50% - 9px))",
        boxShadow: "0px 20px 30px rgba(146, 146, 146, 0.19)",
      }}
    >
      <div className="flex flex-col gap-[18px] p-4 pt-5">
        {/* Title bar */}
        <div className="h-[10px] w-[50px] rounded-full bg-[#011625]" />
        {/* Text lines */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[10px] w-full rounded-full bg-[#D5D5D5]" />
        ))}
      </div>
    </div>

    {/* Magnifying glass overlay */}
    <div
      className="absolute"
      style={{
        width: 152,
        height: 152,
        left: "50%",
        top: "50%",
        transform: "translate(calc(-50% + 35px), calc(-50% + 13px))",
      }}
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: "#CCC6D9" }}
      />
      {/* Inner gradient circle */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 8,
          background: "linear-gradient(158.92deg, #FFFFFF 13.91%, #FFADAD 122.3%)",
        }}
      />
      {/* Glass overlay */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 6,
          background: "rgba(255,255,255,0.3)",
          backdropFilter: "blur(4px)",
        }}
      />
      {/* Red X */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: 50,
          height: 50,
          background: "#FF4040",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <line x1="6" y1="6" x2="16" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="6" x2="6" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      {/* Handle */}
      <div
        className="absolute"
        style={{
          width: 14,
          height: 44,
          background: "#E1DCEB",
          borderRadius: 8,
          right: -6,
          bottom: -22,
          transform: "rotate(-45deg)",
        }}
      />
    </div>

    {/* Cloud widget */}
    <div
      className="absolute flex items-center gap-2 bg-white rounded-xl px-2 py-1"
      style={{
        right: 12,
        top: 52,
        boxShadow: "6px 4px 13px rgba(27, 119, 139, 0.09)",
        width: 70,
        height: 40,
      }}
    >
      <div className="w-3 h-3 rounded-full bg-[#CCC6D9]" />
      <div className="flex-1 h-3 rounded-full bg-[#D5D5D5]" />
    </div>

    {/* Decorative doodle */}
    <svg
      className="absolute"
      style={{ left: 10, top: 50 }}
      width="82"
      height="74"
      viewBox="0 0 82 74"
      fill="none"
    >
      <path
        d="M10 60C20 40 40 20 60 10C70 5 80 5 75 20C70 35 50 50 30 58C15 64 5 68 10 60Z"
        fill="#011625"
        opacity="0.08"
      />
    </svg>

    {/* Blue dot */}
    <div
      className="absolute w-3 h-3 rounded-full bg-[#417BA4]"
      style={{ right: 28, bottom: 68 }}
    />

    {/* Sparkle */}
    <svg
      className="absolute"
      style={{ left: 36, bottom: 32 }}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M12 2L13.8 9H20L14.5 13L16.5 20L12 16L7.5 20L9.5 13L4 9H10.2L12 2Z" fill="#417BA4" />
    </svg>
  </div>
);

// --------------------------------------------------------
// Types & Main Page Component
// --------------------------------------------------------

interface AssignmentItem {
  _id: string;
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: string[];
  totalQuestions: number;
  totalMarks: number;
  difficulty: string;
  createdAt: string;
  jobId: string;
  status: string;
}

export default function Home() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("assignments");

  // Sync activeTab with URL query parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["home", "groups", "assignments", "library", "toolkit"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  // Dropdown menu state per card
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Fetch assignments on mount
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/assignments`
      );
      setAssignments(response.data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/assignments/${id}`
      );
      setAssignments((prev) => prev.filter((item) => item._id !== id));
      setActiveMenuId(null);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Failed to delete assignment");
    }
  };

  const handleCardClick = (jobId: string) => {
    router.push(`/result/${jobId}`);
  };

  const filteredAssignments = assignments.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="relative min-h-screen w-full flex font-sans antialiased overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)" }}
    >
      {/* --------------------------------------------------------
          1. DESKTOP SIDEBAR PANEL - FIGMA EXACT MATCH
         -------------------------------------------------------- */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        assignmentsBadge={assignments.length}
      />

      {/* --------------------------------------------------------
          2. DYNAMIC WORKSPACE MAIN CONTAINER
         -------------------------------------------------------- */}
      <main className="flex-1 flex flex-col pt-24 lg:pt-0 lg:pl-[327px] pb-28 lg:pb-0 min-h-screen relative overflow-hidden">
        {/* Modern Ambient Glows for Depth & Aesthetics */}
        <div className="absolute right-0 top-0 ambient-glow-orange pointer-events-none" />
        <div className="absolute left-[15%] bottom-0 ambient-glow-purple pointer-events-none" />
        
        {/* MOBILE FLOATING TOP NAVIGATION BAR - FIGMA PIXEL-PERFECT MATCH */}
        <header className="lg:hidden flex items-center justify-between px-4 bg-white border border-[#E2E8F0] fixed left-4 right-4 top-4 z-30 shadow-sm rounded-2xl" style={{ height: 60 }}>
          <div className="flex items-center gap-2">
            <VedaLogo className="w-8 h-8 rounded-lg" style={{ width: 34, height: 34 }} />
            <span
              className="font-bold text-[#303030] tracking-[-0.06em]"
              style={{ fontSize: 24, lineHeight: "20px", fontFamily: "var(--font-bricolage)" }}
            >
              VedaAI
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Bell Icon in gray circular background */}
            <button className="relative w-9 h-9 rounded-full bg-[#F0F0F0] flex items-center justify-center hover:bg-gray-100 transition-colors">
              <BellIcon />
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#FF5623] border border-white" />
            </button>

            {/* Avatar Photo */}
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hamburger Menu */}
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
          {/* Left: Back + breadcrumb */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-white border border-[#E5E5EA] flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeftIcon />
            </button>
            <div className="flex items-center gap-2 ml-2">
              <GridIcon className="text-[#8E8E93]" />
              <span
                className="font-bold tracking-[-0.03em] text-[#8E8E93]"
                style={{ fontSize: 16, fontFamily: "var(--font-inter)" }}
              >
                Assignment
              </span>
            </div>
          </div>

          {/* Right: Bell + user */}
          <div className="flex items-center gap-3">
            {/* Bell */}
            <button className="relative w-9 h-9 rounded-full bg-[#F2F2F7] flex items-center justify-center hover:bg-gray-100 transition-colors">
              <BellIcon />
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#FF5623] border border-white" />
            </button>

            {/* User chip with Bored Ape avatar */}
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

        {/* 3. DYNAMIC FLOATING WORKSPACE CARD (Glassmorphism layout) */}
        <div className="flex-1 p-4 lg:p-5 max-w-7xl w-full flex flex-col relative z-10">
          <div className="flex-1 bg-transparent lg:bg-white/85 lg:backdrop-blur-md border-0 lg:border lg:border-white/50 rounded-none lg:rounded-[24px] shadow-none lg:shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-0 lg:p-10 flex flex-col relative overflow-hidden min-h-[calc(100vh-140px)]">
            
            {/* TAB: ASSIGNMENTS */}
            {activeTab === "assignments" && (
              <>
                {/* ----------------------------------------------------
                    A. MOBILE LIST VIEW (lg:hidden)
                   ---------------------------------------------------- */}
                <div className="lg:hidden flex flex-col w-full animate-fade-in">
                  {/* Subheader: Back Button + Centered Title */}
                  <div className="flex items-center relative w-full mb-4 px-1">
                    <button
                      onClick={() => router.back()}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200"
                    >
                      <ArrowLeftIcon />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span
                        className="font-bold text-[#303030] text-[17px] tracking-[-0.04em]"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        Assignments
                      </span>
                    </div>
                  </div>

                  {/* Search & Filter Bar (Mobile capsule layout) */}
                  <div className="bg-white border border-[#D9D9D9] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm mb-5 w-full">
                    {/* Filter Button */}
                    <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-xl text-sm font-bold text-[#8E8E93] transition-all">
                      <SlidersHorizontal className="w-4 h-4 text-[#8E8E93]" />
                      <span style={{ fontFamily: "var(--font-bricolage)" }}>Filter</span>
                    </button>

                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-[200px]">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-[#8E8E93]" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-transparent rounded-xl text-sm outline-none transition-all placeholder:text-[#8E8E93] bg-transparent text-[#303030]"
                      />
                    </div>
                  </div>

                  {/* Loading or Stacked Cards */}
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#E0533C] rounded-full animate-spin" />
                      <p className="text-sm font-bold text-gray-500">Loading assignments...</p>
                    </div>
                  ) : filteredAssignments.length === 0 ? (
                    /* Centered Empty State on Mobile */
                    <div className="flex flex-col items-center justify-center text-center py-10 w-full">
                      <div className="mb-6" style={{ width: "300px", height: "300px" }}>
                        <EmptyIllustration />
                      </div>
                      <h2
                        className="font-bold text-[#303030] tracking-[-0.04em] text-xl"
                        style={{ fontFamily: "var(--font-bricolage)" }}
                      >
                        No assignments yet
                      </h2>
                      <p
                        className="text-[rgba(94,94,94,0.8)] tracking-[-0.04em] leading-relaxed mt-2 mb-6"
                        style={{ fontSize: 16, fontWeight: 400, fontFamily: "var(--font-bricolage)" }}
                      >
                        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
                      </p>
                      <button
                        onClick={() => router.push("/create-assignment")}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#181818] text-white font-medium shadow-sm"
                        style={{ fontFamily: "var(--font-bricolage)" }}
                      >
                        <PlusIcon size={18} />
                        <span>Create Your First Assignment</span>
                      </button>
                    </div>
                  ) : (
                    /* Stacked List of Cards (Matching Mobile mockup exactly) */
                    <div className="flex flex-col gap-4 w-full">
                      {filteredAssignments.map((assignment) => (
                        <div
                          key={assignment._id}
                          onClick={() => handleCardClick(assignment.jobId)}
                          className="premium-card rounded-[20px] p-5 active:scale-[0.99] cursor-pointer relative flex flex-col gap-5 w-full"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3
                              className="text-lg font-bold text-[#303030] tracking-tight line-clamp-1"
                              style={{ fontFamily: "var(--font-inter)" }}
                            >
                              {assignment.title}
                            </h3>

                            {/* Dropdown Action Trigger */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(activeMenuId === assignment._id ? null : assignment._id);
                                }}
                                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>

                              {/* Action Dropdown Menu */}
                              {activeMenuId === assignment._id && (
                                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-30 animate-scale-in">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCardClick(assignment.jobId);
                                    }}
                                    className="w-full px-4 py-2 text-left text-xs font-bold text-[#666666] hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                                    View Assignment
                                  </button>
                                  <button
                                    onClick={(e) => handleDelete(assignment._id, e)}
                                    className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Single contiguous line of text (No dashed divider on mobile!) */}
                          <div
                            className="text-xs text-[#8E8E93] font-bold"
                            style={{ fontFamily: "var(--font-inter)", wordSpacing: "1.5px" }}
                          >
                            Assigned on : {new Date(assignment.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-")} &nbsp;&nbsp; Due : {new Date(assignment.dueDate).toLocaleDateString("en-GB").replace(/\//g, "-")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ----------------------------------------------------
                    B. DESKTOP VIEW (hidden lg:flex)
                   ---------------------------------------------------- */}
                <div className="hidden lg:flex flex-col w-full animate-fade-in">
                  {/* Title & Subtitle inside the card */}
                  {assignments.length > 0 && (
                    <div className="mb-6 bg-white border border-[#E5E5EA] rounded-[24px] p-6 shadow-sm flex items-center gap-4 w-full">
                      <span className="inline-block w-4 h-4 bg-[#4ADE80] rounded-full border-2 border-white shadow-sm shrink-0" />
                      <div className="flex flex-col">
                        <h1
                          className="text-2xl font-bold text-[#1C1C1E] tracking-tight"
                          style={{ fontFamily: "var(--font-bricolage)" }}
                        >
                          Assignments
                        </h1>
                        <p className="text-sm text-[#8E8E93] font-medium" style={{ fontFamily: "var(--font-inter)" }}>
                          Manage and create assignments for your classes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Loading or Cards List */}
                  {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#E0533C] rounded-full animate-spin" />
                      <p className="text-sm font-bold text-gray-500">Loading assignments...</p>
                    </div>
                  ) : assignments.length === 0 ? (
                    /* Centered Empty State on Desktop */
                    <div
                      className="flex-1 flex flex-col items-center justify-center text-center mx-auto"
                      style={{ maxWidth: "486px", paddingTop: "40px", paddingBottom: "40px" }}
                    >
                      <div className="mb-6" style={{ width: "300px", height: "300px" }}>
                        <EmptyIllustration />
                      </div>
                      <h2
                        className="font-bold text-[#303030] tracking-[-0.04em]"
                        style={{ fontSize: 20, lineHeight: "140%", fontFamily: "var(--font-bricolage)" }}
                      >
                        No assignments yet
                      </h2>
                      <p
                        className="text-[rgba(94,94,94,0.8)] tracking-[-0.04em] leading-relaxed mt-2 mb-8"
                        style={{ fontSize: 16, fontWeight: 400, fontFamily: "var(--font-inter)" }}
                      >
                        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
                      </p>
                      <button
                        onClick={() => router.push("/create-assignment")}
                        className="flex items-center gap-2 px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-white font-medium"
                        style={{
                          background: "#1C1C1E",
                          height: 46,
                          fontFamily: "var(--font-inter)"
                        }}
                      >
                        <PlusIcon size={20} />
                        <span className="text-base tracking-[-0.04em]">
                          Create Your First Assignment
                        </span>
                      </button>
                    </div>
                  ) : (
                    /* Assignments Grid View for Desktop (Matching Desktop mockup) */
                    <div className="space-y-6 w-full">
                      {/* Search & Filter Header bar */}
                      <div className="flex flex-row items-center justify-between gap-4 w-full bg-transparent py-1">
                        <div>
                          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E5EA] rounded-xl text-sm font-semibold text-[#8E8E93] shadow-sm hover:bg-gray-50 transition-all">
                            <SlidersHorizontal className="w-4 h-4 text-[#8E8E93]" />
                            <span style={{ fontFamily: "var(--font-inter)" }}>Filter By</span>
                          </button>
                        </div>
                        <div className="relative flex-1 max-w-md w-full">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-[#8E8E93]" />
                          </span>
                          <input
                            type="text"
                            placeholder="Search Assignment"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="premium-input w-full pl-11 pr-4 py-2.5 border border-[#E5E5EA] rounded-full text-sm placeholder:text-[#8E8E93] bg-white text-[#1C1C1E] shadow-sm"
                          />
                        </div>
                      </div>

                      {/* Cards Grid */}
                      <div className="grid grid-cols-2 gap-6 w-full">
                        {filteredAssignments.map((assignment) => (
                          <div
                            key={assignment._id}
                            onClick={() => handleCardClick(assignment.jobId)}
                            className="premium-card rounded-2xl p-6 cursor-pointer relative group flex flex-col justify-between min-h-[170px]"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                  <h3
                                    className="text-xl font-extrabold text-[#1C1C1E] tracking-tight line-clamp-1 group-hover:text-[#E0533C] transition-colors duration-200"
                                    style={{ fontFamily: "var(--font-inter)" }}
                                  >
                                    {assignment.title}
                                  </h3>
                                  <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-[#F3F4F6] text-[#666666] rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    {assignment.subject}
                                  </span>
                                </div>

                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(activeMenuId === assignment._id ? null : assignment._id);
                                    }}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                                  >
                                    <MoreVertical className="w-5 h-5" />
                                  </button>
                                  {activeMenuId === assignment._id && (
                                    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-30 animate-scale-in">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCardClick(assignment.jobId);
                                        }}
                                        className="w-full px-4 py-2 text-left text-xs font-bold text-[#666666] hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                                        View Assignment
                                      </button>
                                      <button
                                        onClick={(e) => handleDelete(assignment._id, e)}
                                        className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Bottom details (No dashed divider, spaced-out layout matching Mockup 2) */}
                            <div className="mt-8 flex items-center justify-between text-sm text-[#8E8E93] font-medium gap-2" style={{ fontFamily: "var(--font-inter)" }}>
                              <div>
                                <span className="font-semibold">Assigned on : </span>
                                <span className="text-[#1C1C1E] font-semibold">
                                  {new Date(assignment.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-[#1C1C1E]">Due : </span>
                                <span className="text-[#1C1C1E] font-bold">
                                  {new Date(assignment.dueDate).toLocaleDateString("en-GB").replace(/\//g, "-")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Centered Floating "+ Create Assignment" button at the bottom of card list */}
                      <div className="flex justify-center mt-10">
                        <button
                          onClick={() => router.push("/create-assignment")}
                          className="flex items-center justify-center gap-2 text-white font-bold bg-[#1C1C1E] hover:bg-black rounded-full h-11 px-7 shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-all"
                          style={{ fontFamily: "var(--font-bricolage)" }}
                        >
                          <PlusIcon size={16} />
                          <span>Create Assignment</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB: HOME */}
            {activeTab === "home" && (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-6 animate-fade-in">
                <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-md mb-6">
                  <GridIcon className="w-10 h-10 text-[#FF5623]" />
                </div>
                <h2
                  className="text-2xl lg:text-3xl font-bold text-[#303030] tracking-[-0.04em]"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Welcome to VedaAI Dashboard
                </h2>
                <p
                  className="text-[rgba(94,94,94,0.8)] tracking-[-0.04em] max-w-md mt-3 mb-8"
                  style={{ fontSize: 16, fontFamily: "var(--font-bricolage)" }}
                >
                  Manage student groups, design interactive assessments, and leverage AI capabilities to simplify your educational grading workflow.
                </p>

                {/* Dashboard Shortcut Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl text-left mt-6">
                  <div
                    onClick={() => router.push("/create-assignment")}
                    className="p-5 bg-white border border-gray-200/80 rounded-2xl hover:border-[#FF5623] hover:shadow-md cursor-pointer transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF5623] mb-3">
                      <PlusIcon size={18} />
                    </div>
                    <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-bricolage)" }}>Create Assignment</h3>
                    <p className="text-xs text-gray-500 mt-1">Generate AI rubrics and questions for students.</p>
                  </div>
                  <div
                    onClick={() => setActiveTab("toolkit")}
                    className="p-5 bg-white border border-gray-200/80 rounded-2xl hover:border-[#FF5623] hover:shadow-md cursor-pointer transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
                      <ToolkitIcon />
                    </div>
                    <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-bricolage)" }}>AI Toolkit</h3>
                    <p className="text-xs text-gray-500 mt-1">Utilize built-in models for grading assistant tools.</p>
                  </div>
                  <div
                    onClick={() => setActiveTab("library")}
                    className="p-5 bg-white border border-gray-200/80 rounded-2xl hover:border-[#FF5623] hover:shadow-md cursor-pointer transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
                      <LibraryIcon />
                    </div>
                    <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-bricolage)" }}>My Library</h3>
                    <p className="text-xs text-gray-500 mt-1">Browse saved files and custom reference books.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LIBRARY */}
            {activeTab === "library" && (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-6 animate-fade-in">
                <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-md mb-6">
                  <LibraryIcon className="w-10 h-10 text-purple-600" />
                </div>
                <h2
                  className="text-2xl font-bold text-[#303030] tracking-[-0.04em]"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Your Library is empty
                </h2>
                <p
                  className="text-[rgba(94,94,94,0.8)] tracking-[-0.04em] max-w-md mt-2 mb-6"
                  style={{ fontSize: 16, fontFamily: "var(--font-bricolage)" }}
                >
                  Store text materials, grading criteria, syllabus guides, and sample rubrics to reuse them when creating new assignments.
                </p>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181818] text-white hover:opacity-90 transition-opacity font-medium"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  <PlusIcon size={16} />
                  <span>Upload Document</span>
                </button>
              </div>
            )}

            {/* TAB: TOOLKIT */}
            {activeTab === "toolkit" && (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-6 animate-fade-in">
                <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-md mb-6">
                  <ToolkitIcon className="w-10 h-10 text-indigo-600" />
                </div>
                <h2
                  className="text-2xl font-bold text-[#303030] tracking-[-0.04em]"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  AI Teacher's Toolkit
                </h2>
                <p
                  className="text-[rgba(94,94,94,0.8)] tracking-[-0.04em] max-w-md mt-2 mb-6"
                  style={{ fontSize: 16, fontFamily: "var(--font-bricolage)" }}
                >
                  Harness custom-trained education models to generate class plans, rubric templates, or conceptual explainers for school students.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl text-left">
                  <div className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md cursor-pointer transition-all">
                    <span className="font-semibold text-gray-900" style={{ fontFamily: "var(--font-bricolage)" }}>Lesson Plan Builder</span>
                    <p className="text-xs text-gray-500 mt-1">Design full lecture schedules and interactive activities.</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md cursor-pointer transition-all">
                    <span className="font-semibold text-gray-900" style={{ fontFamily: "var(--font-bricolage)" }}>Rubric Designer</span>
                    <p className="text-xs text-gray-500 mt-1">Define multi-criteria grading standards quickly.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 4. FLOATING ACTION BUTTON (FAB) FOR MOBILE - Figmatic White/Red Circle */}
        <button
          onClick={() => router.push("/create-assignment")}
          className="lg:hidden fixed right-6 bottom-28 bg-white text-[#FF5623] w-14 h-14 rounded-full flex items-center justify-center shadow-lg border border-gray-100 z-20 hover:scale-[1.05] active:scale-[0.98] transition-all"
        >
          <PlusIcon size={24} />
        </button>

        {/* 5. MOBILE BOTTOM NAVIGATION BAR - FIGMA EXACT DARK THEME */}
        <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-[#121212] rounded-[24px] px-6 py-3 flex items-center justify-around z-30 shadow-2xl border border-white/5 h-18">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
              activeTab === "home" ? "text-white scale-105" : "text-[rgba(255,255,255,0.4)] hover:text-gray-200"
            }`}
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
            onClick={() => setActiveTab("assignments")}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
              activeTab === "assignments" ? "text-white scale-105" : "text-[rgba(255,255,255,0.4)] hover:text-gray-200"
            }`}
          >
            <div className="relative">
              <AssignmentsIcon />
              {assignments.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF5623] text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold rounded-full">
                  {assignments.length}
                </span>
              )}
            </div>
            <span
              className="text-[10px] tracking-[-0.04em] font-medium"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              Assignments
            </span>
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
              activeTab === "library" ? "text-white scale-105" : "text-[rgba(255,255,255,0.4)] hover:text-gray-200"
            }`}
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
            onClick={() => setActiveTab("toolkit")}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
              activeTab === "toolkit" ? "text-white scale-105" : "text-[rgba(255,255,255,0.4)] hover:text-gray-200"
            }`}
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
