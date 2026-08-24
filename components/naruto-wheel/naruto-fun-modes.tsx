"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { getNarutoCharacters } from "@/data/naruto-characters"
import { narutoClans } from "@/data/naruto-clans"
import { narutoKekkei, narutoNatures, narutoRanks, narutoSummons } from "@/data/naruto-natures"
import { narutoVillages } from "@/data/naruto-villages"
import { applyNarutoWheelUseCase, type NarutoWheelUseCaseId } from "@/lib/naruto-wheel-use-cases"
import { useWheelManagerStore, type NarutoWheelData } from "@/stores/wheel-manager-store"
import type { NarutoEntry } from "@/types/naruto-types"

const pick = (list: NarutoEntry[]) => list[Math.floor(Math.random() * list.length)]

const FIGHT_STORAGE = "naruto-fight-votes"

function readVotes(): Record<string, { a: number; b: number }> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(FIGHT_STORAGE) || "{}") as Record<string, { a: number; b: number }>
  } catch {
    return {}
  }
}

function writeVotes(votes: Record<string, { a: number; b: number }>) {
  localStorage.setItem(FIGHT_STORAGE, JSON.stringify(votes))
}

export function NarutoFunModes({ onApplyTemplate }: { onApplyTemplate: (id: NarutoWheelUseCaseId) => void }) {
  const wheel = useWheelManagerStore((state) =>
    (state.wheelsByTool["naruto-wheel"] || []).find((item) => item.id === state.currentWheelId) || null)
  const data = wheel?.data as NarutoWheelData | undefined
  const funMode = data?.funMode || "spin"
  const recent = Array.isArray(data?.recentResults) ? data.recentResults : []
  const [who, setWho] = useState<Record<string, string>>({})
  const [build, setBuild] = useState<Record<string, string>>({})
  const [team, setTeam] = useState<{ leader?: string; members: string[]; sensei?: string }>({ members: [] })
  const [votes, setVotes] = useState(readVotes)

  const fightPair = useMemo(() => {
    if (recent.length < 2) return null
    return { a: recent[1], b: recent[0] }
  }, [recent])

  const fightKey = fightPair ? `${fightPair.a.id}-vs-${fightPair.b.id}` : ""

  const shareText = (text: string) => {
    if (navigator.share) void navigator.share({ title: "Naruto Wheel", text, url: window.location.href }).catch(() => {})
    else void navigator.clipboard.writeText(`${text} ${window.location.href}`)
  }

  return (
    <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50/70 p-4">
      <p className="mb-2 text-sm font-semibold text-orange-900">Fun modes</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {([
          ["spin", "all", "Spin"],
          ["who-are-you", "who-are-you", "Who Are You?"],
          ["build-ninja", "build-ninja", "Build Your Ninja"],
          ["team", "team", "Team generator"],
          ["fight", "fight", "Random fight"],
          ["challenge", "challenge", "Ninja challenge"],
        ] as const).map(([mode, useCase, label]) => (
          <Button key={mode} type="button" size="sm" variant={funMode === mode || (mode === "spin" && funMode === "spin") ? "default" : "outline"}
            className={funMode === mode ? "bg-orange-600 text-white hover:bg-orange-700" : ""}
            onClick={() => {
              onApplyTemplate(useCase)
              applyNarutoWheelUseCase(useCase)
            }}>{label}</Button>
        ))}
      </div>

      {funMode === "who-are-you" && (
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">Spin each trait to answer “What Naruto character am I?”</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setWho((prev) => ({ ...prev, character: pick(getNarutoCharacters()).name }))}>Character</Button>
            <Button size="sm" variant="outline" onClick={() => setWho((prev) => ({ ...prev, village: pick(narutoVillages).name }))}>Village</Button>
            <Button size="sm" variant="outline" onClick={() => setWho((prev) => ({ ...prev, clan: pick(narutoClans).name }))}>Clan</Button>
            <Button size="sm" variant="outline" onClick={() => setWho((prev) => ({ ...prev, nature: pick(narutoNatures).name }))}>Nature</Button>
            <Button size="sm" variant="outline" onClick={() => setWho((prev) => ({ ...prev, kekkei: pick(narutoKekkei).name }))}>Kekkei Genkai</Button>
            <Button size="sm" variant="outline" onClick={() => setWho((prev) => ({ ...prev, rank: pick(narutoRanks).name }))}>Rank</Button>
            <Button size="sm" variant="outline" onClick={() => setWho((prev) => ({ ...prev, summon: pick(narutoSummons).name }))}>Summon</Button>
          </div>
          {Object.keys(who).length > 0 && (
            <div className="rounded-lg bg-white p-3">
              <p className="font-semibold text-slate-900">You are:</p>
              <ul className="mt-1 list-disc pl-5 text-slate-700">
                {Object.entries(who).map(([key, value]) => <li key={key}>{key}: {value}</li>)}
              </ul>
              <Button size="sm" className="mt-2" onClick={() => shareText(`Naruto identity: ${Object.values(who).join(" / ")}`)}>Share</Button>
            </div>
          )}
        </div>
      )}

      {funMode === "build-ninja" && (
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">Build Your Ninja: character + village + clan + nature + ability (kekkei) + rank.</p>
          <Button size="sm" onClick={() => setBuild({
            character: pick(getNarutoCharacters()).name,
            village: pick(narutoVillages).name,
            clan: pick(narutoClans).name,
            nature: pick(narutoNatures).name,
            ability: pick(narutoKekkei).name,
            rank: pick(narutoRanks).name,
          })}>Spin a ninja</Button>
          {build.character && (
            <div className="rounded-lg bg-white p-3">
              <p className="font-semibold">Your Ninja:</p>
              <p>{build.character}</p>
              <p>{build.clan}</p>
              <p>{build.village}</p>
              <p>{build.nature}</p>
              <p>{build.ability}</p>
              <p>{build.rank}</p>
              <Button size="sm" className="mt-2" onClick={() => shareText(`Your Ninja:\n${build.character}\n${build.clan}\n${build.village}\n${build.nature}\n${build.ability}\n${build.rank}`)}>Share</Button>
            </div>
          )}
        </div>
      )}

      {funMode === "team" && (
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">Spin the wheel in Elimination, or generate a 4-person team + sensei instantly.</p>
          <Button size="sm" onClick={() => {
            const pool = [...getNarutoCharacters()].sort(() => Math.random() - 0.5)
            setTeam({ leader: pool[0]?.name, members: pool.slice(1, 4).map((item) => item.name), sensei: pool[4]?.name })
          }}>Generate team</Button>
          {team.leader && (
            <div className="rounded-lg bg-white p-3">
              <p><strong>Leader:</strong> {team.leader}</p>
              <p><strong>Members:</strong> {team.members.join(", ")}</p>
              <p><strong>Sensei:</strong> {team.sensei}</p>
            </div>
          )}
        </div>
      )}

      {funMode === "fight" && (
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">Spin twice on the wheel to fill both fighters, then vote.</p>
          {fightPair ? (
            <div className="rounded-lg bg-white p-3">
              <p className="text-lg font-bold text-orange-900">{fightPair.a.emoji} {fightPair.a.name} vs {fightPair.b.emoji} {fightPair.b.name}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  const next = { ...votes, [fightKey]: { a: (votes[fightKey]?.a || 0) + 1, b: votes[fightKey]?.b || 0 } }
                  setVotes(next); writeVotes(next)
                }}>Vote {fightPair.a.name} ({votes[fightKey]?.a || 0})</Button>
                <Button size="sm" variant="outline" onClick={() => {
                  const next = { ...votes, [fightKey]: { a: votes[fightKey]?.a || 0, b: (votes[fightKey]?.b || 0) + 1 } }
                  setVotes(next); writeVotes(next)
                }}>Vote {fightPair.b.name} ({votes[fightKey]?.b || 0})</Button>
                <Button size="sm" onClick={() => shareText(`${fightPair.a.name} vs ${fightPair.b.name}`)}>Share matchup</Button>
              </div>
            </div>
          ) : <p className="text-slate-500">Need two recent spins to start a fight.</p>}
        </div>
      )}
    </div>
  )
}
