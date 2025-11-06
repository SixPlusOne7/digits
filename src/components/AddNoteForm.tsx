'use client';

/* eslint-disable react/prop-types */

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addNote } from '@/lib/dbActions';
import { AddNoteSchema } from '@/lib/validationSchemas';
import LoadingSpinner from '@/components/LoadingSpinner';

type AddNoteFormData = {
  note: string;
  contactId: number;
  owner: string;
};

interface AddNoteFormProps {
  contactId: number;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ contactId }) => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddNoteFormData>({
    resolver: yupResolver(AddNoteSchema),
    defaultValues: { note: '', contactId, owner: currentUser },
  });

  useEffect(() => {
    reset({ note: '', contactId, owner: currentUser });
  }, [contactId, currentUser, reset]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const onSubmit = async (data: AddNoteFormData) => {
    await addNote(data);
    swal('Success', 'Your note has been added', 'success', {
      timer: 2000,
    });
    reset({ note: '', contactId, owner: currentUser });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
      <Form.Group>
        <Form.Label>Add Note</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          {...register('note')}
          className={errors.note ? 'is-invalid' : ''}
          placeholder="Add note..."
        />
        <div className="invalid-feedback">{errors.note?.message}</div>
      </Form.Group>
      <input type="hidden" {...register('owner')} value={currentUser} />
      <input type="hidden" {...register('contactId', { valueAsNumber: true })} value={contactId} />
      <div className="pt-2 d-flex justify-content-end">
        <Button type="submit" size="sm" variant="primary" disabled={isSubmitting}>
          Add Note
        </Button>
      </div>
    </Form>
  );
};

export default AddNoteForm;
