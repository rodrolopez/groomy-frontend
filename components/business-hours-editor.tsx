"use client";

import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export interface DaySchedule {
  day: string;
  enabled: boolean;
  open: string;
  close: string;
  open2?: string;
  close2?: string;
}

interface BusinessHoursEditorProps {
  value: string | null | undefined;
  onChange: (json: string) => void;
  disabled?: boolean;
}

function parseHours(json: string | null | undefined): DaySchedule[] {
  if (!json) return DAYS.map((day) => ({ day, enabled: false, open: "09:00", close: "18:00" }));
  try {
    const parsed = JSON.parse(json) as DaySchedule[];
    return DAYS.map((day) => parsed.find((d) => d.day === day) ?? { day, enabled: false, open: "09:00", close: "18:00" });
  } catch {
    return DAYS.map((day) => ({ day, enabled: false, open: "09:00", close: "18:00" }));
  }
}

export function BusinessHoursEditor({ value, onChange, disabled }: BusinessHoursEditorProps) {
  const schedules = parseHours(value);

  const update = useCallback(
    (index: number, partial: Partial<DaySchedule>) => {
      const next = [...schedules];
      next[index] = { ...next[index], ...partial };
      onChange(JSON.stringify(next));
    },
    [schedules, onChange]
  );

  const copyToWeekdays = useCallback(() => {
    const weekday = schedules.find((s) => s.day === "Lunes");
    if (!weekday) return;
    const next = schedules.map((s) =>
      s.day !== "Domingo" && s.day !== "Sábado" ? { ...weekday, day: s.day } : s
    );
    onChange(JSON.stringify(next));
  }, [schedules, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Horarios de atención</Label>
        {!disabled && (
          <Button type="button" variant="ghost" size="sm" onClick={copyToWeekdays}>
            Copiar a días de semana
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {schedules.map((day, i) => (
          <div key={day.day} className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-zinc-900/50">
            <label className="flex items-center gap-2 min-w-[100px] cursor-pointer">
              <input
                type="checkbox"
                checked={day.enabled}
                disabled={disabled}
                onChange={(e) => update(i, { enabled: e.target.checked })}
                className="rounded border-zinc-600 bg-zinc-800 text-purple-500 focus:ring-purple-500"
              />
              <span className={`text-sm ${day.enabled ? "text-zinc-200" : "text-zinc-600"}`}>
                {day.day}
              </span>
            </label>

            {day.enabled && (
              <>
                <Input
                  type="time"
                  value={day.open}
                  disabled={disabled}
                  onChange={(e) => update(i, { open: e.target.value })}
                  className="w-28 h-8 text-xs"
                />
                <span className="text-xs text-zinc-500">a</span>
                <Input
                  type="time"
                  value={day.close}
                  disabled={disabled}
                  onChange={(e) => update(i, { close: e.target.value })}
                  className="w-28 h-8 text-xs"
                />

                <label className="flex items-center gap-1 text-xs text-zinc-500 cursor-pointer ml-1">
                  <input
                    type="checkbox"
                    checked={!!day.open2}
                    disabled={disabled}
                    onChange={(e) =>
                      update(i, {
                        open2: e.target.checked ? "16:00" : undefined,
                        close2: e.target.checked ? "20:00" : undefined,
                      })
                    }
                    className="rounded border-zinc-600 bg-zinc-800 text-purple-500 focus:ring-purple-500"
                  />
                  Cortado
                </label>

                {day.open2 && (
                  <>
                    <Input
                      type="time"
                      value={day.open2}
                      disabled={disabled}
                      onChange={(e) => update(i, { open2: e.target.value })}
                      className="w-28 h-8 text-xs"
                    />
                    <span className="text-xs text-zinc-500">a</span>
                    <Input
                      type="time"
                      value={day.close2}
                      disabled={disabled}
                      onChange={(e) => update(i, { close2: e.target.value })}
                      className="w-28 h-8 text-xs"
                    />
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
