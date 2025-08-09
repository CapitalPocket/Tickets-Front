'use client';
import React, { useEffect, useState } from 'react';
import { AreaChart } from '@/app/components/AreaChart';
import { Card } from '@/app/components/Card';
import { Divider } from '@/app/components/Divider';
import {
  getTotalSalesNumTipePasportNuevo,
} from '@/app/lib/data';

const valueFormatter = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const colorMap: Record<
  number,
  (
    | 'purple'
    | 'blue'
    | 'cyan'
    | 'emerald'
    | 'violet'
    | 'pink'
    | 'lime'
    | 'gray'
    | 'orange'
    | 'redStatus'
  )[]
> = {
  1: ['purple', 'blue', 'cyan', 'emerald'],
  2: ['violet', 'orange','lime','blue'],
  3: ['purple', 'blue', 'cyan', 'lime','emerald', 'redStatus','orange','gray'],
};

export default function ChartCantiComposition({
  selectedPeriod,
  selectedPark,
}: {
  selectedPeriod: string;
  selectedPark: string;
}) {
  const [dataSales, setDataSales] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [chartColors, setChartColors] = useState<
    (typeof colorMap)[1][number][]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idPark: any = Number(selectedPark);
        const salesData = await getTotalSalesNumTipePasportNuevo(
          `${idPark}`,
          selectedPeriod,
        );
        setDataSales(salesData.length ? salesData : []);

        if (salesData.length > 0) {
          const categoryMap: Record<number, string[]> = {
            1: [
              'Pasaporte Extremo',
              'Pasaporte Aventura',
              'Pasaporte Fusión',
              'Ingreso Sin Atracciones',
            ],
            2: [
              'Zona Acuática',
              'Pasaporte Acuático Adultos',
              'Pasaporte Acuático Niños',
              'Ingreso General',
            ],
            3: [
              'Pasaporte Extremo',
              'Pasaporte Aventura',
              'Pasaporte Fusión',
              'Ingreso Sin Atracciones',
              'Zona Acuática',
              'Pasaporte Acuático Adultos',
              'Pasaporte Acuático Niños',
              'Ingreso General',
            ],
          };

          setCategories(categoryMap[idPark] || categoryMap[3]);
          setChartColors([...(colorMap[idPark] || colorMap[3])]);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [selectedPark, selectedPeriod]);

  return (
    <div className="obfuscate">
      <Card className="mt-6 !p-0">
        <div className="px-6 py-3">
          <h1 className="text-base font-medium text-gray-900 dark:text-gray-50">
            Número de Pasaportes Vendidos 
          </h1>
        </div>
        <Divider className="!my-0 [&>div]:dark:!bg-gray-900" />
        <div className="rounded-b-lg px-6 pb-6 pt-6">
          <AreaChart
            data={dataSales}
            index="date"
            categories={categories}
            colors={chartColors}
            fill="solid"
            valueFormatter={valueFormatter}
            onValueChange={() => {}}
            yAxisWidth={60}
            minValue={0}
            maxValue={Math.max(
              ...dataSales.map((sale) =>
                Math.max(...categories.map((category) => sale[category])),
              ),
            )}
            tickGap={25}
            className="mt-6 hidden sm:block"
          />
          <AreaChart
            data={dataSales}
            index="date"
            categories={categories}
            colors={chartColors}
            fill="solid"
            valueFormatter={valueFormatter}
            onValueChange={() => {}}
            showYAxis={false}
            tickGap={25}
            startEndOnly={true}
            className="mt-6 sm:hidden"
          />
        </div>
      </Card>
    </div>
  );
}
