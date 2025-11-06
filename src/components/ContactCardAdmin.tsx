'use client';

/* eslint-disable react/prop-types */

import { Card, Image, ListGroup } from 'react-bootstrap';
import { Contact } from '@/lib/validationSchemas';
import type { Note } from '@prisma/client';
import NoteItem from './NoteItem';

interface ContactCardAdminProps {
  contact: Contact;
  notes: Note[];
}

const ContactCardAdmin: React.FC<ContactCardAdminProps> = ({ contact, notes }) => (
  <Card className="h-100">
    <Card.Header className="text-center">
      <Image src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} width={75} roundedCircle />
      <Card.Title>{`${contact.firstName} ${contact.lastName}`}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{contact.address}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{contact.description}</Card.Text>
      {notes.length > 0 ? (
        <ListGroup variant="flush">
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </ListGroup>
      ) : null}
      <p className="blockquote-footer">{contact.owner}</p>
    </Card.Body>
  </Card>
);

export default ContactCardAdmin;
