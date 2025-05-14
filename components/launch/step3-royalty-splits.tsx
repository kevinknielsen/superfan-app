"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  AlertCircle,
  Users,
  User,
  Briefcase,
  DollarSign,
  Mic,
  Music,
  Crown,
  Sparkles,
} from "lucide-react";
import { useLaunchProject } from "@/contexts/launch-project-context";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/lib/supabaseClient";

// Define collaborator types and interfaces
interface Collaborator {
  id: string;
  name: string;
  role: string;
  email: string;
  walletAddress: string;
  percentage: number;
  color: string;
  avatar?: string;
  emoji?: string;
}

interface CollaboratorCardProps {
  collaborator: Collaborator;
  onDelete: () => void;
  onUpdate: (field: string, value: any) => void;
  isSelected: boolean;
  onSelect: () => void;
  error?: Record<string, string>;
}

// Role configuration
const ROLES = {
  Artist: { icon: <Music className="w-4 h-4" />, color: "#3B82F6", label: "Artist" },
  Producer: { icon: <Mic className="w-4 h-4" />, color: "#10B981", label: "Producer" },
  Mixer: { icon: <Sparkles className="w-4 h-4" />, color: "#8B5CF6", label: "Mixer" },
  Curator: { icon: <Crown className="w-4 h-4" />, color: "#F59E0B", label: "Curator" },
  Arranger: { icon: <Music className="w-4 h-4" />, color: "#EC4899", label: "Arranger" },
  Songwriter: { icon: <Music className="w-4 h-4" />, color: "#06B6D4", label: "Songwriter" },
  Musician: { icon: <Music className="w-4 h-4" />, color: "#F97316", label: "Musician" },
  Vocalist: { icon: <Mic className="w-4 h-4" />, color: "#14B8A6", label: "Vocalist" },
  Engineer: { icon: <Sparkles className="w-4 h-4" />, color: "#6366F1", label: "Engineer" },
  Mastering: { icon: <Sparkles className="w-4 h-4" />, color: "#D946EF", label: "Mastering" },
  Assistant: { icon: <Users className="w-4 h-4" />, color: "#F43F5E", label: "Assistant" },
  Tech: { icon: <Users className="w-4 h-4" />, color: "#3B82F6", label: "Tech" },
  Manager: { icon: <Briefcase className="w-4 h-4" />, color: "#10B981", label: "Manager" },
  Label: { icon: <Briefcase className="w-4 h-4" />, color: "#F59E0B", label: "Label" },
  Publisher: { icon: <Briefcase className="w-4 h-4" />, color: "#8B5CF6", label: "Publisher" },
  Composer: { icon: <Music className="w-4 h-4" />, color: "#EC4899", label: "Composer" },
  Lyricist: { icon: <Music className="w-4 h-4" />, color: "#06B6D4", label: "Lyricist" },
  Performer: { icon: <Music className="w-4 h-4" />, color: "#F97316", label: "Performer" },
  "Featured Artist": { icon: <Music className="w-4 h-4" />, color: "#14B8A6", label: "Featured Artist" },
  "Backing Vocalist": { icon: <Mic className="w-4 h-4" />, color: "#6366F1", label: "Backing Vocalist" },
  "Session Musician": { icon: <Music className="w-4 h-4" />, color: "#D946EF", label: "Session Musician" },
  "Sound Designer": { icon: <Sparkles className="w-4 h-4" />, color: "#F43F5E", label: "Sound Designer" },
  "Studio Manager": { icon: <Briefcase className="w-4 h-4" />, color: "#3B82F6", label: "Studio Manager" },
  "A&R": { icon: <Briefcase className="w-4 h-4" />, color: "#10B981", label: "A&R" },
  Marketing: { icon: <Briefcase className="w-4 h-4" />, color: "#F59E0B", label: "Marketing" },
  Legal: { icon: <Briefcase className="w-4 h-4" />, color: "#8B5CF6", label: "Legal" },
  "Business Manager": { icon: <Briefcase className="w-4 h-4" />, color: "#EC4899", label: "Business Manager" },
  "Tour Manager": { icon: <Briefcase className="w-4 h-4" />, color: "#06B6D4", label: "Tour Manager" },
  "Merchandise Manager": { icon: <Briefcase className="w-4 h-4" />, color: "#F97316", label: "Merchandise Manager" },
  "Social Media Manager": { icon: <Briefcase className="w-4 h-4" />, color: "#14B8A6", label: "Social Media Manager" },
};

// Color palette for collaborators
const COLORS = [
  "url(#purplePinkGradient)", // Use a gradient fill for the main slice
  "#a259ff", // purple
  "#f857a6", // pink
  "#c084fc", // soft purple
  "#fbc2eb", // light pink
];

// Add color variations for roles
const getRoleColor = (role: string, index: number) => {
  const baseColor = ROLES[role as keyof typeof ROLES]?.color || ROLES.Artist.color;
  if (index === 0) return baseColor;

  // Create variations of the base color for duplicate roles
  const hueOffset = (index * 30) % 360;
  return `hsl(${parseInt(baseColor.slice(1), 16) + hueOffset}, 70%, 50%)`;
};

// Add these styles to your global CSS file (styles/globals.css)
const sliderStyles = `
  .custom-range-slider {
    @apply relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10;
  }
  
  .custom-range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--range-color);
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid white;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  }
  
  .custom-range-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  }
  
  .custom-range-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--range-color);
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid white;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  }
  
  .custom-range-slider::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  }
`;

// Utility function for formatting percentages
const formatPercentage = (value: number): string => `${value.toFixed(2)}%`;

// Utility function for formatting currency
const formatCurrency = (amount: number | null): string => {
  if (amount === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Enhanced RangeSlider with ARIA attributes for accessibility
const RangeSlider = memo(function RangeSlider({
  value,
  onChange,
  min,
  max,
  color,
  showValue = true,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  color: string;
  showValue?: boolean;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-container">
      <div className="slider-track">
        <motion.div
          className="slider-fill"
          style={{ backgroundColor: color, width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value || 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input"
        style={{ color }}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label="Adjust percentage"
      />
      {showValue && <div className="slider-value">{formatPercentage(value)}</div>}
    </div>
  );
});

// Improved CollaboratorCard with tooltips and better error handling
const CollaboratorCard = memo(function CollaboratorCard({
  collaborator,
  onDelete,
  onUpdate,
  isSelected,
  onSelect,
  error,
  toggleEmojiPicker,
  emojiPickerState,
}: CollaboratorCardProps & { toggleEmojiPicker: (id: string) => void; emojiPickerState: Record<string, boolean> }) {
  const roleConfig = ROLES[collaborator.role as keyof typeof ROLES] || ROLES.Artist;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card
        className={`mb-4 border transition-all ${
          isSelected ? "border-[#a259ff]" : "border-gray-200"
        } bg-white text-[#0f172a]`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: roleConfig.color }}
              >
                {roleConfig.icon}
              </div>
              <select
                value={collaborator.role}
                onChange={(e) => onUpdate("role", e.target.value)}
                className="text-sm font-medium bg-transparent border-none focus:ring-0 p-0 pr-6"
                aria-label="Select role"
              >
                {Object.entries(ROLES).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {collaborator.role !== "Artist" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                aria-label="Remove collaborator"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="name" className={`text-xs ${error?.name ? "text-red-500" : "text-gray-500"}`}>
                Name
              </Label>
              <Input
                id="name"
                value={collaborator.name}
                onChange={(e) => onUpdate("name", e.target.value)}
                placeholder="Full name"
                className={`mt-1 ${error?.name ? "border-red-500" : ""}`}
                aria-invalid={!!error?.name}
                aria-describedby={error?.name ? `error-name-${collaborator.id}` : undefined}
              />
              {error?.name && (
                <p id={`error-name-${collaborator.id}`} className="text-red-500 text-xs mt-1">
                  {error.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className={`text-xs ${error?.email ? "text-red-500" : "text-gray-500"}`}>
                  Email
                </Label>
                <Input
                  id="email"
                  value={collaborator.email}
                  onChange={(e) => onUpdate("email", e.target.value)}
                  placeholder="Email address"
                  className={`mt-1 ${error?.email ? "border-red-500" : ""}`}
                  aria-invalid={!!error?.email}
                  aria-describedby={error?.email ? `error-email-${collaborator.id}` : undefined}
                />
                {error?.email && (
                  <p id={`error-email-${collaborator.id}`} className="text-red-500 text-xs mt-1">
                    {error.email}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="wallet"
                  className={`text-xs ${error?.walletAddress ? "text-red-500" : "text-gray-500"}`}
                >
                  Wallet Address
                </Label>
                <Input
                  id="wallet"
                  value={collaborator.walletAddress}
                  onChange={(e) => onUpdate("walletAddress", e.target.value)}
                  placeholder="0x..."
                  className={`mt-1 ${error?.walletAddress ? "border-red-500" : ""}`}
                  aria-invalid={!!error?.walletAddress}
                  aria-describedby={error?.walletAddress ? `error-wallet-${collaborator.id}` : undefined}
                />
                {error?.walletAddress && (
                  <p id={`error-wallet-${collaborator.id}`} className="text-red-500 text-xs mt-1">
                    {error.walletAddress}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor={`percentage-${collaborator.id}`}
                className={`text-xs ${error?.percentage ? "text-red-500" : "text-gray-500"}`}
              >
                Revenue Share (%)
              </Label>
              <RangeSlider
                value={collaborator.percentage}
                onChange={(value) => onUpdate("percentage", value)}
                min={0}
                max={100}
                color={roleConfig.color}
              />
              {error?.percentage && (
                <p id={`error-percentage-${collaborator.id}`} className="text-red-500 text-xs mt-1">
                  {error.percentage}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Update SplitPieChart component props
const PLATFORM_FEE = 2.5;
const PLATFORM_FEE_COLOR = "#a1a1aa"; // gray-400
const SplitPieChart = memo(function SplitPieChart({
  collaborators,
  curatorPercentage,
  enableCuratorShares,
  targetRaise,
}: {
  collaborators: Collaborator[];
  curatorPercentage: number;
  enableCuratorShares: boolean;
  targetRaise: number | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Calculate amount for a given percentage
  const calculateAmount = (percentage: number) => {
    if (!targetRaise) return null;
    return (targetRaise * percentage) / 100;
  };

  // Format amount with commas and 2 decimal places
  const formatAmount = (amount: number | null) => {
    if (amount === null) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate effective team shares for the pie chart
  const totalTeamPct = collaborators.reduce((sum, c) => sum + c.percentage, 0);
  const totalDeductions = (enableCuratorShares ? curatorPercentage : 0) + PLATFORM_FEE;
  const teamScale = totalTeamPct > 0 ? (100 - totalDeductions) / totalTeamPct : 1;

  const pieSlices = [
    ...collaborators.map((c) => ({
      ...c,
      effectivePercentage: +(c.percentage * teamScale).toFixed(2),
      color: ROLES[c.role as keyof typeof ROLES]?.color || c.color || ROLES.Artist.color,
    })),
    ...(enableCuratorShares && curatorPercentage > 0
      ? [
          {
            id: "early-supporters",
            name: "Curators",
            role: "Curator",
            email: "",
            walletAddress: "",
            effectivePercentage: curatorPercentage,
            color: ROLES.Curator.color,
          },
        ]
      : []),
    {
      id: "platform-fee",
      name: "Platform Fee",
      role: "Platform",
      email: "",
      walletAddress: "",
      effectivePercentage: PLATFORM_FEE,
      color: PLATFORM_FEE_COLOR,
    },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.clearRect(0, 0, width, height);
    let startAngle = 0;
    pieSlices.forEach((slice, idx) => {
      const sliceAngle = (slice.effectivePercentage / 100) * 2 * Math.PI;
      const color = slice.id === "platform-fee" ? PLATFORM_FEE_COLOR : slice.color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      const isHovered = hoveredSlice === idx;
      ctx.fillStyle = isHovered ? `${color}CC` : color;
      ctx.fill();
      if (slice.effectivePercentage >= 5) {
        const labelAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${slice.effectivePercentage}%`, labelX, labelY);
      }
      startAngle += sliceAngle;
    });
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  }, [pieSlices, hoveredSlice]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="mb-4 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onMouseMove={(e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - canvas.width / 2;
            const y = e.clientY - rect.top - canvas.height / 2;
            const angle = Math.atan2(y, x);
            const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
            let startAngle = 0;
            pieSlices.forEach((slice, index) => {
              const sliceAngle = (slice.effectivePercentage / 100) * 2 * Math.PI;
              if (normalizedAngle >= startAngle && normalizedAngle < startAngle + sliceAngle) {
                setHoveredSlice(index);
                setActiveSlice(index);
                setTooltipPosition({ x: e.clientX, y: e.clientY });
              }
              startAngle += sliceAngle;
            });
          }}
          onMouseLeave={() => {
            setHoveredSlice(null);
            setActiveSlice(null);
          }}
        />
        {hoveredSlice !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bg-white p-2 rounded-lg shadow-lg text-sm"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y + 10,
              transform: "translateX(-50%)",
            }}
          >
            {(() => {
              const slice = pieSlices[hoveredSlice];
              const percent = slice?.effectivePercentage || 0;
              const name = slice?.id === "early-supporters" ? "Curators" : slice?.name || slice?.role;
              const amount = calculateAmount(percent);
              const color =
                slice.id === "platform-fee"
                  ? PLATFORM_FEE_COLOR
                  : ROLES[slice?.role as keyof typeof ROLES]?.color || ROLES.Curator.color;
              return (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span>{name}</span>
                    <span className="font-medium">{percent}%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{`${percent}% of every $100`}</div>
                  {targetRaise && amount !== null && (
                    <div className="text-xs text-gray-800 mt-1 font-semibold">
                      {formatAmount(amount)} USDC from target raise
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}
      </div>
      <motion.div className="grid grid-cols-2 gap-2 w-full">
        {pieSlices.map((slice, index) => {
          const color =
            slice.id === "platform-fee"
              ? PLATFORM_FEE_COLOR
              : ROLES[slice.role as keyof typeof ROLES]?.color || ROLES.Artist.color;
          return (
            <motion.div
              key={slice.id + index}
              className={`flex flex-col items-start text-sm p-2 rounded-lg transition-colors ${
                hoveredSlice === index ? "bg-gray-100" : ""
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                <span className="flex-1 min-w-0 whitespace-nowrap overflow-visible">{slice.name || slice.role}</span>
              </div>
              <span className="ml-5 text-xs text-gray-500">{slice.effectivePercentage}%</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
});

// Simplified FundingControls component to fix the infinite loop
const FundingControls = memo(function FundingControls({
  enableCuratorShares,
  curatorPercentage,
  platformFee,
  onCuratorSharesChange,
  onCuratorPercentageChange,
}: {
  enableCuratorShares: boolean;
  curatorPercentage: number;
  platformFee: number;
  onCuratorSharesChange: (checked: boolean) => void;
  onCuratorPercentageChange: (value: number) => void;
}) {
  const [isIconPulsing, setIsIconPulsing] = useState(false);

  const handleToggle = (checked: boolean) => {
    onCuratorSharesChange(checked);
    if (checked) {
      setIsIconPulsing(true);
      setTimeout(() => setIsIconPulsing(false), 1000);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Funding Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="platform-fee" className="text-sm">
                Platform Fee
              </Label>
              <p className="text-xs text-gray-500">Standard fee applied to all projects</p>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{platformFee}%</span>
              <DollarSign size={16} className="text-gray-400" />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="curator-toggle">
              <div className="space-y-0.5">
                <Label htmlFor="curator-shares" className="text-sm">
                  Curator Support
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <motion.div animate={{ scale: isIconPulsing ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.5 }}>
                  <Crown className={`curator-icon ${enableCuratorShares ? "active" : ""}`} />
                </motion.div>
                <Switch id="curator-shares" checked={enableCuratorShares} onCheckedChange={handleToggle} />
              </div>
            </div>

            <AnimatePresence>
              {enableCuratorShares && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3"
                >
                  <div className="mt-4">
                    <RangeSlider
                      value={curatorPercentage}
                      onChange={onCuratorPercentageChange}
                      min={1}
                      max={50}
                      color={ROLES.Curator.color}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// DealSummary component
const DealSummary = memo(function DealSummary({
  collaborators,
  platformFee,
  curatorPercentage,
  enableCuratorShares,
}: {
  collaborators: Collaborator[];
  platformFee: number;
  curatorPercentage: number;
  enableCuratorShares: boolean;
}) {
  // Calculate artist's final share
  const artistCollaborator = collaborators.find((c) => c.role === "Artist");
  const artistPercentage = artistCollaborator?.percentage || 0;

  const totalDeductions = platformFee + (enableCuratorShares ? curatorPercentage : 0);
  const artistFinalShare = artistPercentage * (1 - totalDeductions / 100);

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Project Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm">Total Team Members</span>
            <span className="font-medium">{collaborators.length}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm">Platform Fee</span>
            <span className="font-medium">{platformFee}%</span>
          </div>

          {enableCuratorShares && (
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm">Curator Support</span>
              <span className="font-medium">{curatorPercentage}%</span>
            </div>
          )}

          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm">Artist's Share</span>
            <span className="font-medium">{artistPercentage}%</span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-sm font-medium">Artist's Final Share</span>
            <span className="font-bold text-lg">{artistFinalShare.toFixed(1)}%</span>
          </div>

          {totalDeductions > 0 && (
            <div className="text-xs text-gray-500 italic">*After platform fees and curator shares</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

// Reusable FormInput component
function FormInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className={`mt-1 ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Main component
interface Step2Props {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function Step3RoyaltySplits({ onNext, onPrevious }: Step2Props) {
  const { projectData, updateField } = useLaunchProject();

  // Initialize state with artist as first collaborator
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => [
    {
      id: "artist",
      name: projectData.artistName || "Main Artist",
      role: "Artist",
      email: "",
      walletAddress: "",
      percentage: 100,
      color: COLORS[0],
    },
  ]);

  const [selectedCollaborator, setSelectedCollaborator] = useState<string>("artist");
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const platformFee = 2.5; // Fixed platform fee
  const [emojiPickerState, setEmojiPickerState] = useState<Record<string, boolean>>({});

  // Toggle emoji picker visibility
  const toggleEmojiPicker = (id: string) => {
    setEmojiPickerState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Add a new collaborator
  const addCollaborator = useCallback(() => {
    const newId = `collab-${Date.now()}`;
    const newColor = COLORS[collaborators.length % COLORS.length];

    // Adjust percentages to make room for new collaborator
    const newCollaborators = collaborators.map((c) => ({
      ...c,
      percentage: Math.max(1, Math.floor(c.percentage * 0.8)), // Reduce existing by 20%
    }));

    // Calculate remaining percentage
    const usedPercentage = newCollaborators.reduce((sum, c) => sum + c.percentage, 0);
    const remainingPercentage = 100 - usedPercentage;

    setCollaborators([
      ...newCollaborators,
      {
        id: newId,
        name: "",
        role: "Producer",
        email: "",
        walletAddress: "",
        percentage: remainingPercentage,
        color: newColor,
      },
    ]);

    setSelectedCollaborator(newId);
  }, [collaborators]);

  // Delete a collaborator
  const deleteCollaborator = useCallback(
    (id: string) => {
      const deletedCollab = collaborators.find((c) => c.id === id);
      if (!deletedCollab) return;

      const remainingCollabs = collaborators.filter((c) => c.id !== id);

      // Redistribute the deleted collaborator's percentage
      const totalRemainingPercentage = remainingCollabs.reduce((sum, c) => sum + c.percentage, 0);

      if (totalRemainingPercentage === 0) {
        // If all remaining have 0%, give 100% to the first one
        remainingCollabs[0].percentage = 100;
      } else {
        // Otherwise redistribute proportionally
        remainingCollabs.forEach((collab) => {
          collab.percentage = Math.round((collab.percentage / totalRemainingPercentage) * 100);
        });

        // Ensure we add up to exactly 100%
        const adjustedTotal = remainingCollabs.reduce((sum, c) => sum + c.percentage, 0);
        if (adjustedTotal !== 100 && remainingCollabs.length > 0) {
          remainingCollabs[0].percentage += 100 - adjustedTotal;
        }
      }

      setCollaborators(remainingCollabs);
      setSelectedCollaborator(remainingCollabs[0]?.id || "");
    },
    [collaborators]
  );

  // Update a collaborator's field
  const updateCollaborator = useCallback((id: string, field: string, value: any) => {
    if (field === "percentage") {
      setCollaborators((prev) => {
        const currentCollab = prev.find((c) => c.id === id);
        if (!currentCollab) return prev;

        const oldPercentage = currentCollab.percentage;
        const difference = value - oldPercentage;

        if (difference === 0) return prev;

        const othersTotal = prev.filter((c) => c.id !== id).reduce((sum, c) => sum + c.percentage, 0);

        if (othersTotal === 0) {
          return prev.map((c) => (c.id === id ? { ...c, percentage: value } : c));
        }

        // Create a new array with updated percentages
        const updatedCollabs = prev.map((c) => {
          if (c.id === id) return { ...c, percentage: value };

          // Adjust other percentages proportionally
          const newPercentage = Math.max(0, Math.round(c.percentage - difference * (c.percentage / othersTotal)));
          return { ...c, percentage: newPercentage };
        });

        // Ensure total is exactly 100%
        const total = updatedCollabs.reduce((sum, c) => sum + c.percentage, 0);
        if (total !== 100) {
          // Find the largest share that's not the one we just changed
          const sortedOthers = [...updatedCollabs]
            .filter((c) => c.id !== id)
            .sort((a, b) => b.percentage - a.percentage);

          if (sortedOthers.length > 0) {
            return updatedCollabs.map((c) => {
              if (c.id === sortedOthers[0].id) {
                return { ...c, percentage: c.percentage + (100 - total) };
              }
              return c;
            });
          }
        }

        return updatedCollabs;
      });
    } else {
      setCollaborators((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    }
  }, []);

  // Handle curator shares toggle
  const handleCuratorSharesChange = useCallback(
    (checked: boolean) => {
      updateField("enableEarlySupporters", checked);
    },
    [updateField]
  );

  // Handle curator percentage change
  const handleCuratorPercentageChange = useCallback(
    (value: number) => {
      updateField("earlySupportersPercentage", value);
    },
    [updateField]
  );

  // Validate the form
  const validateForm = useCallback(() => {
    const newErrors: Record<string, Record<string, string>> = {};
    let isValid = true;

    collaborators.forEach((collab) => {
      const collabErrors: Record<string, string> = {};

      if (!collab.name.trim()) {
        collabErrors.name = "Name is required";
        isValid = false;
      }

      if (!collab.email.trim()) {
        collabErrors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collab.email)) {
        collabErrors.email = "Invalid email format";
        isValid = false;
      }

      if (!collab.walletAddress.trim()) {
        collabErrors.walletAddress = "Wallet address is required";
        isValid = false;
      } else if (!/^0x[a-fA-F0-9]{40}$/.test(collab.walletAddress)) {
        collabErrors.walletAddress = "Invalid wallet address";
        isValid = false;
      }

      if (collab.percentage <= 0) {
        collabErrors.percentage = "Must be greater than 0%";
        isValid = false;
      }

      if (Object.keys(collabErrors).length > 0) {
        newErrors[collab.id] = collabErrors;
      }
    });

    // Check total percentage
    const totalPercentage = collaborators.reduce((sum, c) => sum + c.percentage, 0);
    if (totalPercentage !== 100) {
      isValid = false;
      // Add a general error
      newErrors.general = { percentage: "Total percentage must equal 100%" };
    }

    setErrors(newErrors);
    return isValid;
  }, [collaborators]);

  // Custom validation to ensure total percentage does not exceed 100%
  const validateTotalPercentage = (collaborators: Collaborator[]) => {
    const total = collaborators.reduce((sum, c) => sum + c.percentage, 0);
    if (total > 100) {
      return "Total revenue share cannot exceed 100%";
    }
    return null;
  };

  // Handle next button click
  const handleNext = useCallback(async () => {
    if (!projectData.id) {
      setErrors((prev) => ({ ...prev, general: { id: "Project ID missing. Please complete Project Info step." } }));
      return;
    }
    if (!validateForm()) return;

    // Update context with royalty splits before Supabase insert
    const royaltySplits = collaborators.map((collab) => ({
      id: collab.id,
      recipient: collab.email || collab.walletAddress,
      percentage: collab.percentage,
    }));
    updateField("royaltySplits", royaltySplits);

    // Prepare team members array for Supabase
    const teamMembersArray = collaborators.map((collab) => ({
      project_id: projectData.id,
      role: collab.role,
      name: collab.name,
      email: collab.email,
      wallet_address: collab.walletAddress,
      revenue_share_pct: collab.percentage,
    }));

    // Validate sum = 100
    const totalPct = teamMembersArray.reduce((sum, m) => sum + m.revenue_share_pct, 0);
    if (totalPct !== 100) {
      setErrors((prev) => ({ ...prev, general: { percentage: "Total percentage must equal 100%" } }));
      return;
    }

    // Insert into Supabase
    const { error } = await supabase.from("team_members").insert(teamMembersArray);
    if (error) {
      setErrors((prev) => ({ ...prev, general: { submit: "Failed to save team members: " + error.message } }));
      return;
    }
    onNext();
  }, [validateForm, onNext, collaborators, projectData.id, updateField]);

  // Calculate total percentage
  const totalPercentage = collaborators.reduce((sum, c) => sum + c.percentage, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Team & Revenue Splits</h2>
        <p className="text-gray-600">Define your team members and how revenue will be distributed.</p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Collaborator management */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Team Members</h3>
            <Button onClick={addCollaborator} variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Add Member
            </Button>
          </div>

          {/* Error message if total percentage is not 100% */}
          {totalPercentage !== 100 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-center text-yellow-800">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
              <span>Total percentage must equal 100% (currently {totalPercentage}%)</span>
            </div>
          )}

          {/* Collaborator cards */}
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <CollaboratorCard
                key={collaborator.id}
                collaborator={collaborator}
                onDelete={() => deleteCollaborator(collaborator.id)}
                onUpdate={(field, value) => updateCollaborator(collaborator.id, field, value)}
                isSelected={selectedCollaborator === collaborator.id}
                onSelect={() => setSelectedCollaborator(collaborator.id)}
                error={errors[collaborator.id]}
                toggleEmojiPicker={toggleEmojiPicker}
                emojiPickerState={emojiPickerState}
              />
            ))}
          </div>

          {/* Total percentage display */}
          <div className="text-right text-sm text-gray-500">Total Revenue Share: {totalPercentage}%</div>
        </div>

        {/* Right column - Visualization and settings */}
        <div className="space-y-6">
          {/* Pie chart visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Revenue Split</h3>
              <SplitPieChart
                collaborators={collaborators}
                curatorPercentage={projectData.earlySupportersPercentage}
                enableCuratorShares={projectData.enableEarlySupporters}
                targetRaise={projectData.targetRaise}
              />
            </CardContent>
          </Card>

          {/* Funding controls */}
          <FundingControls
            enableCuratorShares={projectData.enableEarlySupporters}
            curatorPercentage={projectData.earlySupportersPercentage}
            platformFee={platformFee}
            onCuratorSharesChange={handleCuratorSharesChange}
            onCuratorPercentageChange={handleCuratorPercentageChange}
          />

          {/* Deal summary */}
          <DealSummary
            collaborators={collaborators}
            platformFee={platformFee}
            curatorPercentage={projectData.earlySupportersPercentage}
            enableCuratorShares={projectData.enableEarlySupporters}
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button onClick={onPrevious} variant="outline">
          Back
        </Button>
        <Button onClick={handleNext} className="bg-[#0f172a] hover:bg-[#1e293b]">
          Continue to Milestones
        </Button>
      </div>
    </div>
  );
}
