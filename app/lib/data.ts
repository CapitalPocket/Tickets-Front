import dotenv from 'dotenv';

dotenv.config();
import { sql } from '@vercel/postgres';
import { User, CandidatosTable, Ticket, UserProfile } from './definitions';

import { unstable_noStore as noStore } from 'next/cache';
import axios from 'axios';
import { formatCurrency, formatDateToLocal } from './utils';

export async function fetchCardDataCandidatos(grupo: string) {
  noStore();
  try {
    let totalCandidatosPromise = sql`SELECT COUNT(*) FROM candidato  WHERE  grupo= ${grupo}`;
    let candidatosEnProcesoPromise = sql`SELECT COUNT(*) FROM candidato WHERE estado_proceso = 'En Proceso' and  grupo=${grupo} `;
    let candidatosEnviadosPromise = sql`SELECT COUNT(*) FROM candidato WHERE estado_proceso = 'Enviado' and  grupo= ${grupo}`;
    let candidatosNoPasaronPromise = sql`SELECT COUNT(*) FROM candidato WHERE estado_proceso = 'No paso' and  grupo= ${grupo}`;

    if (grupo == 'Total') {
      totalCandidatosPromise = sql`SELECT COUNT(*) FROM candidato `;
      candidatosEnProcesoPromise = sql`SELECT COUNT(*) FROM candidato WHERE estado_proceso = 'En Proceso'`;
      candidatosEnviadosPromise = sql`SELECT COUNT(*) FROM candidato WHERE estado_proceso = 'Enviado'`;
      candidatosNoPasaronPromise = sql`SELECT COUNT(*) FROM candidato WHERE estado_proceso = 'No paso'`;
    }

    const data = await Promise.all([
      totalCandidatosPromise,
      candidatosEnProcesoPromise,
      candidatosEnviadosPromise,
      candidatosNoPasaronPromise,
    ]);

    const totalCandidatos = Number(data[0].rows[0].count ?? '0');
    const candidatosEnProceso = Number(data[1].rows[0].count ?? '0');
    const candidatosEnviados = Number(data[2].rows[0].count ?? '0');
    const candidatosNoPasaron = Number(data[3].rows[0].count ?? '0');

    return {
      totalCandidatos,
      candidatosEnProceso,
      candidatosEnviados,
      candidatosNoPasaron,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
export async function fetchCardDataCandidatosTotal(grupo: string) {
  noStore();
  try {
    const totalCandidatosPromise = sql`SELECT COUNT(*) FROM candidato and `;
    const candidatosEnProcesoPromise = sql`SELECT COUNT(*) FROM candidato WHERE estado_proceso = 'En Proceso'`;
    const candidatosEnviadosPromise = sql`SELECT COUNT(*) FROM candidato WHERE estado_proceso = 'Enviado'`;
    const candidatosNoPasaronPromise = sql`SELECT COUNT(*) FROM candidato WHERE estado_proceso = 'No paso'`;

    const data = await Promise.all([
      totalCandidatosPromise,
      candidatosEnProcesoPromise,
      candidatosEnviadosPromise,
      candidatosNoPasaronPromise,
    ]);

    const totalCandidatos = Number(data[0]?.rows[0]?.count ?? '0');
    const candidatosEnProceso = Number(data[1]?.rows[0]?.count ?? '0');
    const candidatosEnviados = Number(data[2]?.rows[0]?.count ?? '0');
    const candidatosNoPasaron = Number(data[3]?.rows[0]?.count ?? '0');

    return {
      totalCandidatos,
      candidatosEnProceso,
      candidatosEnviados,
      candidatosNoPasaron,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 9;

export async function fetchInvoices(idpark: string, month: string) {
  noStore();
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACK_LINK}/api/marketing/generateInovice`;
    const { data: tickets } = await axios.post(apiUrl, {
      idpark: idpark,
      month: month,
    });

    return tickets;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Informes.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchCandidatoById(id: string) {
  noStore();
  try {
    const data = await sql<CandidatosTable>`
      SELECT
        candidato.id,
        candidato.tipoid,
        candidato.nombre,
        candidato.celular,
        candidato.cargo,
        candidato.correo,
        candidato.motivo,
        candidato.estado_proceso,
        candidato.fecha_envio,
        candidato.fecha_ingreso,
        candidato.grupo,
        candidato.estadoCandidato,
        candidato.user_creo
      FROM candidato
      WHERE candidato.id = ${id};
    `;

    const candidato = data.rows.map((candidato) => ({
      ...candidato,
    }));

    return candidato[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch candidate.');
  }
}

export async function fetchFilteredCandidatos(
  query: string,
  currentPage: number,
  user: any,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACK_LINK}/api/marketing/getAllTicketsTwo`;
    const { data: tickets } = await axios.post(apiUrl, {
      idpark: user?.park,
    });

    const filteredTickets = tickets.filter((ticket: Ticket) => {
      if (user?.role === 'taquillero' && !query.trim()) {
        return false;
      }

      const searchString = query.toLowerCase();
      return (
        ticket.name?.toLowerCase().includes(searchString) ||
        ticket.lastname?.toLowerCase().includes(searchString) ||
        ticket.email_person?.toLowerCase().includes(searchString) ||
        ticket.phone_number?.toLowerCase().includes(searchString) ||
        ticket.date_ticket?.toLowerCase().includes(searchString) ||
        ticket.status?.toLowerCase().includes(searchString) ||
        ticket.id_operation?.toLowerCase().includes(searchString) ||
        ticket.identity_number?.toLowerCase().includes(searchString)
      );
    });

    const paginatedTickets = filteredTickets.slice(
      offset,
      offset + ITEMS_PER_PAGE,
    );
    return paginatedTickets;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch tickets: ${error.message}`);
    }
    console.error('Error:', error);
    throw new Error('Failed to fetch tickets.');
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
  grupo: string,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const apiUrl = `/api/marketing/getAllInvoices`;
    const { data: tickets } = await axios.get(apiUrl);
    const filteredTickets = tickets.filter((invoice: any) => {
      const searchString = query.toLowerCase();
      return (
        invoice.Mes?.toLowerCase().includes(searchString) ||
        invoice.Total?.toLowerCase().includes(searchString)
      );
    });

    const paginatedTickets = filteredTickets.slice(
      offset,
      offset + ITEMS_PER_PAGE,
    );
    return paginatedTickets;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch tickets: ${error.message}`);
    }
    console.error('Error:', error);
    throw new Error('Failed to fetch tickets.');
  }
}

export async function fetchTicketsCount(query: string, user: any) {
  noStore();
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACK_LINK}/api/marketing/getAllTicketsTwo`;
    const { data: tickets } = await axios.post(apiUrl, {
      idpark: user?.park,
    });

    const searchString = query.toLowerCase();
    const count = tickets.filter((ticket: Ticket) => {
      if (user?.role === 'taquillero' && !query.trim()) {
        return false;
      }
      return (
        ticket.name?.toLowerCase().includes(searchString) ||
        ticket.lastname?.toLowerCase().includes(searchString) ||
        ticket.email_person?.toLowerCase().includes(searchString) ||
        ticket.phone_number?.toLowerCase().includes(searchString) ||
        ticket.date_ticket?.toLowerCase().includes(searchString) ||
        ticket.status?.toLowerCase().includes(searchString) ||
        ticket.id_operation?.toLowerCase().includes(searchString) ||
        ticket.identity_number?.toLowerCase().includes(searchString)
      );
    }).length;

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of tickets.');
  }
}

export async function fetchFilteredUsers(
  query: string,
  currentPage: number,
  status: string = 'Habilitado',
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const effectiveStatus = status || 'Habilitado';
    const apiUrl = `${process.env.NEXT_PUBLIC_BACK_LINK}/api/taquilla/getAllUsersTaquilla/${effectiveStatus}`;
    const response = await axios.get(apiUrl);
    if (response.data.message) {
      console.warn(response.data.message);
      return [];
    }
    const users = response.data;
    const filteredUsers = users.filter((user: UserProfile) => {
      const searchString = query.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchString) ||
        user.email?.toLowerCase().includes(searchString) ||
        user.rol?.toLowerCase().includes(searchString) ||
        user.statusprofile?.toLowerCase().includes(searchString)
      );
    });

    const paginatedUsers = filteredUsers.slice(offset, offset + ITEMS_PER_PAGE);
    return paginatedUsers;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch Users: ${error.message}`);
    }
    console.error('Error:', error);
    throw new Error('Failed to fetch Users.');
  }
}

export async function fetchFilteredUsersPage(
  query: string,
  status: string = 'Habilitado',
) {
  noStore();

  try {
    const effectiveStatus = status || 'Habilitado';
    const apiUrl = `${process.env.NEXT_PUBLIC_BACK_LINK}/api/taquilla/getAllUsersTaquilla/${effectiveStatus}`;
    const response = await axios.get(apiUrl);
    if (response.data.message) {
      console.warn(response.data.message);
      return 1;
    }
    const users = response.data;
    const count = users.filter((user: UserProfile) => {
      const searchString = query.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchString) ||
        user.email?.toLowerCase().includes(searchString) ||
        user.rol?.toLowerCase().includes(searchString) ||
        user.statusprofile?.toLowerCase().includes(searchString)
      );
    }).length;
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of Users.' + error);
  }
}

export async function getTotalSales(idPark: string, filter: string) {
  noStore();
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACK_LINK}/api/data/totalsales`;
    const response = await axios.post(apiUrl, {
      idPark: idPark,
      filterType: filter,
    });
    if (response.data.totalSales && response.data.totalSales.length > 0) {
      const transformedData = response.data.totalSales.map((sale: any) => ({
        date:
          filter === 'day'
            ? formatDateToLocal(sale?.date) || sale?.date
            : sale?.date,
        total_sales: parseFloat(sale?.total_sales),
      }));
      return transformedData;
    }
    console.warn('No hay registros de ventas.');
    return [];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of Users.' + error);
  }
}

export async function getTotalSalesTipePasportCantidadNuevo(
  idPark: string,
  filter: string,
) {
  noStore();

  try {
    const apiUrl = `/api/data/getTotalSalesTipePasportNuevo`;
    const response = await axios.post(apiUrl, {
      idPark: idPark,
      filterType: filter,
    });
    const data = response.data.TotalSalesTipePasport;
    const groupedData = data.reduce((acc: any, item: any) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          total_sales: 0,
          total_value: 0,
        };
      }
      acc[date].total_sales += parseInt(item.total_sales, 10);
      acc[date].total_value += parseInt(item.total_value, 10);
      return acc;
    }, {});
    const transformedData = Object.values(groupedData).map((item: any) => ({
      date:
        filter === 'day'
          ? formatDateToLocal(item?.date) || item?.date
          : item?.date,
      total_sales: item.total_sales,
      total_value: item.total_value,
      churn: item.churn ?? 0,
    }));
    return transformedData;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of Users.' + error);
  }
}

export async function getTotalSalesTipePasportNuevo(
  idPark: string,
  filter: string,
) {
  noStore();
  try {
    const apiUrl = `/api/data/getTotalSalesTipePasportNuevo`;
    const response = await axios.post(apiUrl, { idPark, filterType: filter });
    if (
      response.data.TotalSalesTipePasport &&
      response.data.TotalSalesTipePasport.length > 0
    ) {
      const groupedData: { [key: string]: any } = {};
      response.data.TotalSalesTipePasport.forEach((sale: any) => {
        const date = sale.date;
        if (!groupedData[date]) {
          groupedData[date] = {
            date:
              filter === 'day'
                ? formatDateToLocal(sale.date) || sale.date
                : sale.date,
          };
        }
        groupedData[date][sale.name_passport] = sale.total_value;
      });
      const transformedData = Object.values(groupedData).map((group: any) => ({
        date: group.date,
        'Pasaporte Extremo': group['Pasaporte Extremo'] || '0',
        'Pasaporte Aventura': group['Pasaporte Aventura'] || '0',
        'Pasaporte Fusión': group['Pasaporte Fusión'] || '0',
        'Ingreso Sin Atracciones': group['Ingreso Sin Atracciones'] || '0',
        'Pasaporte Acuático Adultos':
          group['Pasaporte Acuático Adultos'] || '0',
        'Pasaporte Acuático Niños': group['Pasaporte Acuático Niños'] || '0',
        'Ingreso General': group['Ingreso General'] || '0',
        'N/A': group['N/A'] || '0',
      }));
      return transformedData;
    }
    console.warn('No hay registros de ventas.');
    return [];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of Users. ' + error);
  }
}

export async function getTotalSalesNumTipePasportNuevo(
  idPark: string,
  filter: string,
) {
  noStore();
  try {
    const apiUrl = `/api/data/getTotalSalesTipePasportNuevo`;
    const response = await axios.post(apiUrl, { idPark, filterType: filter });
    if (
      response.data.TotalSalesTipePasport &&
      response.data.TotalSalesTipePasport.length > 0
    ) {
      const groupedData: { [key: string]: any } = {};
      response.data.TotalSalesTipePasport.forEach((sale: any) => {
        const date = sale.date;
        if (!groupedData[date]) {
          groupedData[date] = {
            date:
              filter === 'day'
                ? formatDateToLocal(sale.date) || sale.date
                : sale.date,
          };
        }
        groupedData[date][sale.name_passport] = sale.total_sales;
      });
      const transformedData = Object.values(groupedData).map((group: any) => ({
        date: group.date,
        'Pasaporte Extremo': group['Pasaporte Extremo'] || '0',
        'Pasaporte Aventura': group['Pasaporte Aventura'] || '0',
        'Pasaporte Fusión': group['Pasaporte Fusión'] || '0',
        'Ingreso Sin Atracciones': group['Ingreso Sin Atracciones'] || '0',
        'Pasaporte Acuático Adultos':
          group['Pasaporte Acuático Adultos'] || '0',
        'Pasaporte Acuático Niños': group['Pasaporte Acuático Niños'] || '0',
        'Ingreso General': group['Ingreso General'] || '0',
        'N/A': group['N/A'] || '0',
      }));
      return transformedData;
    }
    console.warn('No hay registros de ventas.');
    return [];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of Users. ' + error);
  }
}
