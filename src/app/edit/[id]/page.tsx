import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import EditContactForm from '@/components/EditContactForm';
import { Contact } from '@/lib/validationSchemas';

export default async function EditContactPage({ params }: { params: { id: string | string[] } }) {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  const id = Number(Array.isArray(params?.id) ? params?.id[0] : params?.id);
  // console.log(id);
  const prismaContact = await prisma.contact.findUnique({
    where: { id },
  });
  // console.log(prismaContact);
  if (!prismaContact) {
    return notFound();
  }
  const contact: Contact & { id: number } = {
    id: prismaContact.id,
    firstName: prismaContact.firstName,
    lastName: prismaContact.lastName,
    address: prismaContact.address,
    image: prismaContact.image,
    description: prismaContact.description,
    owner: prismaContact.owner,
  };

  return (
    <main>
      <EditContactForm contact={contact} />
    </main>
  );
}
