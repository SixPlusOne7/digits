'use client';

/* eslint-disable react/prop-types */
import Link from 'next/link';
import { Card, Image, ListGroup } from 'react-bootstrap';
import { Contact } from '@/lib/validationSchemas';
import type { Note } from '@prisma/client';
import NoteItem from './NoteItem';
import AddNoteForm from './AddNoteForm';

interface ContactCardProps {
  contact: Contact;
  notes: Note[];
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, notes }) => (
  <Card className="h-100">
    <Card.Header className="text-center">
      <Image src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} width={75} roundedCircle />
      <Card.Title>{`${contact.firstName} ${contact.lastName}`}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{contact.address}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{contact.description}</Card.Text>
      {notes.length > 0 ? (
        <ListGroup variant="flush" className="pt-3">
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </ListGroup>
      ) : null}
      {contact.id ? <AddNoteForm contactId={contact.id} /> : null}
    </Card.Body>
    {contact.id ? (
      <Card.Footer>
        <Link href={`/edit/${contact.id}`}>Edit</Link>
      </Card.Footer>
    ) : null}
  </Card>
);

export default ContactCard;
