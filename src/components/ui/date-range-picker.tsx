
import * as React from "react"
import { addDays, format } from "date-fns"
import { enUS } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  className?: string
  align?: "center" | "start" | "end"
  placeholderText?: string
  presets?: { label: string; days: number }[]
}

export function DatePickerWithRange({
  date,
  setDate,
  className,
  align = "start",
  placeholderText = "Select dates",
  presets = [
    { label: "7 days", days: 7 },
    { label: "30 days", days: 30 },
    { label: "90 days", days: 90 }
  ]
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MM/dd/yyyy", { locale: enUS })} -{" "}
                  {format(date.to, "MM/dd/yyyy", { locale: enUS })}
                </>
              ) : (
                format(date.from, "MM/dd/yyyy", { locale: enUS })
              )
            ) : (
              <span>{placeholderText}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={enUS}
          />
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setDate(undefined)}
              className="text-xs"
            >
              Clear
            </Button>
            {presets.map((preset, i) => (
              <Button 
                key={i}
                variant="outline" 
                size="sm"
                onClick={() => {
                  const today = new Date()
                  setDate({
                    from: addDays(today, -preset.days),
                    to: today,
                  })
                }}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
