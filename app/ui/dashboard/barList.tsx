'use client';

import React, { useEffect, useState } from 'react';
import { RiCloseLine } from '@remixicon/react';
import CountUp from 'react-countup';

import { BarList } from '@/app/components/BarList';
import { Card } from '@/app/components/Card';
import { DateRangePickerPresetsExample } from './filterbarCalendar';
import { Divider } from '@/app/components/Divider';
import { getTotalCantTipePasportNuevo } from '@/app/lib/data';
import DonutChartComponent from './donutChart';

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat('cop').format(number).toString()}`;

export default function BarListComponent() {
  const [dataSales, setDataSales] = useState<any[]>([]);
  const [totalSum, setTotalSum] = useState<number>(0);
  const [values, setValues] = useState({ start: 0, end: 0 });
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined,
  );
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: '2025-02-04',
    to: new Date().toISOString().split('T')[0],
  });

  const handleBarClick = (item: any) => {
    setSelectedItem(item.name);
    setValues((prev) => ({
      start: prev.end,
      end: item.value,
    }));
  };

  const clearSelectedItem = () => {
    setSelectedItem(undefined);
    setValues((prev) => ({
      start: prev.end,
      end: totalSum,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedFrom = new Date(dateRange.from)
          .toISOString()
          .split('T')[0];
        const formattedTo = new Date(dateRange.to).toISOString().split('T')[0];
        const salesData = await getTotalCantTipePasportNuevo(
          formattedFrom,
          formattedTo,
        );
        const transformedData = Object.entries(salesData).map(
          ([name, value]) => ({
            name,
            value,
          }),
        );

        // Calcular la suma de los valores de dataSales
        const sum = transformedData.reduce(
          (acc, item) => acc + (item.value || 0),
          0,
        );

        console.log('transformedData:', transformedData);
        setDataSales(transformedData);
        setTotalSum(sum);
        setValues({ start: sum, end: sum }); // Inicializar valores con la suma total
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <div className="obfuscate">
      <Card className="mt-6 p-1">
        <div className="flex flex-col gap-4 p-1 sm:flex-row sm:items-center sm:justify-between">
          <DateRangePickerPresetsExample onDateChange={setDateRange} />
        </div>
        <Divider className="!my-0 [&>div]:dark:!bg-gray-900" />
        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:max-w-xl">
            {/* Total Pasaportes */}
            <div className="mt-1 rounded-lg border border-dashed border-gray-300 p-6 dark:border-gray-600 sm:mx-auto sm:max-w-xl">
              <h4 className="text-sm text-gray-500 dark:text-gray-500">
                Total Pasaportes
              </h4>
              <p className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                <CountUp start={values.start} end={values.end} duration={0.4} />
              </p>
            </div>

            {/* Lista de Tipos de Pasaportes */}
            <Card className="mt-4 sm:mx-auto sm:max-w-lg">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium leading-7 text-gray-900 dark:text-gray-50">
                  Tipos de Pasaportes
                </p>
                {selectedItem && (
                  <button
                    type="button"
                    onClick={clearSelectedItem}
                    className="group inline-flex items-center gap-x-1.5 rounded-md bg-gray-50 px-2 py-1.5 text-xs text-gray-900 ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-100 dark:bg-gray-500/20 dark:text-gray-50 dark:ring-gray-400/20 hover:dark:bg-gray-500/30"
                    aria-label="Remove"
                  >
                    Total
                    <span className="font-semibold">{selectedItem}</span>
                    <RiCloseLine
                      className="size-4 -mr-px shrink-0 text-gray-500 group-hover:text-gray-700 dark:text-gray-500 group-hover:dark:text-gray-300"
                      aria-hidden={true}
                    />
                  </button>
                )}
              </div>
              <div className="mt-6">
                <BarList
                  data={dataSales.filter(
                    (item) => !selectedItem || item.name === selectedItem,
                  )}
                  valueFormatter={valueFormatter}
                  onValueChange={(item: any) => handleBarClick(item)}
                />
              </div>
            </Card>
          </div>
          <div className="sm:max-w-lg">
            <DonutChartComponent/>
          </div>
        </div>
      </Card>
    </div>
  );
}
