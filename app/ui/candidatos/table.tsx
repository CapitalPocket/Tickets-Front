import Image from 'next/image';
import {
  UpdateInvoice,
  DeleteInvoice,
  UpdatePass,
  Desabled,
  Enable,
  UpdateUser,
} from '@/app/ui/candidatos/buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredUsers, fetchFilteredUsersPage } from '@/app/lib/data';
import UserStatus from './status';

export default async function InvoicesTable({
  query,
  currentPage,
  status,
}: {
  query: string;
  currentPage: number;
  status: string;
}) {
  const candidatos = await fetchFilteredUsers(query, currentPage, status);
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
          {candidatos?.length === 0 ? (
            <p className="py-4 text-center text-gray-500">
              No hay usuarios disponibles.
            </p>
          ) : (
            <>
              <div className="md:hidden">
                {candidatos?.map((candidato: any) => (
                  <div
                    key={candidato.id_user}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="mx-auto w-[100%] rounded-md p-2">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-semibold">
                            {`${candidato.rol}`} &nbsp; &nbsp;
                          </p>
                          <UserStatus status={candidato.statusprofile} />
                        </div>
                        <p className="text-sm text-gray-500">
                          {candidato.name} &nbsp; &nbsp;
                        </p>
                        <p className="text-sm text-gray-500">
                          {candidato.email}
                        </p>
                        <div className="flex justify-between gap-1">
                          {candidato.statusprofile === 'Habilitado' && (
                            <>
                            <UpdateUser id={candidato.id_user} page={1} />
                              <Desabled id={candidato.id_user} />
                              <DeleteInvoice id={candidato.id_user} />
                            </>
                          )}
                          {candidato.statusprofile === 'Deshabilitado' && (
                            <>
                              <Enable id={candidato.id_user} />
                              <DeleteInvoice id={candidato.id_user} />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Nombre
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Nombre de usuario
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Rol
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
                  {candidatos?.map((candidato: any) => (
                    <tr
                      key={candidato.id_user}
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
                          <p>{candidato.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {candidato.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {candidato.rol}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatDateToLocal(candidato.updated_at)}
                      </td>
                      <td className="whitespace-nowrap px-1 py-3">
                        <UserStatus status={candidato.statusprofile} />
                      </td>
                      <td className="whitespace-nowrap py-3 pl-1 pr-3">
                        <div className="flex justify-end gap-1">
                          {candidato.statusprofile === 'Habilitado' && (
                            <>
                              <UpdatePass id={candidato.id_user} />
                              <UpdateUser id={candidato.id_user} page={1} />
                              <Desabled id={candidato.id_user} />
                              <DeleteInvoice id={candidato.id_user} />
                            </>
                          )}
                          {candidato.statusprofile === 'Deshabilitado' && (
                            <>
                              <Enable id={candidato.id_user} />
                              <DeleteInvoice id={candidato.id_user} />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
