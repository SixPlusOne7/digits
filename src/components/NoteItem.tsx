'use client';

/* eslint-disable react/prop-types */

import { ListGroup } from 'react-bootstrap';
import { Note } from '@/lib/validationSchemas';

interface NoteItemProps {
  note: Note;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const createdAt = new Date(note.createdAt);

  return (
    <ListGroup.Item>
      <p className="fw-lighter">{createdAt.toLocaleDateString('en-US')}</p>
      <p>{note.note}</p>
    </ListGroup.Item>
  );
};

export default NoteItem;
