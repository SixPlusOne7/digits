import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { Contact } from '@/lib/validationSchemas';
import ContactCard from '@/components/ContactCard';

/** Render a list of contacts for the logged in user. */
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
  const contactsFromDb = await prisma.contact.findMany({
    where: {
      owner,
    },
    orderBy: [
      { lastName: 'asc' },
      { firstName: 'asc' },
    ],
  });
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h2>List Contacts</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
              {contactsFromDb.map((contact) => {
                const contactCardData: Contact = {
                  firstName: contact.firstName,
                  lastName: contact.lastName,
                  address: contact.address,
                  image: contact.image,
                  description: contact.description,
                };
                return (
                  <Col key={`Contact-${contact.id}`}>
                    <ContactCard contact={contactCardData} />
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
