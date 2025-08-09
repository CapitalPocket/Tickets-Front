'use client';
import {  UserProfile } from '@/app/lib/definitions';
import { Breadcrumb } from '@/app/ui/candidatos/breadcrumbs';
import Link from 'next/link';
import {
  ClipboardDocumentCheckIcon,
  IdentificationIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCandidato, updateCandidato } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Form({
  user,
  breadcrumbs,
}: {
  user: UserProfile;
  breadcrumbs: Breadcrumb[];
}) {
  const initialState = { message: null, errors: {} };
  const updateInvoiceWithId = updateCandidato.bind(null, user.id_user);
  const [state, dispatch] = useFormState(updateInvoiceWithId, initialState);
 
  const [selectedRole, setSelectedRole] = useState<string>('');


  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };

  return (
    <div className='md:w-[50%] mx-auto flex flex-col justify-center'>
      <ToastContainer />
      <form action={dispatch}>
      <input type="hidden" name="park" value={"3"} />
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Candidato Nombre */}
          <div className="mb-4">
            <label id="nombre" className="mb-2 block text-sm font-medium">
              Nombre completo
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  defaultValue={user.name}          
                  placeholder="Nombre apellido"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="amount-error"
                />
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="amount-error" aria-live="polite" aria-atomic="true">
                {state.errors?.nombre &&
                  state.errors.nombre.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* Candidato Cargo */}
          <div className="mb-4">
            <label
             id="nombreUser"
              className="mb-2 block text-sm font-medium "
            >
              Nombre de Usuario
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="nombreUser"
                  name="nombreUser"
                  type="text"
                  min={3}
                  defaultValue={user.email}    
                  placeholder="Usuario"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="amount-error"
                />
                <ClipboardDocumentCheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="amount-error" aria-live="polite" aria-atomic="true">
                {state.errors?.nombreUser &&
                  state.errors.nombreUser.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Candidato tipo de identificacion */}
          <div className="mb-4">
            <label id="rol" className="mb-2 block text-sm font-medium">
              Rol del Perfil
            </label>
            <div className="relative">
              <select
                id="rol"
                name="rol"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={user.rol}    
                aria-describedby="customer-error"
                onChange={handleRoleChange}
              >
                <option value="" disabled>
                  Seleccione Rol del Usuario
                </option>
                <option key={'taquillero'} value={'taquillero'}>
                  Taquillero
                </option>
                <option key={'supervisor'} value={'supervisor'}>
                  Supervisor
                </option>
                <option key={'marketing'} value={'marketing'}>
                  Marketing
                </option>
                <option key={'administrador'} value={'administrador'}>
                  Administrador
                </option>
              </select>
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.rol &&
                state.errors.rol.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
         
        </div>
        <div className="mt-6 flex justify-start gap-4">
          <Link
            href={breadcrumbs[0].href}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>

          <Button type="submit">
            Editar Usuario
          </Button>
        </div>
      </form>
    </div>
  );
}
