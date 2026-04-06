// AvatarShowcase.tsx
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar,
  AvatarGroup,
  AvatarWithLabel,
  AvatarProvider,
  AvatarGroupProvider,
  AvatarImage,
  AvatarInitials,
  AvatarIcon,
  AvatarStatusIndicator,
  AvatarBadge,
  AvatarVerifiedBadge,
  AvatarUploadOverlay,
  AvatarTooltip,
  AvatarRing,
  AvatarAddButton,
  AvatarGroupOverflow,
  type AvatarSize,
  type AvatarShape,
  type AvatarStatus,
  type AvatarGroupLayout,
  type PresencePosition,
} from "../../../ui/data/avatar/Avatar.ui";
import {
  User,
  Camera,
  Check,
  Plus,
  Star,
  Heart,
  Award,
  Music,
  Code,
  Globe,
  MessageCircle,
  Phone,
  Video,
  Mail,
  MapPin,
  Calendar,
  Bell,
  Settings,
  LogOut,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Layers,
  RefreshCw,
  Upload,
  Download,
  Shield,
  Crown,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "lucide-react";

// Sample image URL
const SAMPLE_IMAGE = "https://res.cloudinary.com/dvytvjplt/image/upload/v1765866608/profile_pricture_oemv94.jpg";

// Sample team members data
const teamMembers = [
  { name: "Alice Johnson", src: SAMPLE_IMAGE, status: "online" as AvatarStatus, role: "Product Manager" },
  { name: "Bob Smith", src: undefined, status: "away" as AvatarStatus, role: "Lead Developer" },
  { name: "Carol Davis", src: undefined, status: "busy" as AvatarStatus, role: "UX Designer" },
  { name: "David Wilson", src: undefined, status: "online" as AvatarStatus, role: "QA Engineer" },
  { name: "Emma Brown", src: undefined, status: "offline" as AvatarStatus, role: "DevOps" },
  { name: "Frank Miller", src: undefined, status: "online" as AvatarStatus, role: "Frontend Developer" },
  { name: "Grace Lee", src: undefined, status: "away" as AvatarStatus, role: "Backend Developer" },
  { name: "Henry Taylor", src: undefined, status: "busy" as AvatarStatus, role: "Data Scientist" },
  { name: "Ivy Chen", src: undefined, status: "online" as AvatarStatus, role: "Mobile Developer" },
];

// Color palette for examples
const colorExamples = [
  { name: "Violet", color: "violet", gradient: "from-violet-500 to-purple-500" },
  { name: "Blue", color: "blue", gradient: "from-blue-500 to-cyan-500" },
  { name: "Emerald", color: "emerald", gradient: "from-emerald-500 to-teal-500" },
  { name: "Amber", color: "amber", gradient: "from-amber-500 to-orange-500" },
  { name: "Rose", color: "rose", gradient: "from-rose-500 to-pink-500" },
];

// Main showcase component
export default function AvatarShowcase() {
  const [selectedSize, setSelectedSize] = useState<AvatarSize>("md");
  const [selectedShape, setSelectedShape] = useState<AvatarShape>("circle");
  const [selectedStatus, setSelectedStatus] = useState<AvatarStatus>("online");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [groupLayout, setGroupLayout] = useState<AvatarGroupLayout>("stack");
  const [groupMax, setGroupMax] = useState(5);
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);
  const [avatarImageSrc, setAvatarImageSrc] = useState(SAMPLE_IMAGE);

  // Handle image upload
  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarImageSrc(reader.result as string);
      setUploadStatus("Image uploaded successfully!");
      setTimeout(() => setUploadStatus(""), 3000);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle random avatar generation
  const handleRandomAvatar = useCallback(() => {
    const randomId = Math.floor(Math.random() * 100);
    setAvatarImageSrc(`https://randomuser.me/api/portraits/${randomId % 2 === 0 ? 'women' : 'men'}/${randomId}.jpg`);
  }, []);

  // Sizes configuration
  const sizes: { value: AvatarSize; label: string; px: number }[] = [
    { value: "xs", label: "XS", px: 24 },
    { value: "sm", label: "SM", px: 32 },
    { value: "md", label: "MD", px: 40 },
    { value: "lg", label: "LG", px: 48 },
    { value: "xl", label: "XL", px: 64 },
    { value: "2xl", label: "2XL", px: 80 },
  ];

  // Shapes
  const shapes: { value: AvatarShape; label: string }[] = [
    { value: "circle", label: "Circle" },
    { value: "rounded", label: "Rounded" },
    { value: "square", label: "Square" },
  ];

  // Statuses
  const statuses: { value: AvatarStatus; label: string; color: string }[] = [
    { value: "online", label: "Online", color: "bg-emerald-500" },
    { value: "offline", label: "Offline", color: "bg-gray-400" },
    { value: "away", label: "Away", color: "bg-amber-400" },
    { value: "busy", label: "Busy", color: "bg-red-500" },
    { value: "none", label: "None", color: "bg-transparent" },
  ];

  // Layout types
  const layouts: { value: AvatarGroupLayout; label: string; icon: React.ReactNode }[] = [
    { value: "stack", label: "Stack", icon: <Layers size={16} /> },
    { value: "grid", label: "Grid", icon: <Grid size={16} /> },
    { value: "list", label: "List", icon: <List size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                <User size={28} className="text-gray-700 dark:text-gray-300" />
                Avatar Component System
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                A comprehensive, feature-rich avatar component with support for images, initials, status indicators, badges, groups, and more
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRandomAvatar}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} />
                Random Avatar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Status Toast */}
        <AnimatePresence>
          {uploadStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
            >
              {uploadStatus}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Avatar Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Live Avatar Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Live Preview
              </h2>
              
              <div className="flex flex-col items-center">
                <Avatar
                  src={avatarImageSrc}
                  name="John Doe"
                  alt="User avatar"
                  size={selectedSize}
                  shape={selectedShape}
                  status={selectedStatus}
                  statusAnimated={true}
                  badgeCount={3}
                  verified={true}
                  ring={true}
                  ringAnimated={false}
                  tooltip="Click to view profile"
                  uploadable={showUploadOverlay}
                  onUpload={handleImageUpload}
                  onClick={() => console.log("Avatar clicked")}
                  className="transition-all duration-300"
                />
                
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Product Designer</p>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 w-full space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Size:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{selectedSize}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Shape:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{selectedShape}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{selectedStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Settings size={18} />
                Controls
              </h2>

              {/* Size Controls */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                  Size
                </label>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedSize(s.value)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedSize === s.value
                          ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shape Controls */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                  Shape
                </label>
                <div className="flex gap-2">
                  {shapes.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedShape(s.value)}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${
                        selectedShape === s.value
                          ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Controls */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                  Status
                </label>
                <div className="flex gap-2 flex-wrap">
                  {statuses.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedStatus(s.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedStatus === s.value
                          ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show Upload Overlay</span>
                  <button
                    onClick={() => setShowUploadOverlay(!showUploadOverlay)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showUploadOverlay ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showUploadOverlay ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Variants Showcase */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Star size={20} className="text-amber-500" />
            Avatar Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Image Avatar */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <div className="flex justify-center mb-3">
                <Avatar src={SAMPLE_IMAGE} name="John Doe" size="lg" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Image Avatar</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">With fallback support</p>
            </div>

            {/* Initials Avatar */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <div className="flex justify-center mb-3">
                <Avatar name="Jane Smith" size="lg" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Initials Avatar</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Auto-generated from name</p>
            </div>

            {/* Icon Avatar */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <div className="flex justify-center mb-3">
                <Avatar icon={<Music size={24} />} size="lg" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Icon Avatar</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Custom icon support</p>
            </div>

            {/* Custom Color Avatar */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <div className="flex justify-center mb-3">
                <Avatar name="Custom Color" size="lg" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Colorful Avatar</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Deterministic colors</p>
            </div>
          </div>
        </div>

        {/* Status Indicators Showcase */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <MessageCircle size={20} className="text-blue-500" />
            Status Indicators
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-wrap justify-center gap-8">
              {statuses.filter(s => s.value !== "none").map(status => (
                <div key={status.value} className="text-center">
                  <Avatar
                    name="User"
                    size="xl"
                    status={status.value}
                    statusAnimated={status.value === "online"}
                    className="mb-2"
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-2">
                    {status.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {status.value === "online" ? "With pulse animation" : "Static indicator"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges and Verification */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Award size={20} className="text-purple-500" />
            Badges & Verification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <div className="flex justify-center mb-3">
                <Avatar name="Verified User" size="xl" verified={true} />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Verified Badge</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Blue checkmark</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <div className="flex justify-center mb-3">
                <Avatar name="Notification" size="xl" badgeCount={5} badgeColor="red" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Notification Badge</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Count indicator</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <div className="flex justify-center mb-3">
                <Avatar name="Custom Badge" size="xl" badge="⭐" badgeColor="amber" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Custom Badge</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Custom content support</p>
            </div>
          </div>
        </div>

        {/* Avatar With Label */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <User size={20} className="text-green-500" />
            Avatar With Label
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Label Position: Right</h3>
              <div className="space-y-3">
                {teamMembers.slice(0, 3).map((member, i) => (
                  <AvatarWithLabel
                    key={i}
                    src={member.src}
                    name={member.name}
                    label={member.name}
                    sublabel={member.role}
                    status={member.status}
                    size="md"
                    labelPosition="right"
                  />
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Label Position: Bottom</h3>
              <div className="flex flex-wrap gap-6 justify-center">
                {teamMembers.slice(0, 3).map((member, i) => (
                  <AvatarWithLabel
                    key={i}
                    src={member.src}
                    name={member.name}
                    label={member.name}
                    sublabel={member.role}
                    status={member.status}
                    size="lg"
                    labelPosition="bottom"
                    wrapperClassName="w-24"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Group Showcase */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Users size={20} className="text-indigo-500" />
            Avatar Groups
          </h2>
          
          {/* Group Controls */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
            <div className="flex flex-wrap gap-6 justify-between items-center">
              <div className="flex gap-3">
                {layouts.map(layout => (
                  <button
                    key={layout.value}
                    onClick={() => setGroupLayout(layout.value)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                      groupLayout === layout.value
                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {layout.icon}
                    {layout.label}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Max visible:</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={groupMax}
                  onChange={(e) => setGroupMax(parseInt(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{groupMax}</span>
              </div>
            </div>
          </div>

          {/* Group Display */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <AvatarGroup
              items={teamMembers}
              size="lg"
              layout={groupLayout}
              max={groupMax}
              showAddButton={true}
              onAddClick={() => console.log("Add member clicked")}
              onOverflowClick={() => console.log("Overflow clicked")}
            />
          </div>
        </div>

        {/* Interactive Examples */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" />
            Interactive Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Example */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Upload Avatar</h3>
              <div className="flex flex-col items-center">
                <Avatar
                  src={avatarImageSrc}
                  name="Upload Avatar"
                  size="xl"
                  uploadable={true}
                  onUpload={handleImageUpload}
                  ring={true}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Click on the avatar to upload a new image
                </p>
              </div>
            </div>

            {/* Clickable Avatar */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Clickable Avatar</h3>
              <div className="flex flex-col items-center">
                <Avatar
                  name="Click Me"
                  size="xl"
                  onClick={() => alert("Avatar clicked!")}
                  ring={true}
                  ringAnimated={true}
                  tooltip="Click me!"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Hover for tooltip, click for action
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Size Comparison */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Eye size={20} className="text-blue-500" />
            Size Comparison
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 overflow-x-auto">
            <div className="flex items-center justify-around min-w-[600px]">
              {sizes.map(size => (
                <div key={size.value} className="text-center">
                  <Avatar
                    name="JD"
                    size={size.value}
                    status="online"
                    className="mb-2"
                  />
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-2">
                    {size.label}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {size.px}px
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Camera size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Upload</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">Image upload with preview</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Verified</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Verification badges</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={16} className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Notifications</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">Count badges</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Groups</span>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">Stack, grid, or list</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for Users icon
const Users = ({ size }: { size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);