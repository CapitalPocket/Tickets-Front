import Image from 'next/image';
import {
  UpdateInvoice,
  DeleteInvoice,
  UpdatePass,
} from '@/app/ui/candidatos/buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredUsers, fetchFilteredUsersPage } from '@/app/lib/data';
import UserStatus from './status';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const candidatos = await fetchFilteredUsers(query, currentPage);
  
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
          <div className="md:hidden">
            {candidatos?.map((candidatos: any) => (
              <div
                key={candidatos.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={'/customers/emil-kowalski.png'}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`profile picture`}
                      />
                      <p>{candidatos.nombre}</p>
                    </div>
                    <p className="text-sm text-gray-500"> {candidatos.cargo}</p>
                  </div>

                  {/* <InvoiceStatus status={invoice.status} /> */}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>
                      {'Ingreso: ' +
                        formatDateToLocal(candidatos.fecha_ingreso)}
                    </p>
                    <p>
                      {'Envio: ' + formatDateToLocal(candidatos.fecha_envio)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {/* <UpdateInvoice id={candidatos.id} grupo={grupo} page={currentPage} />
                    <DeleteInvoice id={candidatos.id} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nombre de usuario
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  rol
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha de edición
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estado
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {candidatos?.map((candidatos: any) => (
                <tr
                  key={candidatos.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={'/customers/usuario.png'}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`profile picture`}
                      />
                      <p>{candidatos.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {candidatos.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {candidatos.rol}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(candidatos.updated_at)}
                  </td>
                  <td className="whitespace-nowrap px-1 py-3">
                    <UserStatus status={candidatos.statusprofile} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-1 pr-3">
                    <div className="flex justify-end gap-1">
                      {/* <UpdateInvoice id={candidatos.id} page={currentPage} />
                      <UpdatePass id={candidatos.id} /> */}
                      <DeleteInvoice id={candidatos.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
