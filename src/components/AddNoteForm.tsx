'use client';

/* eslint-disable react/prop-types */

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { addNote } from '@/lib/dbActions';
import { AddNoteSchema } from '@/lib/validationSchemas';

interface AddNoteFormProps {
  contactId?: number;
}

type AddNoteFormData = {
  note: string;
  contactId: number;
  owner: string;
};

const AddNoteForm: React.FC<AddNoteFormProps> = ({ contactId }) => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddNoteFormData>({
    resolver: yupResolver(AddNoteSchema),
    defaultValues: {
      note: '',
      contactId: contactId ?? 0,
      owner: currentUser,
    },
  });

  useEffect(() => {
    setValue('owner', currentUser);
  }, [currentUser, setValue]);

  useEffect(() => {
    setValue('contactId', contactId ?? 0);
  }, [contactId, setValue]);

  if (!contactId) {
    return null;
  }

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const onSubmit = async (data: AddNoteFormData) => {
    if (!data.contactId) {
      return;
    }
    await addNote({
      note: data.note,
      contactId: data.contactId,
      owner: data.owner,
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
      <Form.Group className="mb-3">
        <Form.Label>Add Note</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          {...register('note')}
          className={errors.note ? 'is-invalid' : ''}
          placeholder="Enter a note"
        />
        <div className="invalid-feedback">{errors.note?.message}</div>
      </Form.Group>
      <input type="hidden" {...register('owner')} />
      <input type="hidden" {...register('contactId')} />
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Add Note'}
      </Button>
    </Form>
  );
};

export default AddNoteForm;
