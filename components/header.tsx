"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Settings,
  HelpCircle,
  Menu,
  Gamepad2,
  LayoutGrid,
  ChevronDown,
  Plus,
} from "lucide-react";
import MyWheelsMenu from "@/components/my-wheels-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  WHEEL_CATEGORIES,
  SPIN_WHEELS_BASE_PATH,
  type WheelItem,
} from "@/lib/wheel-categories";
const CREATE_WHEEL_HREF = "/create-custom-wheel-spinner";

function CreateWheelButton({ className }: { className?: string }) {
  return (
    <Button
      size="sm"
      className={cn(
        "font-spin-display font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:text-emerald-900 shadow-none",
        className,
      )}
      asChild
    >
      <Link href={CREATE_WHEEL_HREF}>
        <Plus className="mr-1.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
        <span className="lg:hidden">Create</span>
        <span className="hidden lg:inline">Create Custom Wheel</span>
      </Link>
    </Button>
  );
}
interface HeaderProps {
  onOpenSettings: () => void;
  onOpenGames?: () => void;
}

function WheelMenuItem({
  item,
  onNavigate,
}: {
  item: WheelItem;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const content = (
    <>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: item.bg, color: item.color }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
      </span>
      <span className="truncate font-spin-display text-sm font-semibold text-gray-800">
        {item.label}
      </span>
    </>
  );

  const className = cn(
    "flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors",
    item.href
      ? "hover:bg-white cursor-pointer"
      : "opacity-40 cursor-not-allowed"
  );

  if (!item.href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={item.href} onClick={onNavigate} className={className}>
      {content}
    </Link>
  );
}

export default function Header({ onOpenSettings, onOpenGames }: HeaderProps) {
  const [wheelsOpen, setWheelsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const wheelsButtonRef = useRef<HTMLButtonElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wheelsOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedButton = wheelsButtonRef.current?.contains(target);
      const clickedMenu = megaMenuRef.current?.contains(target);
      if (!clickedButton && !clickedMenu) {
        setWheelsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWheelsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [wheelsOpen]);

  const closeMobile = () => setMobileOpen(false);

  const openGamesFromMobile = () => {
    closeMobile();
    onOpenGames?.();
  };

  const openSettingsFromMobile = () => {
    closeMobile();
    onOpenSettings();
  };

  const openAllWheelsFromMobile = () => {
    closeMobile();
    setWheelsOpen(true);
  };

  return (
    <header className="relative z-50 w-full border-b bg-white font-spin-body shadow-sm">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="relative flex h-16 w-full items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 shrink items-center space-x-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500">
              <div className="h-4 w-4 rounded-full bg-green-600"></div>
            </div>
            <span className="hidden font-spin-display text-xl font-bold text-gray-800 sm:inline">
              Picker Wheel
            </span>
          </Link>

          {/* Center: My Wheels + Create Wheel (lg+ — md width is too tight for center + right nav) */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            <MyWheelsMenu />
            <CreateWheelButton />
          </div>

          {/* Right navigation */}
          <nav className="hidden items-center space-x-1 font-spin-display lg:flex">
            {onOpenGames && (
              <Button
                variant="ghost"
                size="sm"
                className="font-spin-display font-semibold text-gray-600"
                onClick={onOpenGames}
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                Games
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="font-spin-display font-semibold text-gray-600"
              onClick={onOpenSettings}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="font-spin-display font-semibold text-gray-600"
              asChild
            >
              <Link href="/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQ
              </Link>
            </Button>

            <Button
              ref={wheelsButtonRef}
              variant="ghost"
              size="sm"
              className={cn(
                "font-spin-display font-semibold text-gray-600",
                wheelsOpen && "bg-accent text-accent-foreground"
              )}
              aria-expanded={wheelsOpen}
              aria-haspopup="true"
              onClick={() => setWheelsOpen((open) => !open)}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              All Wheels
              <ChevronDown
                className={cn(
                  "ml-1 h-3.5 w-3.5 transition-transform",
                  wheelsOpen && "rotate-180"
                )}
              />
            </Button>
          </nav>

          {/* Mobile / tablet */}
          <div className="flex shrink-0 items-center gap-0.5 lg:hidden">
            <div className="hidden min-[420px]:block">
              <MyWheelsMenu />
            </div>
            <CreateWheelButton className="px-2" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="flex w-[min(100%,20rem)] flex-col gap-0 p-0">
          <SheetHeader className="border-b px-4 py-4 text-left">
            <SheetTitle className="font-spin-display text-lg">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 font-spin-display">
            <div className="mb-2 min-[420px]:hidden">
              <MyWheelsMenu />
            </div>
            {onOpenGames && (
              <Button
                variant="ghost"
                className="h-11 justify-start px-3 text-base font-semibold text-gray-700"
                onClick={openGamesFromMobile}
              >
                <Gamepad2 className="mr-3 h-5 w-5" />
                Games
              </Button>
            )}
            <Button
              variant="ghost"
              className="h-11 justify-start px-3 text-base font-semibold text-gray-700"
              onClick={openSettingsFromMobile}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="h-11 justify-start px-3 text-base font-semibold text-gray-700"
              asChild
            >
              <Link href="/help" onClick={closeMobile}>
                <HelpCircle className="mr-3 h-5 w-5" />
                FAQ
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="h-11 justify-start px-3 text-base font-semibold text-gray-700"
              onClick={openAllWheelsFromMobile}
            >
              <LayoutGrid className="mr-3 h-5 w-5" />
              All Wheels
            </Button>
            <div className="my-2 border-t" />
            <Button
              className="h-11 justify-start bg-emerald-100 px-3 text-base font-semibold text-emerald-800 hover:bg-emerald-200 hover:text-emerald-900"
              asChild
            >
              <Link href={CREATE_WHEEL_HREF} onClick={closeMobile}>
                <Plus className="mr-3 h-5 w-5" strokeWidth={2.5} />
                Create Custom Wheel
              </Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Full-width megamenu — masonry columns avoid empty space under short categories */}
      {wheelsOpen && (
        <div
          ref={megaMenuRef}
          className="absolute left-0 right-0 top-full z-50 w-full border-t border-gray-200 bg-white shadow-xl"
        >
          <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-spin-body text-sm text-gray-500">
                Browse wheels by category
              </p>
              <Link
                href={SPIN_WHEELS_BASE_PATH}
                onClick={() => setWheelsOpen(false)}
                className="font-spin-display text-sm font-semibold text-green-700 hover:text-green-800"
              >
                View all categories →
              </Link>
            </div>
            <div className="columns-1 gap-x-6 sm:columns-2 lg:columns-3 xl:columns-4">
              {WHEEL_CATEGORIES.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <div
                    key={category.id}
                    className="mb-5 break-inside-avoid rounded-2xl border border-gray-100 bg-gray-50/60 p-3"
                  >
                    <Link
                      href={`${SPIN_WHEELS_BASE_PATH}/${category.id}`}
                      onClick={() => setWheelsOpen(false)}
                      className="mb-2 flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-opacity hover:opacity-90"
                      style={{ backgroundColor: category.bg }}
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                        style={{ backgroundColor: category.color }}
                      >
                        <CategoryIcon className="h-4 w-4" strokeWidth={2.25} />
                      </span>
                      <h3
                        className="truncate font-spin-display text-base font-bold leading-tight"
                        style={{ color: category.color }}
                      >
                        {category.title}
                      </h3>
                    </Link>
                    <div className="flex flex-col gap-0.5">
                      {category.items.map((item) => (
                        <WheelMenuItem
                          key={item.label}
                          item={item}
                          onNavigate={() => setWheelsOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
