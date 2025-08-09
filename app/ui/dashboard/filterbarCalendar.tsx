"use client";

import React from "react";
import { DateRange, DateRangePicker } from "@/app/components/DatePicker";

interface DateRangePickerProps {
  onDateChange: (range: { from: string; to: string }) => void;
}

export const DateRangePickerPresetsExample: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const presets = [
    {
      label: "Hoy",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
    {
      label: "Últimos 7 días",
      dateRange: {
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date(),
      },
    },
    {
      label: "Últimos 30 días",
      dateRange: {
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date(),
      },
    },
    {
      label: "Últimos 3 meses",
      dateRange: {
        from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        to: new Date(),
      },
    },
    {
      label: "Últimos 6 meses",
      dateRange: {
        from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        to: new Date(),
      },
    },
    {
      label: "Mes actual",
      dateRange: {
        from: new Date(new Date().setDate(1)),
        to: new Date(),
      },
    },
    {
      label: "Año actual",
      dateRange: {
        from: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
        to: new Date(),
      },
    },
  ];

  const handleChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      onDateChange({
        from: range.from.toISOString().split("T")[0],
        to: range.to.toISOString().split("T")[0],
      });
    }
  };

  return (
    <div className="flex flex-row items-center gap-y-4">
      <DateRangePicker
        presets={presets}
        value={dateRange}
        onChange={handleChange}
        className="w-60"
      />
      <p className="flex items-center rounded-md bg-gray-100 mx-2 p-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
        Rango seleccionado:{" "}
        {dateRange
          ? `${dateRange.from?.toLocaleDateString() ?? ""} – ${dateRange.to?.toLocaleDateString() ?? ""}`
          : "None"}
      </p>
    </div>
  );
};
