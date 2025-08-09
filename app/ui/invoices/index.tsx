import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import DownloadExcelButton from './buttonDescarga';
import { formatCurrency } from '@/app/lib/utils';

const Invoices: React.FC<{ park: string }> = ({ park }: { park: string }) => {
    const [data, setData] = useState<any>([])
    const [initialDate, setInitialDate] = useState<any>(null)    
    const [finalDate, setFinalDate] = useState<any>(null)    

    useEffect(() => {
        const fetchDisabledDays = async () => {
            try {
                await axios.post(`/api/marketing/getInvoicesPark`, { initialDate, finalDate })
                .then((response) => setData(response.data))
                .catch((error) => setData([{ Mes: "",Total: "0"}]));
            } catch (error) {
                setData([{ Mes: "",Total: "0"}])
                console.error("Error fetching disabled days: ", error);
            }
        };
        fetchDisabledDays();
    }, [initialDate, finalDate]);

  // Definición de columnas
  const columns: any = [
    { 
        name: 'Estado', 
        selector: (row: any) => (initialDate && finalDate) ? '🟢' : '🔴', 
        sortable: false,
        width: '90px'
    },
    { 
        name: 'Fecha inicial', 
        selector: (row: any) => initialDate ?? 'No seleccionada', 
        sortable: true, 
    },
    { 
        name: 'Fecha Final', 
        selector: (row: any) => finalDate ?? 'No seleccionada', 
        sortable: true, 
    },
    { 
        name: 'Valor', 
        selector: (row: any) => formatCurrency(row.Total), 
        sortable: true 
    },
    { 
        name: 'Descargar', 
        selector: (row: any) => <DownloadExcelButton initialDate={initialDate} finalDate={finalDate} disabled={!(initialDate && finalDate)} />, 
        sortable: false,
        width: '200px'
    },
  ];

return (
    <div className='w-[100%] md:w-full px-[1rem]'>
        <div className="flex md:flex-row flex-col justify-center items-center gap-[2rem] mb-[2rem]">
                <label id="initialDate" className='font-semibold'>Selecciona la fecha inicial</label>
                <input 
                type='date'
                value={initialDate} 
                className='border-2 border-gray-300 rounded-lg p-2 text-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                onChange={(e) => setInitialDate(e.target.value)} 
                />
                <label id="initialDate" className='font-semibold'>Selecciona la fecha final</label>
                <input 
                type='date'
                value={finalDate} 
                className='border-2 border-gray-300 rounded-lg p-2 text-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                onChange={(e) => setFinalDate(e.target.value)} 
                />
            </div>
        <DataTable
            columns={columns}
            data={data || [{ Total: '0' }]}
            pagination
            paginationPerPage={5} // Número de filas por página
            paginationRowsPerPageOptions={[5, 10]} // Opciones de filas por página
            customStyles = {{
                header: {
                style: {
                    minHeight: '56px',
                    backgroundColor: park == 'Parque Norte' ? '#2109a7' : '#28a745',  // Fondo azul o verde según el parque
                    color: 'white',  // Texto blanco para resaltar
                    fontSize: '1.2rem',  // Tamaño de fuente más grande
                    fontWeight: 'bold',  // Negrita en el texto
                    textAlign: 'left',  // Alineación a la izquierda
                    paddingLeft: '20px',  // Espaciado a la izquierda
                },
                },
                headRow: {
                style: {
                    backgroundColor: park == 'Parque Norte' ? '#f0f8ff' : '#e9f7ef',  // Fondo diferente según el parque
                    borderBottom: '2px solid #dee2e6',  // Línea separadora debajo de la cabecera
                },
                },
                headCells: {
                style: {
                    fontWeight: 'bold',  // Negrita en las celdas de la cabecera
                    fontSize: '1rem',  // Fuente con tamaño adecuado
                    color: park == 'Parque Norte' ? '#003366' : '#155724',  // Color verde oscuro o azul según el parque
                    paddingLeft: '15px',
                    paddingRight: '15px',  // Espaciado para las celdas de cabecera
                    textAlign: 'left',  // Alineación a la izquierda
                },
                },
                rows: {
                style: {
                    fontSize: '1rem',  // Tamaño de fuente normal para las filas
                    paddingLeft: '15px',
                    paddingRight: '15px',
                    backgroundColor: '#ffffff',  // Fondo blanco para las filas
                    borderBottom: '1px solid #dee2e6',  // Línea separadora entre las filas
                },
                highlightOnHoverStyle: {
                    backgroundColor: park == 'Parque Norte' ? '#cce5ff' : '#d4edda',  // Color de fondo al pasar el cursor según el parque
                    borderBottomColor: park == 'Parque Norte' ? '#99c2ff' : '#c3e6cb',  // Cambio del borde al pasar el cursor según el parque
                    borderRadius: '10px',  // Bordes redondeados al pasar el cursor
                    outline: 'none',  // Eliminar outline del hover
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  // Sombra suave al pasar el cursor
                },
                },
                cells: {
                style: {
                    fontSize: '0.9rem',  // Fuente un poco más pequeña para las celdas
                    textAlign: 'left',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                },
                },
            }}                        
        />
    </div>
);
};

export default Invoices;
