import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { Contact, Note } from '@/lib/validationSchemas';
import ContactCard from '@/components/ContactCard';

/** Render a list of stuff for the logged in user. */
const ListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  const owner = session?.user?.email ?? '';
  const prismaContacts = await (prisma as any).contact.findMany({
    where: { owner },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });
  const prismaNotes = await (prisma as any).note.findMany({
    where: { owner },
    orderBy: [{ createdAt: 'desc' }],
  });
  const contacts: Contact[] = prismaContacts.map((contact: any) => ({
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    address: contact.address,
    image: contact.image,
    description: contact.description,
    owner: contact.owner,
  }));
  const notes: Note[] = prismaNotes.map((note: any) => ({
    id: note.id,
    contactId: note.contactId,
    note: note.note,
    owner: note.owner,
    createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt,
  }));
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h2>List Contacts</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
              {contacts.map((contact) => {
                const contactNotes = contact.id
                  ? notes.filter((note) => note.contactId === contact.id)
                  : [];
                return (
                  <Col key={`Contact-${contact.id ?? contact.firstName}`}>
                    <ContactCard contact={contact} notes={contactNotes} />
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ListPage;
