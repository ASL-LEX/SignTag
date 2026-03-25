import { Grid, Button, Typography, Stack, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TagFormPreviewDialog } from './TagFormPreview.component';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { TagFieldView } from './TagField.component';
import { TagSchema } from '../../graphql/graphql';
import { AslLexFieldProvider } from './AslLexTagProvider';
import { AutocompleteProvider } from './AutocompleteProvider';
import { BooleanProvider } from './BooleanProvider';
import { EmbeddedProvider } from './EmbeddedVideoProvider';
import { FreeTextProvider } from './FreeTextProvider';
import { NumericProvider } from './NumericProvider';
import { SliderProvider } from './SliderProvider';
import { VideoRecordProvider } from './VideoRecordProvider';
import { TagField, TagFieldFragmentSchema } from './TagProvider';

export interface TagsDisplayProps {
  tagSchema: TagSchema | null;
  setTagSchema: Dispatch<SetStateAction<TagSchema | null>>;
  tagFields: TagField[];
  setTagFields: Dispatch<SetStateAction<TagField[]>>;
  tagSchemaFragments: (TagFieldFragmentSchema | null)[];
  setTagSchemaFragments: Dispatch<SetStateAction<(TagFieldFragmentSchema | null)[]>>;
}

export const TagFormBuilder: React.FC<TagsDisplayProps> = (props) => {
  const [open, setOpen] = useState(false);

  const addTagField = (tagField: TagField) => {
    props.setTagFields([...props.tagFields, tagField]);

    props.tagSchemaFragments.push(null);
    props.setTagSchemaFragments([...props.tagSchemaFragments]);
  };

  const removeField = (index: number) => {
    props.tagFields.splice(index, 1);
    props.setTagFields([...props.tagFields]);

    props.tagSchemaFragments.splice(index, 1);
    props.setTagSchemaFragments([...props.tagSchemaFragments]);
  };

  // Handle update a tag schema fragment
  const updateTagSchemaFragment = (index: number, fragment: TagFieldFragmentSchema | null) => {
    props.tagSchemaFragments[index] = fragment;
    props.setTagSchemaFragments([...props.tagSchemaFragments]);
  };

  // Handling keeping track of complete tag schema
  useEffect(() => {
    // If any frame is null, the tag schema is null
    if (props.tagSchemaFragments.length == 0 || props.tagSchemaFragments.some((fragment) => fragment === null)) {
      props.setTagSchema(null);
      return;
    }

    // Combine all the fragments into a single tag schema
    let dataProperties: any = {};
    let uiElements = [];
    for (const fragment of props.tagSchemaFragments) {
      dataProperties = { ...dataProperties, ...fragment!.dataSchema };
      uiElements.push(...fragment!.uiSchema);
    }

    const tagSchema = {
      dataSchema: {
        type: 'object',
        properties: dataProperties,
        required: props.tagSchemaFragments.map((fragment) => fragment!.required).filter((required) => required !== null)
      },
      uiSchema: {
        type: 'VerticalLayout',
        elements: uiElements
      }
    };

    props.setTagSchema(tagSchema);
  }, [props.tagSchemaFragments]);

  const openTagFormPreview = () => {
    setOpen(true);
  };

  const toggleModal = () => {
    setOpen((open) => !open);
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 3 }}>
        <Stack direction="column" spacing={1} sx={{ maxWidth: 400 }}>
          <Typography variant="h5">Tag Fields</Typography>
          <AslLexFieldProvider handleClick={addTagField} />
          <AutocompleteProvider handleClick={addTagField} />
          <BooleanProvider handleClick={addTagField} />
          <EmbeddedProvider handleClick={addTagField} />
          <FreeTextProvider handleClick={addTagField} />
          <NumericProvider handleClick={addTagField} />
          <SliderProvider handleClick={addTagField} />
          <VideoRecordProvider handleClick={addTagField} />
        </Stack>

        <Box sx={{ maxWidth: 400, marginTop: 3 }}>
          <Button
            variant="outlined"
            onClick={openTagFormPreview}
            disabled={props.tagSchemaFragments.some((fragment) => fragment === null)}
            sx={{ width: '100%' }}
          >
            Preview
          </Button>
        </Box>

        {props.tagSchema && <TagFormPreviewDialog schema={props.tagSchema} clicked={open} toggleModal={toggleModal} />}
      </Grid>

      <Grid size={{ xs: 9 }} sx={{ overflow: 'auto' }}>
        <Stack direction="column" sx={{ maxHeight: 400 }} spacing={2}>
          {props.tagFields.length > 0 ? (
            props.tagFields.map((value: TagField, index: number) => (
              <Stack direction="row" key={index} spacing={1}>
                <TagFieldView
                  field={value}
                  setFieldFragment={(fragment) => updateTagSchemaFragment(index, fragment)}
                  tagFieldSchema={props.tagSchemaFragments[index]}
                />
                <Button startIcon={<DeleteIcon />} onClick={() => removeField(index)} />
              </Stack>
            ))
          ) : (
            <Typography variant="h5">No Tags Selected</Typography>
          )}
          <br />
        </Stack>
      </Grid>
    </Grid>
  );
};
