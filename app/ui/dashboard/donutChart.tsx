'use client';

import { cx } from '@/app/lib/utils';

import { Card } from '@/app/components/Card';
import { DonutChart } from '@/app/components/DonutChart';
import { useEffect, useState } from 'react';
import { getAllTicketsByStatus } from '@/app/lib/data';

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ');
}

const currencyFormatter = (number: number) =>
  Intl.NumberFormat('COP').format(number).toString();

export default function DonutChartComponent() {
 const [tiketStatus, setTiketStatus] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const tiketStatus = await getAllTicketsByStatus();
        console.log(tiketStatus);
        setTiketStatus(tiketStatus.length ? tiketStatus : []);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <Card className="sm:mx-auto sm:max-w-lg">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
          Estado de los Tickets
        </h3>
        <DonutChart
          className="mx-auto mt-8"
          data={tiketStatus}
          category="name"
          value="amount"
          showLabel={true}
          valueFormatter={currencyFormatter}
          showTooltip={false}
          colors={['blueStatus', 'grayStatus','violetStatus','greenStatus', 'amberStatus','redStatus','orange' ]}
        />
        <p className="mt-8 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          <span>Estados</span>
          <span>Cantidad / Porcentaje</span>
        </p>
        <ul
          role="list"
          className="mt-2 divide-y divide-gray-200 text-sm text-gray-500 dark:divide-gray-800 dark:text-gray-500"
        >
          {tiketStatus.map((item) => (
            <li
              key={item.name}
              className="relative flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-2.5 truncate">
              <span
                  className={classNames(
                    item.color,
                    'size-2.5 shrink-0 rounded-sm',
                  )}
                  aria-hidden={true}
              >-</span>

                <span className="truncate dark:text-gray-300">{item.name}</span>
              </div>
              <p className="flex items-center space-x-2">
                <span className="font-medium tabular-nums text-gray-900 dark:text-gray-50">
                  {currencyFormatter(item.amount)}
                </span>
                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {item.share}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
