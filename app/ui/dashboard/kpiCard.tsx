'use client';

import React, { useEffect, useState } from 'react';

import { AreaChart, TooltipProps } from '@/app/components/AreaChart';
import { Card } from '@/app/components/Card';
import {
  getTotalSales,
  getTotalSalesTipePasportCantidad,
} from '@/app/lib/data';

const numberFormatter = (number: number) => {
  return `$${Intl.NumberFormat('es-CO').format(number).toString()}`;
};
const numberFormatterNum = (number: number) => {
  return `${Intl.NumberFormat().format(number).toString()}`;
};

type DataItem = {
  date: string;
  total_sales: number;
  total_tickets: number;
  churn: number;
};

type Category = {
  name: string;
  chartCategory: keyof DataItem;
  valueFormatter: (number: number) => string;
};
const data: DataItem[] = [
  { date: 'Jan 23 week 3', total_sales: 234, total_tickets: 1432, churn: 5.2 },
  { date: 'Feb 23', total_sales: 431, total_tickets: 1032, churn: 4.3 },
  { date: 'Mar 23', total_sales: 543, total_tickets: 1089, churn: 5.1 },
  { date: 'Apr 23', total_sales: 489, total_tickets: 988, churn: 5.4 },
  { date: 'May 23', total_sales: 391, total_tickets: 642, churn: 5.5 },
  { date: 'Jun 23', total_sales: 582, total_tickets: 786, churn: 4.8 },
  { date: 'Jul 23', total_sales: 482, total_tickets: 673, churn: 4.5 },
  { date: 'Aug 23', total_sales: 389, total_tickets: 761, churn: 0 },
  { date: 'Sep 23', total_sales: 521, total_tickets: 793, churn: 0 },
  { date: 'Oct 23', total_sales: 434, total_tickets: 543, churn: 0 },
  { date: 'Nov 23', total_sales: 332, total_tickets: 678, churn: 0 },
  { date: 'Dec 23', total_sales: 275, total_tickets: 873, churn: 0 },
];

const categories: Category[] = [
  {
    name: 'Total ventas',
    chartCategory: 'total_sales',
    valueFormatter: numberFormatter,
  },
  {
    name: 'Total cantidad tickets vendidos',
    chartCategory: 'total_tickets',
    valueFormatter: numberFormatterNum,
  },
  {
    name: '-',
    chartCategory: 'churn',
    valueFormatter: numberFormatter,
  },
];

const KpiCard = ({ item, data }: { item: Category; data: DataItem[] }) => {
  const [selectedChartData, setSelectedChartData] =
    React.useState<TooltipProps | null>(null);
  const payload = selectedChartData?.payload[0];

  const formattedValue = payload
    ? item.valueFormatter(payload.payload[item.chartCategory] as number)
    : data.length > 0
      ? item.valueFormatter(data[data.length - 1][item.chartCategory] as number)
      : item.valueFormatter(0);

  return (
    <Card>
      <dt className="text-sm text-gray-500 dark:text-gray-500">{item.name}</dt>
      <dd className="mt-1 flex items-baseline justify-between">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {formattedValue}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-500">
          {payload
            ? payload.payload.date
            : data.length > 0
              ? data[data.length - 1].date
              : 'No data'}
        </span>
      </dd>
      <AreaChart
        data={data}
        index="date"
        categories={[item.chartCategory]}
        showLegend={false}
        showTooltip={false}
        showYAxis={false}
        showGridLines={false}
        startEndOnly={true}
        fill="solid"
        className="-mb-2 mt-3 h-24"
        tooltipCallback={(props) => {
          if (props.active) {
            setSelectedChartData((prev) =>
              prev?.label === props.label ? prev : props,
            );
          } else {
            setSelectedChartData(null);
          }
          return null;
        }}
      />
    </Card>
  );
};

const KpiCardNumber = ({
  selectedPeriod,
  selectedPark,
}: {
  selectedPeriod: string;
  selectedPark: string;
}) => {
  const [dataSales, setDataSales] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const salesData = await getTotalSales(selectedPark, selectedPeriod);
        const salesData = await getTotalSalesTipePasportCantidad(
          selectedPark,
          selectedPeriod,
        );
       
        setDataSales(salesData.length ? salesData : data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [selectedPark, selectedPeriod]);

  return (
    <div className="obfuscate">
      <dl className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((item) => (
          <KpiCard item={item} key={item.name} data={dataSales} />
        ))}
      </dl>
    </div>
  );
};
export default KpiCardNumber;
