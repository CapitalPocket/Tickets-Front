import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import DownloadExcelButton from './invoices/buttonDescarga';

const Modal = ({ closeModal, invoice, park }: { park: string, invoice: any, closeModal: () => void }) => {

  const [invoiceInfo, setInvoiceInfo] = useState<any>()

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.post(`/api/marketing/generateInovice`, 
          { 
            idpark: park == 'Parque Norte' ? 1 : 2,
            month: invoice.Mes.split(' ')[0],
          });
        setInvoiceInfo(response.data);
      } catch (err: any) {
        console.error('Failed to fetch disabled days:', err);
      }
    };
    fetchInvoice();
  }, [park, invoice]);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="relative rounded-lg bg-white p-6 text-center shadow-md">
        <button
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          <XMarkIcon width={25} />
        </button>
        {invoiceInfo && (
              <div className="border rounded-lg shadow-md p-6 bg-white">
              <h2 className="text-lg font-bold mb-4">Factura Electrónica</h2>
              <div className="mb-6">
          <p><strong>Parque:</strong> {park}</p>
          <p><strong>Total Ventas {invoice.Mes}:</strong> {invoiceInfo.length}</p>
              </div>
              <hr className="mb-6" />
              <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Código Ticket</th>
              <th className="border border-gray-300 px-4 py-2">Cliente</th>
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Tipo Pago</th>
              <th className="border border-gray-300 px-4 py-2">Precio</th>
              <th className="border border-gray-300 px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {invoiceInfo?.map((sale: any) => (
              <tr key={sale.idticket}>
                <td className="border border-gray-300 px-4 py-2">{sale.ticket_code}</td>
                <td className="border border-gray-300 px-4 py-2">
            {sale.name} {sale.lastname}
                </td>
                <td className="border border-gray-300 px-4 py-2">
            {new Date(sale.date_ticket).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{sale.type_pay}</td>
                <td className="border border-gray-300 px-4 py-2">{sale.price_ticket}</td>
                <td className="border border-gray-300 px-4 py-2">{sale.status}</td>
              </tr>
            ))}
          </tbody>
              </table>
              <div className="mt-4">
          <p><strong>Total Amount:</strong> &nbsp; {invoice.Total} COP</p>
              </div>
            </div>
        )}
        <div className="flex justify-around mt-[2.5%]">
          <button
            className="mb-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
            onClick={closeModal}
          >
            Cerrar
          </button>
          {/* <button
            className="mb-2 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            onClick={() => console.log('Descargando factura...')}
          >
            Descargar
          </button> */}
          <DownloadExcelButton idpark={ park == 'Parque Norte' ? 1 : 2} month={ invoice.Mes.split(' ')[0]}/>
        </div>
      </div>
    </div>
  )
}

export default Modal

interface IResponse {
  "idticket": number,
  "idpark": number,
  "ticket_code": string,
  "type_pay": string,
  "type_money": string,
  "name": string,
  "lastname": string,
  "email_person": string,
  "phone_number": string,
  "identity_type": string,
  "identity_number": string,
  "date_ticket": Date,
  "status": string,
  "created_at": Date,
  "updated_at": Date,
  "invoice_electronic": boolean,
  "price_ticket": string
}