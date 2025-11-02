import { Col, Container, Row } from 'react-bootstrap';
import { Calendar2CheckFill, FileEarmarkTextFill, PeopleFill } from 'react-bootstrap-icons';

/** The Home page. */
const featureSections = [
  {
    Icon: PeopleFill,
    title: 'Shared Contacts',
    description: [
      'This address book enables any number of users to register and save their business contacts.',
      'You can only see the contacts you have created.',
    ].join(' '),
  },
  {
    Icon: FileEarmarkTextFill,
    title: 'Rich Details',
    description: 'For each contact, you can save their name, address, and phone number.',
  },
  {
    Icon: Calendar2CheckFill,
    title: 'Track Notes',
    description: [
      'Each time you make contact with a contact, you can write a note that summarizes the conversation.',
      'This note is saved along with a timestamp with the contact.',
    ].join(' '),
  },
] as const;

const Home = () => (
  <main>
    <Container id="landing-page" fluid className="py-3">
      <Container>
        <Row style={{ textAlign: 'center' }}>
          {featureSections.map(({ Icon, title, description }) => (
            <Col key={title}>
              <Icon size={100} />
              <h1>{title}</h1>
              <h5>{description}</h5>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  </main>
);

export default Home;
