/**
 * v0 by Vercel.
 * @see https://v0.dev/t/YrGCBiQkbd4
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Component() {
    const [value, setValue] = useState(50)
    const [timeUnit, setTimeUnit] = useState("day")
    return (
        <div className="bg-background rounded-lg border p-6 w-full max-w-md">
            <div className="grid gap-6">
                <div>
                    <Label htmlFor="value" className="block font-medium">
                        Value
                    </Label>
                    <div className="flex items-center gap-4">
                        <Slider
                            id="value"
                            value={[value]}
                            onValueChange={([newValue]) => setValue(newValue)}
                            max={100}
                            step={1}
                            className="flex-1"
                        />
                        <Input
                            id="value"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value))}
                            className="w-20 text-right"
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="time-unit" className="block font-medium">
                        Time Unit
                    </Label>
                    <RadioGroup id="time-unit" value={timeUnit} onValueChange={setTimeUnit} className="grid grid-cols-5 gap-2">
                        <Label
                            htmlFor="time-unit-minute"
                            className="border cursor-pointer rounded-md p-2 flex items-center justify-center [&:has(:checked)]:bg-muted"
                        >
                            <RadioGroupItem id="time-unit-minute" value="minute" />
                            Minute
                        </Label>
                        <Label
                            htmlFor="time-unit-hour"
                            className="border cursor-pointer rounded-md p-2 flex items-center justify-center [&:has(:checked)]:bg-muted"
                        >
                            <RadioGroupItem id="time-unit-hour" value="hour" />
                            Hour
                        </Label>
                        <Label
                            htmlFor="time-unit-day"
                            className="border cursor-pointer rounded-md p-2 flex items-center justify-center [&:has(:checked)]:bg-muted"
                        >
                            <RadioGroupItem id="time-unit-day" value="day" />
                            Day
                        </Label>
                        <Label
                            htmlFor="time-unit-week"
                            className="border cursor-pointer rounded-md p-2 flex items-center justify-center [&:has(:checked)]:bg-muted"
                        >
                            <RadioGroupItem id="time-unit-week" value="week" />
                            Week
                        </Label>
                        <Label
                            htmlFor="time-unit-month"
                            className="border cursor-pointer rounded-md p-2 flex items-center justify-center [&:has(:checked)]:bg-muted"
                        >
                            <RadioGroupItem id="time-unit-month" value="month" />
                            Month
                        </Label>
                    </RadioGroup>
                </div>
            </div>
        </div>
    )
}