'use client';

/* eslint-disable react/prop-types */

import type { Note } from '@prisma/client';
import { ListGroup } from 'react-bootstrap';

interface NoteItemProps {
  note: Note;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => (
  <ListGroup.Item>
    <p className="fw-lighter">{new Date(note.createdAt).toLocaleDateString('en-US')}</p>
    <p>{note.note}</p>
  </ListGroup.Item>
);

export default NoteItem;
