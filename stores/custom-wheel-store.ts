"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {
  type CustomWheel,
  type CustomWheelOption,
  createDefaultOptions,
  createOptionId,
  uniqueSlug,
  stashPendingCustomWheel,
} from "@/lib/custom-wheel"

type CustomWheelStore = {
  wheels: CustomWheel[]
  upsertWheel: (wheel: CustomWheel) => void
  saveNewWheel: (input: {
    name: string
    description: string
    options: CustomWheelOption[]
  }) => CustomWheel
  updateWheelBySlug: (
    slug: string,
    patch: Partial<Pick<CustomWheel, "name" | "description" | "options">>,
  ) => CustomWheel | null
  getBySlug: (slug: string) => CustomWheel | undefined
  deleteBySlug: (slug: string) => void
  listSlugs: () => string[]
}

export const useCustomWheelStore = create<CustomWheelStore>()(
  persist(
    (set, get) => ({
      wheels: [],

      upsertWheel: (wheel) => {
        set((state) => {
          const idx = state.wheels.findIndex((w) => w.slug === wheel.slug)
          if (idx === -1) return { wheels: [wheel, ...state.wheels] }
          const next = [...state.wheels]
          next[idx] = wheel
          return { wheels: next }
        })
      },

      saveNewWheel: ({ name, description, options }) => {
        const cleaned = options
          .map((o) => ({
            ...o,
            id: o.id || createOptionId(),
            name: o.name.trim(),
            enabled: o.enabled !== false,
            weight: Math.max(1, o.weight || 1),
          }))
          .filter((o) => o.name.length > 0)

        const finalOptions = cleaned.length > 0 ? cleaned : createDefaultOptions(4)
        const now = new Date().toISOString()
        const slug = uniqueSlug(name, get().listSlugs())
        const wheel: CustomWheel = {
          id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          slug,
          name: name.trim() || "Untitled Wheel",
          description: description.trim(),
          options: finalOptions,
          createdAt: now,
          updatedAt: now,
        }
        get().upsertWheel(wheel)
        stashPendingCustomWheel(wheel)
        return wheel
      },

      getBySlug: (slug) =>
        get().wheels.find((w) => w.slug.toLowerCase() === slug.toLowerCase()),

      updateWheelBySlug: (slug, patch) => {
        const existing = get().getBySlug(slug)
        if (!existing) return null

        const options =
          patch.options !== undefined
            ? patch.options
                .map((o) => ({
                  ...o,
                  id: o.id || createOptionId(),
                  name: o.name.trim(),
                  enabled: o.enabled !== false,
                  weight: Math.max(1, o.weight || 1),
                }))
                .filter((o) => o.name.length > 0)
            : existing.options

        const updated: CustomWheel = {
          ...existing,
          name:
            patch.name !== undefined
              ? patch.name.trim() || existing.name
              : existing.name,
          description:
            patch.description !== undefined
              ? patch.description
              : existing.description,
          options: options.length >= 1 ? options : existing.options,
          updatedAt: new Date().toISOString(),
        }
        get().upsertWheel(updated)
        return updated
      },

      deleteBySlug: (slug) => {
        set((state) => ({
          wheels: state.wheels.filter((w) => w.slug.toLowerCase() !== slug.toLowerCase()),
        }))
      },

      listSlugs: () => get().wheels.map((w) => w.slug),
    }),
    {
      name: "custom-wheels",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ wheels: state.wheels }),
      // Keep freshly created wheels if rehydrate races with navigation
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as { wheels?: CustomWheel[] } | undefined)?.wheels || []
        const current = currentState.wheels || []
        const bySlug = new Map<string, CustomWheel>()
        for (const w of persisted) bySlug.set(w.slug.toLowerCase(), w)
        for (const w of current) {
          const key = w.slug.toLowerCase()
          const prev = bySlug.get(key)
          if (!prev || (w.updatedAt || "") >= (prev.updatedAt || "")) {
            bySlug.set(key, w)
          }
        }
        return {
          ...currentState,
          wheels: Array.from(bySlug.values()).sort((a, b) =>
            (b.updatedAt || "").localeCompare(a.updatedAt || ""),
          ),
        }
      },
    },
  ),
)
