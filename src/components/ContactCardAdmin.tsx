'use client';

/* eslint-disable react/prop-types */

import { Card, Image } from 'react-bootstrap';
import { Contact } from '@/lib/validationSchemas';

interface ContactCardAdminProps {
  contact: Contact;
}

const ContactCardAdmin: React.FC<ContactCardAdminProps> = ({ contact }) => (
  <Card className="h-100">
    <Card.Header className="text-center">
      <Image src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} width={75} roundedCircle />
      <Card.Title>{`${contact.firstName} ${contact.lastName}`}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{contact.address}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{contact.description}</Card.Text>
      <p className="blockquote-footer">{contact.owner}</p>
    </Card.Body>
  </Card>
);

export default ContactCardAdmin;
