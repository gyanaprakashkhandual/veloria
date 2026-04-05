"use client";

import React, { useState } from "react";
import { Home, Folder, File, ShoppingCart, Package, CreditCard, CheckCircle, Settings, Users, Code, Layers } from "lucide-react";
import { Breadcrumb } from "../../../ui/navigations/breadcrumb/Breadcrumb.ui";
import type { BreadcrumbItem } from "../../../ui/navigations/breadcrumb/Breadcrumb.ui";

// ─── Reusable layout helpers ──────────────────────────────────────────────────

function PageSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
      </div>
      {children}
    </section>
  );
}

function DemoCard({
  label,
  badge,
  children,
}: {
  label: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{label}</span>
        {badge && (
          <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function ActiveBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg w-fit">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Active: <span className="font-semibold text-gray-700 dark:text-gray-200">{label}</span>
      </span>
    </div>
  );
}

// ─── Static item sets ─────────────────────────────────────────────────────────

const basicItems: BreadcrumbItem[] = [
  { id: "home", label: "Home" },
  { id: "category", label: "Category" },
  { id: "product", label: "Product" },
];

const deepItems: BreadcrumbItem[] = [
  { id: "home", label: "Home" },
  { id: "settings", label: "Settings" },
  { id: "team", label: "Team" },
  { id: "billing", label: "Billing" },
  { id: "plan", label: "Upgrade Plan" },
];

const veryDeepItems: BreadcrumbItem[] = [
  { id: "dash", label: "Dashboard" },
  { id: "org", label: "Organisation" },
  { id: "eng", label: "Engineering" },
  { id: "proj", label: "Projects" },
  { id: "ds", label: "Design System" },
  { id: "comp", label: "Breadcrumb" },
];

const fileItems: BreadcrumbItem[] = [
  { id: "root", label: "My Drive", icon: <Home size={13} /> },
  { id: "work", label: "Work", icon: <Folder size={13} /> },
  { id: "q4", label: "Q4 2025", icon: <Folder size={13} /> },
  { id: "report", label: "Annual Report.pdf", icon: <File size={13} /> },
];

const ecommerceItems: BreadcrumbItem[] = [
  { id: "cart", label: "Cart", icon: <ShoppingCart size={13} /> },
  { id: "shipping", label: "Shipping", icon: <Package size={13} /> },
  { id: "payment", label: "Payment", icon: <CreditCard size={13} /> },
  { id: "confirm", label: "Confirmation", icon: <CheckCircle size={13} /> },
];

const docsItems: BreadcrumbItem[] = [
  { id: "docs", label: "Docs" },
  { id: "guide", label: "Guides" },
  { id: "auth", label: "Authentication" },
  { id: "jwt", label: "JWT Tokens" },
];

const adminItems: BreadcrumbItem[] = [
  { id: "dash", label: "Dashboard", icon: <Layers size={13} /> },
  { id: "org", label: "Acme Corp", icon: <Settings size={13} /> },
  { id: "team", label: "Engineering", icon: <Code size={13} /> },
  { id: "members", label: "Members", icon: <Users size={13} /> },
];

const disabledItems: BreadcrumbItem[] = [
  { id: "home", label: "Home" },
  { id: "admin", label: "Admin Panel", disabled: true },
  { id: "users", label: "User Settings" },
];

const hrefItems: BreadcrumbItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "post", label: "How breadcrumbs work" },
];

// ─── Interactive tracker ──────────────────────────────────────────────────────

function InteractiveTracker({
  items,
  defaultId,
  ...props
}: {
  items: BreadcrumbItem[];
  defaultId: string;
} & Omit<React.ComponentProps<typeof Breadcrumb>, "items" | "onItemClick" | "defaultActiveId">) {
  const [activeId, setActiveId] = useState(defaultId);
  const current = items.find((i) => i.id === activeId);

  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb
        items={items}
        defaultActiveId={activeId}
        onItemClick={(item) => setActiveId(item.id)}
        {...props}
      />
      <ActiveBadge label={current?.label ?? "—"} />
    </div>
  );
}

// ─── Main showcase page ───────────────────────────────────────────────────────

export default function BreadcrumbShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 sm:px-8 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2">
            Component showcase
          </p>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
            Breadcrumb
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
            All variants, separators, sizes, states, and real-world usage patterns
            for the <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">Breadcrumb</code> component.
          </p>
        </div>

        {/* ── 1. Variants ── */}
        <PageSection title="Variants">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DemoCard label='variant="default"'>
              <Breadcrumb items={basicItems} variant="default" separatorType="chevron" />
            </DemoCard>

            <DemoCard label='variant="filled"'>
              <Breadcrumb items={basicItems} variant="filled" separatorType="chevron" />
            </DemoCard>

            <DemoCard label='variant="ghost"'>
              <Breadcrumb items={basicItems} variant="ghost" separatorType="chevron" />
            </DemoCard>

            <DemoCard label='variant="underline"'>
              <Breadcrumb items={basicItems} variant="underline" separatorType="chevron" />
            </DemoCard>
          </div>
        </PageSection>

        {/* ── 2. Separators ── */}
        <PageSection title="Separators">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DemoCard label='separatorType="chevron"'>
              <Breadcrumb items={basicItems} separatorType="chevron" />
            </DemoCard>

            <DemoCard label='separatorType="slash"'>
              <Breadcrumb items={basicItems} separatorType="slash" />
            </DemoCard>

            <DemoCard label='separatorType="dot"'>
              <Breadcrumb items={basicItems} separatorType="dot" />
            </DemoCard>

            <DemoCard label='separatorType="arrow"'>
              <Breadcrumb items={basicItems} separatorType="arrow" />
            </DemoCard>

            <DemoCard label='separatorType="custom" — using a › glyph'>
              <Breadcrumb
                items={basicItems}
                separatorType="custom"
                customSeparator={
                  <span className="text-gray-300 dark:text-gray-600 text-sm px-0.5 font-light">›</span>
                }
              />
            </DemoCard>
          </div>
        </PageSection>

        {/* ── 3. Sizes ── */}
        <PageSection title="Sizes">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-6">
            {(["sm", "md", "lg", "xl"] as const).map((sz) => (
              <div key={sz} className="flex items-center gap-5">
                <span className="text-[11px] font-mono text-gray-300 dark:text-gray-600 w-5 shrink-0">
                  {sz}
                </span>
                <div className="w-px self-stretch bg-gray-100 dark:bg-gray-800" />
                <Breadcrumb items={basicItems} size={sz} separatorType="chevron" />
              </div>
            ))}
          </div>
        </PageSection>

        {/* ── 4. With icons ── */}
        <PageSection title="With icons">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DemoCard label="File manager — default">
              <Breadcrumb items={fileItems} variant="default" separatorType="chevron" />
            </DemoCard>

            <DemoCard label="File manager — filled">
              <Breadcrumb items={fileItems} variant="filled" separatorType="chevron" />
            </DemoCard>

            <DemoCard label="E-commerce checkout — arrow + filled">
              <Breadcrumb items={ecommerceItems} variant="filled" separatorType="arrow" />
            </DemoCard>

            <DemoCard label="Admin path — ghost + dot">
              <Breadcrumb items={adminItems} variant="ghost" separatorType="dot" />
            </DemoCard>
          </div>
        </PageSection>

        {/* ── 5. Collapsed / overflow ── */}
        <PageSection title="Collapsed & overflow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DemoCard label="maxItems={3} — click ··· to expand" badge="collapsible">
              <Breadcrumb items={deepItems} separatorType="chevron" maxItems={3} />
            </DemoCard>

            <DemoCard label="maxItems={3} — filled + arrow" badge="collapsible">
              <Breadcrumb items={deepItems} variant="filled" separatorType="arrow" maxItems={3} />
            </DemoCard>

            <DemoCard label="maxItems={2} — aggressive collapse">
              <Breadcrumb items={deepItems} separatorType="slash" maxItems={2} />
            </DemoCard>

            <DemoCard label="maxItems={4} — one hidden item">
              <Breadcrumb items={deepItems} variant="ghost" separatorType="dot" maxItems={4} />
            </DemoCard>

            <DemoCard label="6 items — maxItems={3} — underline" badge="collapsible">
              <Breadcrumb items={veryDeepItems} variant="underline" separatorType="chevron" maxItems={3} />
            </DemoCard>
          </div>
        </PageSection>

        {/* ── 6. States ── */}
        <PageSection title="States">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DemoCard label="Disabled item">
              <Breadcrumb items={disabledItems} separatorType="chevron" />
            </DemoCard>

            <DemoCard label="href-based navigation items">
              <Breadcrumb items={hrefItems} separatorType="slash" variant="ghost" />
            </DemoCard>

            <DemoCard label="Single item — root only">
              <Breadcrumb items={[{ id: "home", label: "Home", icon: <Home size={13} /> }]} />
            </DemoCard>

            <DemoCard label="Two items">
              <Breadcrumb items={[{ id: "home", label: "Home" }, { id: "about", label: "About Us" }]} />
            </DemoCard>

            <DemoCard label="Long label — truncation">
              <Breadcrumb
                items={[
                  { id: "home", label: "Home" },
                  { id: "cat", label: "An Extremely Long Category Name That Should Truncate" },
                  { id: "item", label: "Item" },
                ]}
              />
            </DemoCard>

            <DemoCard label="startContent + endContent slots">
              <Breadcrumb
                items={basicItems}
                separatorType="chevron"
                startContent={
                  <span className="text-[10px] font-semibold bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300 px-2 py-0.5 rounded-full">
                    v2.0
                  </span>
                }
                endContent={
                  <span className="text-[10px] text-gray-400 dark:text-gray-600">↗</span>
                }
              />
            </DemoCard>

            <DemoCard label="activeItemClassName override — custom style">
              <Breadcrumb
                items={basicItems}
                variant="default"
                activeItemClassName="bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 rounded-lg"
              />
            </DemoCard>

            <DemoCard label="itemClassName — custom style on all items">
              <Breadcrumb
                items={basicItems}
                variant="ghost"
                itemClassName="italic"
              />
            </DemoCard>
          </div>
        </PageSection>

        {/* ── 7. Interactive ── */}
        <PageSection title="Interactive & stateful">
          <div className="grid grid-cols-1 gap-3">
            <DemoCard label="Click any item to navigate — onItemClick + defaultActiveId" badge="stateful">
              <InteractiveTracker
                items={docsItems}
                defaultId="guide"
                variant="filled"
                separatorType="chevron"
                size="md"
              />
            </DemoCard>

            <DemoCard label="Collapse toggle — onCollapsedChange callback" badge="stateful">
              <InteractiveTracker
                items={veryDeepItems}
                defaultId="comp"
                variant="default"
                separatorType="chevron"
                maxItems={3}
                size="md"
              />
            </DemoCard>

            <DemoCard label="Icons + stateful navigation — ghost + slash" badge="stateful">
              <InteractiveTracker
                items={fileItems}
                defaultId="report"
                variant="ghost"
                separatorType="slash"
                size="md"
              />
            </DemoCard>
          </div>
        </PageSection>

        {/* ── 8. Real-world contexts ── */}
        <PageSection title="Real-world contexts">
          <div className="grid grid-cols-1 gap-3">
            <DemoCard label="Documentation site — ghost + slash + sm">
              <Breadcrumb items={docsItems} variant="ghost" separatorType="slash" size="sm" />
            </DemoCard>

            <DemoCard label="E-commerce checkout flow — filled + arrow + md">
              <Breadcrumb items={ecommerceItems} variant="filled" separatorType="arrow" size="md" />
            </DemoCard>

            <DemoCard label="File manager path — default + chevron + sm">
              <Breadcrumb items={fileItems} variant="default" separatorType="chevron" size="sm" />
            </DemoCard>

            <DemoCard label="Admin dashboard — collapsed deep path + underline + chevron">
              <Breadcrumb
                items={veryDeepItems}
                variant="underline"
                separatorType="chevron"
                maxItems={3}
                size="md"
              />
            </DemoCard>

            <DemoCard label="Minimal blog post path — ghost + dot + sm">
              <Breadcrumb
                items={[
                  { id: "home", label: "Home" },
                  { id: "blog", label: "Blog" },
                  { id: "post", label: "Getting started with design systems" },
                ]}
                variant="ghost"
                separatorType="dot"
                size="sm"
              />
            </DemoCard>
          </div>
        </PageSection>

      </div>
    </div>
  );
}