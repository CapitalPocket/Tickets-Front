'use client';
import axios from 'axios';
import { DayPicker } from 'react-day-picker';
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import 'react-day-picker/dist/style.css';
import './custom-styles.css'; // Asegúrate de tener este archivo
import { es } from "date-fns/locale";

const TicketControl = ({ park }: { park: string }) => {
  const LinkIcon = XMarkIcon;
  const [disabledDays, setDisabledDays] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (day: Date) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDay(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchDisabledDays = async () => {
      try {
        const response = await axios.post(`/api/taquilla/allDatesBlocked`, {
          idpark: park == 'Parque Norte' ? 1 : 2,
        });
        setDisabledDays(
          response?.data?.map(
            (date: string) =>
              new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
          ),
        );
      } catch (error) {
        console.error('Error fetching disabled days: ', error);
      }
    };

    fetchDisabledDays();
  }, [park, disabledDays]);

  const handleBlock = async (day: Date) => {
    try {
      await axios
        .post(`/api/taquilla/blockDate`, {
          idpark: park == 'Parque Norte' ? 1 : 2,
          blockDate: day.toISOString().split('T')[0],
        })
        .then(() => {})
        .catch((error) => {
          console.error('Error blocking date: ', error);
        });
      await axios
        .post(`/api/paymentsway/webhook/sendBlockParkEmail`, {
          date: day,
          idpark: park == 'Parque Norte' ? 1 : 2
        })
        .then(() => closeModal())
        .catch((error) => {
          console.error('Error sending emails: ', error);
        });
    } catch (error) {
      console.error('Error fetching disabled days: ', error);
    }
  };

  const isDisabled = (day: Date) =>
    disabledDays.some(
      (disabledDay) => disabledDay.toDateString() === day.toDateString(),
    );

  return (
    <div className="flex flex-col items-center p-4">
      <DayPicker
        mode="single"
        onDayClick={(day) => day && openModal(day)}
        defaultMonth={new Date()}
        locale={es}
        modifiers={{
          booked: disabledDays,
        }}
        modifiersClassNames={{
          booked: 'rdp-day--disabled', // Usamos clases personalizadas desde custom-styles.css
        }}
      />

      {/* Modal */}
      {isModalOpen && selectedDay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative rounded-lg bg-white p-6 text-center shadow-md">
            <button
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <LinkIcon className="w-[1rem]" />
            </button>
            <h3 className="mb-4 text-lg font-semibold">
              {`Controlar ventas para el día ${selectedDay.toDateString()}`}
            </h3>
            <p
              className={`mb-4 ${isDisabled(selectedDay) ? 'text-red-500' : 'text-green-500'}`}
            >
              {isDisabled(selectedDay)
                ? 'Este día está deshabilitado.'
                : 'Este día está habilitado.'}
            </p>
            <div className="flex justify-around">
              {isDisabled(selectedDay) 
              ? <button
                className="mb-2 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                onClick={() => handleBlock(selectedDay)}
              >
                Habilitar ventas
              </button> 
              : <button
              className="mb-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
              onClick={() => handleBlock(selectedDay)}
            >
              Deshabilitar ventas
            </button> }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketControl;
