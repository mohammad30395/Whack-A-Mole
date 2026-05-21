"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { OBJECT_COLORS, OBJECT_THEMES } from "@/lib/constants";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { SelectInput, TextInput } from "@/components/ui/FormField";
import type { PlayerProfile } from "@/types/game";
import { hasErrors, validatePlayer } from "@/utils/validation";

interface SetupScreenProps {
  initialProfile: PlayerProfile;
  onBack: () => void;
  onSubmit: (profile: PlayerProfile) => void;
}

export function SetupScreen({ initialProfile, onBack, onSubmit }: SetupScreenProps) {
  const [profile, setProfile] = useState<PlayerProfile>(initialProfile);
  const [submitted, setSubmitted] = useState(false);
  const errors = useMemo(() => validatePlayer(profile), [profile]);
  const totalHoles = profile.length * profile.width;

  const submit = () => {
    setSubmitted(true);
    if (!hasErrors(errors)) {
      onSubmit(profile);
    }
  };

  return (
    <ScreenShell>
      <GlassPanel className="grid max-h-full w-full max-w-5xl gap-4 overflow-hidden rounded-2xl p-4 sm:p-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-h-0 flex-col justify-between rounded-xl border border-white/10 bg-black/20 p-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Player setup</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white sm:text-4xl">Build your board</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Pick a compact grid and visual target style. The board scales automatically to fit one screen.
            </p>
          </div>
          <motion.div
            animate={{ boxShadow: ["0 0 12px rgba(34,211,238,.18)", "0 0 28px rgba(251,113,133,.2)", "0 0 12px rgba(34,211,238,.18)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mt-4 rounded-xl border border-cyan-200/20 bg-cyan-200/10 p-4"
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Total holes</div>
            <div className="text-4xl font-black text-cyan-100">{Number.isFinite(totalHoles) ? totalHoles : 0}</div>
          </motion.div>
        </div>
        <div className="min-h-0 overflow-hidden">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput
              label="Full Name"
              value={profile.fullName}
              error={submitted ? errors.fullName : undefined}
              placeholder="Ada Lovelace"
              onChange={(event) => setProfile({ ...profile, fullName: event.target.value })}
            />
            <TextInput
              label="Username"
              value={profile.username}
              error={submitted ? errors.username : undefined}
              placeholder="neonmole"
              onChange={(event) => setProfile({ ...profile, username: event.target.value })}
            />
            <TextInput
              label="Playground Length"
              type="number"
              min={2}
              max={8}
              value={profile.length}
              error={submitted ? errors.length : undefined}
              onChange={(event) => setProfile({ ...profile, length: Number(event.target.value) })}
            />
            <TextInput
              label="Playground Width"
              type="number"
              min={2}
              max={8}
              value={profile.width}
              error={submitted ? errors.width : undefined}
              onChange={(event) => setProfile({ ...profile, width: Number(event.target.value) })}
            />
            <SelectInput
              label="Object / Animal Theme"
              value={profile.objectTheme}
              onChange={(event) => setProfile({ ...profile, objectTheme: event.target.value as PlayerProfile["objectTheme"] })}
            >
              {OBJECT_THEMES.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </SelectInput>
            <SelectInput
              label="Preferred Object Color"
              value={profile.objectColor}
              onChange={(event) => setProfile({ ...profile, objectColor: event.target.value as PlayerProfile["objectColor"] })}
            >
              {OBJECT_COLORS.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </SelectInput>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <NeonButton onClick={submit} className="flex-1">
              Continue
            </NeonButton>
            <NeonButton onClick={onBack} variant="secondary" className="flex-1">
              Main Menu
            </NeonButton>
          </div>
        </div>
      </GlassPanel>
    </ScreenShell>
  );
}
