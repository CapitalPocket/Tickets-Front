import SideNav from '@/app/ui/dashboard/sidenav';
import { auth } from '@/auth';
import { SessionProvider } from '../context';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
 
  return (
    <SessionProvider session={session}>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav user={session?.user || ''} />
        </div>
        <div className="flex-grow p-4 md:overflow-y-auto md:p-6">{children}</div>
      </div>
    </SessionProvider>
  );
}
