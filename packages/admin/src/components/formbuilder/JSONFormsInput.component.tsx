import { Button, type InputProps } from 'react-admin';
import { Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { JSONFormsSingleField } from './JSONFormsSingleField.component';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const JSONFormsInput: React.FC<InputProps> = (_props) => {

  const [tagFields, setTagFields] = useState<string[]>([]);

  const addTagField = (id: string) => {
    setTagFields([...tagFields, id]);
  };

  const removeTagField = (id: string) => {
    setTagFields(tagFields.filter((tagField) => tagField != id));
  };

  return (
    <>
      <Stack justifyContent='center' alignItems='center'>
        <Button variant='contained' endIcon={<AddIcon />} sx={{ maxWidth: 150 }} onClick={() => addTagField(uuidv4())}>
          Add Field
        </Button>
        <Stack spacing={2}>
          {tagFields.map(tagField => <JSONFormsSingleField key={tagField} deleteField={() => removeTagField(tagField)}/> )}
        </Stack>
      </Stack>
    </>
  );
};
