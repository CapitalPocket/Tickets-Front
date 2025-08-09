import Form from '@/app/ui/candidatos/edit-form';
import Breadcrumbs from '@/app/ui/candidatos/breadcrumbs';
import { notFound } from 'next/navigation';
import { fetchUserByIdTaquilla } from '@/app/lib/data';
import { UserProfile } from '@/app/lib/definitions';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const user = await fetchUserByIdTaquilla(id);

  if (user===null) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Usuarios del sistema', href: '/dashboard/candidatos' },
    {
      label: 'Editar Usuario',
      href: '/dashboard/candidatos/' + id + '/edit',
      active: true,
    },
  ];
  return (
    <main>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Form user={user} breadcrumbs={breadcrumbs} />
    </main>
  );
}
