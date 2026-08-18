import type { InputProps } from 'react-admin';
import { IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { JSONFormsSingleField } from './JSONFormsSingleField.component';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const JSONFormsInput: React.FC<InputProps> = (props) => {

  const [tagFields, setTagFields] = useState<string[]>([]);

  const addTagField = (id: string) => {
    setTagFields([...tagFields, id]);
  };

  return (
    <>
      <Stack>
        <IconButton onClick={() => addTagField(uuidv4())}>
            <AddIcon />
        </IconButton>
        <Stack>
          {tagFields.map(tagField => <JSONFormsSingleField key={tagField} /> )}
        </Stack>
      </Stack>
    </>
  );
};
