'use client';

import { Card } from '@/app/components/Card';
import { SelectNative } from '@/app/components/SelectNative';
import KpiCardNumber from './kpiCard';
import { Label } from 'recharts';
import React, { useState } from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cx, focusRing } from '@/app/lib/utils';

import ChartSalesComposition from './chartSalesComposition';
import ChartCantiComposition from './chartCantiComposition';
import { DateRangePickerPresetsExample } from './filterbarCalendar';
import BarListComponent from './barList';

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cx(
      'inline-flex h-[38px] divide-x divide-gray-300 rounded-md border border-gray-300 bg-white shadow-sm dark:divide-gray-800 dark:border-gray-800 sm:h-[34px]',
      className,
    )}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = 'ToggleGroup';

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cx(
        'flex items-center justify-center border-gray-300 bg-gray-100 px-2.5 py-1 text-base text-gray-700 transition-colors first:rounded-l-[5px] last:rounded-r-[5px] hover:bg-gray-50 focus:z-10 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 sm:text-sm',
        'data-[state=on]:text-semibold data-[state=on]:bg-white data-[state=on]:text-gray-950 dark:data-[state=on]:bg-gray-800 dark:data-[state=on]:text-gray-50',
        focusRing,
        // disabled
        'disabled:pointer-events-none disabled:text-gray-400 dark:disabled:text-gray-600',
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = 'ToggleGroupItem';

export default function PageShell() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('day');
  const [selectedPark, setSelectedPark] = useState<string>('3');

  return (
    <div className="obfuscate">
      <div className="p-4 sm:p-6 lg:p-8">
        <header>
          <div className="sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Dashboard Ventas
            </h3>
            <div className="mt-4 items-center sm:mt-0 sm:flex sm:space-x-2">
              {/* Selector de parque */}
              <SelectNative
                className="w-full sm:w-fit"
                value={selectedPark}
                onChange={(e) => setSelectedPark(e.target.value)}
              >
                <option value="3">Todos los parques</option>
                <option value="1">Parque Norte</option>
                <option value="2">Aeroparque Juanpablo II</option>
              </SelectNative>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ToggleGroup
                  type="single"
                  defaultValue={selectedPeriod}
                  aria-label="Time period selection"
                  className="w-full sm:w-fit"
                  onValueChange={(value) => value && setSelectedPeriod(value)}
                >
                  <ToggleGroupItem
                    className="w-full"
                    value="day"
                    aria-label="Day"
                  >
                    Días
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="w-full"
                    value="week"
                    aria-label="Week"
                  >
                    Semanas
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="w-full"
                    value="month"
                    aria-label="Month"
                  >
                    Meses
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="w-full"
                    value="year"
                    aria-label="Year"
                  >
                    Años
                  </ToggleGroupItem>
                </ToggleGroup>
              
              </div>
            </div>
          </div>
        </header>
        <main>
          {/* Pasar los valores seleccionados a KpiCardNumber */}
         
          <KpiCardNumber
            selectedPeriod={selectedPeriod}
            selectedPark={selectedPark}
          />
         
          {/* <BarChartSales
            selectedPeriod={selectedPeriod}
            selectedPark={selectedPark}
          /> */}
          <ChartSalesComposition
            selectedPeriod={selectedPeriod}
            selectedPark={selectedPark}
            
          />
          <ChartCantiComposition
            selectedPeriod={selectedPeriod}
            selectedPark={selectedPark}
          />
          <BarListComponent/>
        </main>
      </div>
    </div>
  );
}
