// ImageShowcase.tsx
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  ImageGallery,
  ImageCompare,
  ImageZoomable,
  ImageSkeleton,
  ImageErrorState,
  ImageOverlay,
  ImageCaption,
  ImageBadge,
  ImageActionBar,
  LightboxViewer,
  type ImageFit,
  type ImageRadius,
  type ImageAspectRatio,
  type ImageOverlayTrigger,
} from "../../../ui/data/image/Image.ui";
import {
  Star,
  Heart,
  Camera,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  Image as ImageIcon,
  Grid,
  Layers,
  Sliders,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  Sun,
  Moon,
  Eye,
  Info,
  Tag,
  Calendar,
  MapPin,
  Users,
  Award,
  Sparkles,
  RefreshCw,
} from "lucide-react";

// Sample image URL
const SAMPLE_IMAGE = "https://res.cloudinary.com/dvytvjplt/image/upload/v1765866608/profile_pricture_oemv94.jpg";

// Sample gallery images
const galleryImages = [
  { src: SAMPLE_IMAGE, alt: "Profile Image", caption: "Beautiful profile photo" },
  { src: "https://picsum.photos/id/1015/800/600", alt: "Mountain Landscape", caption: "Mountain landscape with scenic views" },
  { src: "https://picsum.photos/id/104/800/600", alt: "Waterfall", caption: "Serene waterfall in nature" },
  { src: "https://picsum.photos/id/106/800/600", alt: "Flowers", caption: "Colorful flowers blooming" },
  { src: "https://picsum.photos/id/107/800/600", alt: "Grass", caption: "Green grass field" },
  { src: "https://picsum.photos/id/116/800/600", alt: "Lake", caption: "Peaceful lake reflection" },
  { src: "https://picsum.photos/id/20/800/600", alt: "Coffee", caption: "Fresh brewed coffee" },
  { src: "https://picsum.photos/id/26/800/600", alt: "Venice", caption: "Venice canal view" },
];

// Before/After images for compare feature
const beforeImage = "https://picsum.photos/id/101/800/500";
const afterImage = "https://picsum.photos/id/1015/800/500";

// Main showcase component
export default function ImageShowcase() {
  const [selectedFit, setSelectedFit] = useState<ImageFit>("cover");
  const [selectedRadius, setSelectedRadius] = useState<ImageRadius>("lg");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<ImageAspectRatio>("video");
  const [selectedTrigger, setSelectedTrigger] = useState<ImageOverlayTrigger>("hover");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const [showCaption, setShowCaption] = useState(true);
  const [showBadge, setShowBadge] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showActionBar, setShowActionBar] = useState(true);

  // Fit options
  const fits: { value: ImageFit; label: string }[] = [
    { value: "cover", label: "Cover" },
    { value: "contain", label: "Contain" },
    { value: "fill", label: "Fill" },
    { value: "none", label: "None" },
    { value: "scale-down", label: "Scale Down" },
  ];

  // Radius options
  const radii: { value: ImageRadius; label: string }[] = [
    { value: "none", label: "None" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "XL" },
    { value: "2xl", label: "2XL" },
    { value: "full", label: "Full" },
  ];

  // Aspect ratio options
  const ratios: { value: ImageAspectRatio; label: string }[] = [
    { value: "auto", label: "Auto" },
    { value: "square", label: "Square (1:1)" },
    { value: "video", label: "Video (16:9)" },
    { value: "portrait", label: "Portrait (3:4)" },
    { value: "wide", label: "Wide (16:9)" },
    { value: "cinema", label: "Cinema (21:9)" },
  ];

  // Trigger options
  const triggers: { value: ImageOverlayTrigger; label: string }[] = [
    { value: "always", label: "Always Visible" },
    { value: "hover", label: "Show on Hover" },
    { value: "never", label: "Never Show" },
  ];

  // Handle download
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = SAMPLE_IMAGE;
    link.download = "image.jpg";
    link.click();
  }, []);

  // Handle zoom in/out (simulated)
  const [isZoomed, setIsZoomed] = useState(false);
  const handleZoomIn = useCallback(() => setIsZoomed(true), []);
  const handleZoomOut = useCallback(() => setIsZoomed(false), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                <ImageIcon size={28} className="text-gray-700 dark:text-gray-300" />
                Image Component System
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                A comprehensive image component with support for lightbox, galleries, compare sliders, zoom, and more
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setLightboxOpen(true)}
                className="px-4 py-2 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Maximize2 size={14} />
                Open Lightbox
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Image Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Live Image Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Eye size={18} />
                Live Preview
              </h2>
              
              <Image
                src={SAMPLE_IMAGE}
                alt="Sample image"
                fit={selectedFit}
                radius={selectedRadius}
                aspectRatio={selectedAspectRatio}
                caption={showCaption ? "Beautiful mountain landscape with scenic views" : undefined}
                captionPosition="inside-bottom"
                captionTrigger={selectedTrigger}
                badge={showBadge ? { label: "FEATURED", position: "top-right", color: "amber" } : undefined}
                overlay={showOverlay ? { gradient: "bottom", blur: false, trigger: selectedTrigger } : undefined}
                actionBar={showActionBar ? {
                  onZoomIn: handleZoomIn,
                  onZoomOut: isZoomed ? handleZoomOut : undefined,
                  onDownload: handleDownload,
                  onExpand: () => setLightboxOpen(true),
                  trigger: selectedTrigger,
                } : undefined}
                lightbox={true}
                lightboxSrc={SAMPLE_IMAGE}
                hoverable={hoverEnabled}
                className="transition-all duration-300"
              />
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedFit} • {selectedRadius} radius • {selectedAspectRatio} aspect ratio
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Settings size={18} />
                Controls
              </h2>

              <div className="space-y-5">
                {/* Fit Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Object Fit
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {fits.map(f => (
                      <button
                        key={f.value}
                        onClick={() => setSelectedFit(f.value)}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
                          selectedFit === f.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Radius Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Border Radius
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {radii.map(r => (
                      <button
                        key={r.value}
                        onClick={() => setSelectedRadius(r.value)}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
                          selectedRadius === r.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Aspect Ratio
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ratios.map(r => (
                      <button
                        key={r.value}
                        onClick={() => setSelectedAspectRatio(r.value)}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
                          selectedAspectRatio === r.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Overlay Trigger Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Overlay Trigger
                  </label>
                  <div className="flex gap-2">
                    {triggers.map(t => (
                      <button
                        key={t.value}
                        onClick={() => setSelectedTrigger(t.value)}
                        className={`flex-1 px-2 py-1 text-xs rounded-md transition-all ${
                          selectedTrigger === t.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Hover Effect</span>
                    <button
                      onClick={() => setHoverEnabled(!hoverEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        hoverEnabled ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        hoverEnabled ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Caption</span>
                    <button
                      onClick={() => setShowCaption(!showCaption)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        showCaption ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showCaption ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Badge</span>
                    <button
                      onClick={() => setShowBadge(!showBadge)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        showBadge ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showBadge ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Overlay</span>
                    <button
                      onClick={() => setShowOverlay(!showOverlay)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        showOverlay ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showOverlay ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Action Bar</span>
                    <button
                      onClick={() => setShowActionBar(!showActionBar)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        showActionBar ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showActionBar ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Variants */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Grid size={20} className="text-blue-500" />
            Image Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
              <Image src={SAMPLE_IMAGE} alt="Standard" radius="md" className="mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-2">Standard</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Basic image with radius</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
              <Image src={SAMPLE_IMAGE} alt="With Badge" radius="md" badge={{ label: "NEW", color: "emerald" }} className="mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-2">With Badge</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Featured badge overlay</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
              <Image src={SAMPLE_IMAGE} alt="With Caption" radius="md" caption="Beautiful view" captionPosition="inside-bottom" className="mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-2">With Caption</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Inside image caption</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
              <ImageZoomable src={SAMPLE_IMAGE} alt="Zoomable" radius="md" caption="Click to zoom" className="mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-2">Zoomable</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Click to zoom in/out</p>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Layers size={20} className="text-purple-500" />
            Image Gallery
          </h2>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <ImageGallery
              images={galleryImages}
              columns={4}
              gap="md"
              radius="lg"
              fit="cover"
              aspectRatio="square"
              lightbox={true}
              hoverable={true}
              badge={(img, index) => 
                index === 0 ? { label: "FEATURED", position: "top-right", color: "amber" } : undefined
              }
              overlay={{ gradient: "bottom", trigger: "hover" }}
            />
          </div>
        </div>

        {/* Image Compare Slider */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Sliders size={20} className="text-amber-500" />
            Before/After Compare
          </h2>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <ImageCompare
              before={{ src: beforeImage, alt: "Before", label: "BEFORE" }}
              after={{ src: afterImage, alt: "After", label: "AFTER" }}
              radius="xl"
              aspectRatio="video"
              initialPosition={50}
              className="max-w-2xl mx-auto"
            />
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Drag the slider to compare before and after images
            </p>
          </div>
        </div>

        {/* Lightbox Demo */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Maximize2 size={20} className="text-green-500" />
            Lightbox Viewer
          </h2>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => { setCurrentImageIndex(i); setLightboxOpen(true); }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={20} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Click any image to open the lightbox viewer
            </p>
          </div>
        </div>

        {/* Loading States */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <RefreshCw size={20} className="text-indigo-500" />
            Loading & Error States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
              <div className="w-full h-48">
                <ImageSkeleton radius="md" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-3">Loading State</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Skeleton placeholder</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
              <div className="w-full h-48">
                <ImageErrorState message="Failed to load image" radius="md" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-3">Error State</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">With retry option</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
              <Image
                src="https://invalid-url.com/image.jpg"
                alt="Invalid"
                radius="md"
                fallbackMessage="Custom error message"
                className="w-full h-48"
              />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-3">Custom Error</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">With custom message</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Maximize2 size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Lightbox</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">Full-screen image viewer</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <Grid size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Gallery</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Responsive image grids</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <Sliders size={16} className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Compare</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">Before/after slider</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <ZoomIn size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Zoom</span>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">Click/tap to zoom</p>
          </div>
        </div>
      </div>

      {/* Lightbox Component */}
      <LightboxViewer
        images={galleryImages}
        transition="slide"
        showThumbnails={true}
        showCounter={true}
        showDownload={true}
        showZoom={true}
        showRotate={true}
      />
    </div>
  );
}

// Helper component for custom icons if needed
const CustomPlayIcon = ({ size }: { size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);