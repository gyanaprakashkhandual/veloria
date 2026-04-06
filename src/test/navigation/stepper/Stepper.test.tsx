// StepperShowcase.tsx
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stepper,
  type StepItem,
  type StepperSize,
  type StepperVariant,
  type StepperOrientation,
  type StepperLabelPlacement,
} from "../../../ui/navigations/stepper/Stepper.ui";
import {
  User,
  Mail,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  ShoppingBag,
  Truck,
  Package,
  Home,
  MapPin,
  Phone,
  Building,
  Globe,
  Heart,
  Star,
  Award,
  Shield,
  Rocket,
  Zap,
  Sun,
  Moon,
  Settings,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Info,
  Send,
  Download,
  Upload,
  Save,
  Printer,
  Eye,
  Edit,
  Trash2,
  Copy,
  Plus,
  Minus,
  User2,
} from "lucide-react";

// Sample step definitions
const basicSteps: StepItem[] = [
  { id: "info", title: "Personal Info", subtitle: "Your basic details", optional: false },
  { id: "contact", title: "Contact", subtitle: "How to reach you", optional: true },
  { id: "verify", title: "Verification", subtitle: "Confirm your identity", optional: false },
  { id: "complete", title: "Complete", subtitle: "Review and finish", optional: false },
];

const detailedSteps: StepItem[] = [
  { 
    id: "account", 
    title: "Account Setup", 
    subtitle: "Create your account",
    description: "Choose a username and password for your account. Make sure to use a strong password.",
    optional: false 
  },
  { 
    id: "profile", 
    title: "Profile", 
    subtitle: "Tell us about yourself",
    description: "Add your personal information, bio, and profile picture.",
    optional: true 
  },
  { 
    id: "preferences", 
    title: "Preferences", 
    subtitle: "Customize your experience",
    description: "Select your notification preferences and theme settings.",
    optional: true 
  },
  { 
    id: "billing", 
    title: "Billing", 
    subtitle: "Payment method",
    description: "Add your payment information to complete setup.",
    optional: false 
  },
  { 
    id: "complete", 
    title: "Complete", 
    subtitle: "Review & finish",
    description: "Review all your information and complete the setup.",
    optional: false 
  },
];

const checkoutSteps: StepItem[] = [
  { 
    id: "cart", 
    title: "Shopping Cart", 
    subtitle: "Review items",
    icon: <ShoppingBag size={16} />,
    optional: false 
  },
  { 
    id: "shipping", 
    title: "Shipping", 
    subtitle: "Delivery address",
    icon: <Truck size={16} />,
    optional: false 
  },
  { 
    id: "payment", 
    title: "Payment", 
    subtitle: "Payment method",
    icon: <CreditCard size={16} />,
    optional: false 
  },
  { 
    id: "confirm", 
    title: "Confirmation", 
    subtitle: "Review order",
    icon: <CheckCircle size={16} />,
    optional: false 
  },
];

const onboardingSteps: StepItem[] = [
  { 
    id: "welcome", 
    title: "Welcome", 
    subtitle: "Get started",
    description: "Welcome to our platform! Let's get you set up in just a few steps.",
    icon: <Home size={16} />,
  },
  { 
    id: "team", 
    title: "Team Setup", 
    subtitle: "Invite members",
    description: "Invite your team members to collaborate on projects.",
    optional: true,
    icon: <User2 size={16} />,
  },
  { 
    id: "workspace", 
    title: "Workspace", 
    subtitle: "Configure workspace",
    description: "Set up your workspace preferences and integrations.",
    icon: <Settings size={16} />,
  },
  { 
    id: "launch", 
    title: "Launch", 
    subtitle: "Start using",
    description: "You're all set! Start using the platform now.",
    icon: <Rocket size={16} />,
  },
];

// Helper component for Users icon
const Users = ({ size }: { size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// Custom content components for steps
const PersonalInfoForm = ({ onValidChange }: { onValidChange?: (valid: boolean) => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  React.useEffect(() => {
    onValidChange?.(!!name && !!email && email.includes("@"));
  }, [name, email, onValidChange]);
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="john@example.com"
        />
      </div>
    </div>
  );
};

const ContactForm = () => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
      <input type="tel" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800" placeholder="+1 234 567 890" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
      <textarea className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800" rows={2} placeholder="Your address" />
    </div>
  </div>
);

const VerificationForm = () => (
  <div className="text-center py-8">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
      <Mail size={32} className="text-emerald-600 dark:text-emerald-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Verify Your Email</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">We've sent a verification link to your email address.</p>
    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Resend Email</button>
  </div>
);

const CompletionStep = () => (
  <div className="text-center py-8">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
      <CheckCircle size={32} className="text-emerald-600 dark:text-emerald-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Setup Complete!</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">Your account has been successfully created.</p>
  </div>
);

// Main showcase component
export default function StepperShowcase() {
  const [selectedSize, setSelectedSize] = useState<StepperSize>("md");
  const [selectedVariant, setSelectedVariant] = useState<StepperVariant>("default");
  const [selectedOrientation, setSelectedOrientation] = useState<StepperOrientation>("horizontal");
  const [selectedLabelPlacement, setSelectedLabelPlacement] = useState<StepperLabelPlacement>("bottom");
  const [linearMode, setLinearMode] = useState(false);
  const [clickableSteps, setClickableSteps] = useState(true);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showCustomContent, setShowCustomContent] = useState(false);
  const [activeStepExample, setActiveStepExample] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  // Step content for custom content demo
  const customContentSteps: StepItem[] = useMemo(() => [
    { 
      id: "info", 
      title: "Personal Info", 
      subtitle: "Your details",
      content: <PersonalInfoForm onValidChange={(valid) => valid && setCompletedSteps(prev => new Set([...prev, 0]))} />,
    },
    { 
      id: "contact", 
      title: "Contact", 
      subtitle: "How to reach you",
      content: <ContactForm />,
      optional: true,
    },
    { 
      id: "verify", 
      title: "Verification", 
      subtitle: "Confirm identity",
      content: <VerificationForm />,
    },
    { 
      id: "complete", 
      title: "Complete", 
      subtitle: "Finish",
      content: <CompletionStep />,
    },
  ], []);

  // Size options
  const sizes: { value: StepperSize; label: string }[] = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "XL" },
  ];

  // Variant options
  const variants: { value: StepperVariant; label: string; description: string }[] = [
    { value: "default", label: "Default", description: "Subtle bordered cards" },
    { value: "filled", label: "Filled", description: "Solid colored indicators" },
    { value: "ghost", label: "Ghost", description: "Minimal transparent style" },
    { value: "outline", label: "Outline", description: "Bordered with outline" },
  ];

  // Orientation options
  const orientations: { value: StepperOrientation; label: string }[] = [
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" },
  ];

  // Label placement options
  const labelPlacements: { value: StepperLabelPlacement; label: string }[] = [
    { value: "bottom", label: "Bottom" },
    { value: "right", label: "Right" },
  ];

  // Handle step change
  const handleStepChange = useCallback((index: number, step: StepItem) => {
    console.log("Step changed:", index, step);
    setActiveStepExample(index);
  }, []);

  // Handle complete
  const handleComplete = useCallback(() => {
    console.log("Stepper completed!");
    alert("All steps completed!");
  }, []);

  // Reset all settings
  const resetSettings = useCallback(() => {
    setSelectedSize("md");
    setSelectedVariant("default");
    setSelectedOrientation("horizontal");
    setSelectedLabelPlacement("bottom");
    setLinearMode(false);
    setClickableSteps(true);
    setShowNavigation(true);
    setShowCustomContent(false);
    setActiveStepExample(0);
    setCompletedSteps(new Set());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                <Rocket size={28} className="text-gray-700 dark:text-gray-300" />
                Stepper Component System
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                A comprehensive stepper component with multiple variants, orientations, and interactive features
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetSettings}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sticky top-24">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Settings size={16} />
                Controls
              </h2>
              
              <div className="space-y-4">
                {/* Size Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map(s => (
                      <button
                        key={s.value}
                        onClick={() => setSelectedSize(s.value)}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
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

                {/* Variant Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Variant
                  </label>
                  <div className="space-y-1">
                    {variants.map(v => (
                      <button
                        key={v.value}
                        onClick={() => setSelectedVariant(v.value)}
                        className={`w-full px-2 py-1.5 text-xs rounded-md transition-all text-left ${
                          selectedVariant === v.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="font-medium">{v.label}</div>
                        <div className="text-[10px] opacity-70">{v.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orientation Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Orientation
                  </label>
                  <div className="flex gap-2">
                    {orientations.map(o => (
                      <button
                        key={o.value}
                        onClick={() => setSelectedOrientation(o.value)}
                        className={`flex-1 px-2 py-1 text-xs rounded-md transition-all ${
                          selectedOrientation === o.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Label Placement (only for horizontal) */}
                {selectedOrientation === "horizontal" && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Label Placement
                    </label>
                    <div className="flex gap-2">
                      {labelPlacements.map(l => (
                        <button
                          key={l.value}
                          onClick={() => setSelectedLabelPlacement(l.value)}
                          className={`flex-1 px-2 py-1 text-xs rounded-md transition-all ${
                            selectedLabelPlacement === l.value
                              ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feature Toggles */}
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Linear Mode</span>
                    <button
                      onClick={() => setLinearMode(!linearMode)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        linearMode ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        linearMode ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Clickable Steps</span>
                    <button
                      onClick={() => setClickableSteps(!clickableSteps)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        clickableSteps ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        clickableSteps ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Navigation</span>
                    <button
                      onClick={() => setShowNavigation(!showNavigation)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        showNavigation ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showNavigation ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Custom Content</span>
                    <button
                      onClick={() => setShowCustomContent(!showCustomContent)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        showCustomContent ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showCustomContent ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Display */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Rocket size={18} />
                Live Preview
              </h2>
              
              <Stepper
                steps={showCustomContent ? customContentSteps : detailedSteps}
                size={selectedSize}
                variant={selectedVariant}
                orientation={selectedOrientation}
                labelPlacement={selectedLabelPlacement}
                linear={linearMode}
                clickable={clickableSteps}
                showNavigation={showNavigation}
                onStepChange={handleStepChange}
                onComplete={handleComplete}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Basic Examples */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Star size={20} className="text-amber-500" />
            Basic Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Horizontal Basic */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Horizontal Stepper</h3>
              <Stepper
                steps={basicSteps}
                size="md"
                variant="default"
                orientation="horizontal"
                showNavigation={false}
                bare
              />
            </div>

            {/* Vertical Basic */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Vertical Stepper</h3>
              <Stepper
                steps={basicSteps}
                size="md"
                variant="default"
                orientation="vertical"
                showNavigation={false}
                bare
              />
            </div>
          </div>
        </div>

        {/* Variant Showcase */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Award size={20} className="text-purple-500" />
            Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {variants.map(variant => (
              <div key={variant.value} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 capitalize">{variant.label}</h3>
                <Stepper
                  steps={basicSteps.slice(0, 3)}
                  size="md"
                  variant={variant.value}
                  orientation="horizontal"
                  showNavigation={false}
                  bare
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{variant.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Example */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <ShoppingBag size={20} className="text-emerald-500" />
            Checkout Flow Example
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <Stepper
              steps={checkoutSteps}
              size="lg"
              variant="filled"
              orientation="horizontal"
              showNavigation={true}
              onComplete={() => alert("Order placed successfully!")}
            />
          </div>
        </div>

        {/* Onboarding Example with Icons */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            Onboarding with Icons
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <Stepper
              steps={onboardingSteps}
              size="lg"
              variant="outline"
              orientation="vertical"
              showNavigation={true}
              onComplete={() => alert("Onboarding completed!")}
            />
          </div>
        </div>

        {/* Size Comparison */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Eye size={20} className="text-indigo-500" />
            Size Comparison
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="space-y-6">
              {sizes.map(size => (
                <div key={size.value}>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{size.label}</p>
                  <Stepper
                    steps={basicSteps.slice(0, 3)}
                    size={size.value}
                    variant="default"
                    orientation="horizontal"
                    showNavigation={false}
                    bare
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Settings size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Multiple Variants</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">4 visual styles to choose from</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Dual Orientation</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Horizontal and vertical layouts</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Interactive Steps</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">Clickable, linear, or custom</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Accessibility</span>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">ARIA labels and keyboard nav</p>
          </div>
        </div>

        {/* Status Demo */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            Step Status Demo
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              This demo shows how you can programmatically set step statuses (error, warning, etc.)
            </p>
            <div className="flex gap-3 mb-6">
              <button className="px-3 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                Set Error on Step 1
              </button>
              <button className="px-3 py-1.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg">
                Set Warning on Step 2
              </button>
              <button className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg">
                Reset All
              </button>
            </div>
            <Stepper
              steps={basicSteps}
              size="md"
              variant="default"
              orientation="horizontal"
              showNavigation={true}
              bare
            />
          </div>
        </div>
      </div>
    </div>
  );
}