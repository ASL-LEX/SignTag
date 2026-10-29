import { materialRenderers } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import type { JsonFormsCore, JsonSchema, UISchemaElement } from '@jsonforms/core';
import { Card, CardActions, CardContent, CardHeader, FormHelperText, IconButton } from '@mui/material';
import { useMemo, useState } from 'react';
import { useInput } from 'react-admin';
import type { ErrorObject } from 'ajv';
import { FIELD_TYPES, type FieldFormData, type FieldValidationErrors } from './fields';
import DeleteIcon from '@mui/icons-material/Delete';

const DEFAULT_FIELD_TYPE = 'Free Text';

/**
 * Builds the schema/UI schema for a single tag field, given the currently selected
 * field type. The name, description, and field type are always present; the
 * type-specific fields are nested under the `fieldOptions` sub object.
 */
const buildSchema = (fieldType: string): { schema: JsonSchema; uischema: UISchemaElement } => {
  const optionsSchema = FIELD_TYPES[fieldType].getOptionsSchema();

  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z 0-9]*$',
        description: 'Name of the new study'
      },
      description: {
        type: 'string',
        description: 'Description of the new study'
      },
      fieldType: {
        type: 'string',
        enum: Object.keys(FIELD_TYPES),
        description: 'The kind of field this is'
      },
      fieldOptions: {
        type: 'object',
        properties: optionsSchema.properties,
        required: optionsSchema.required
      }
    },
    required: ['name', 'description', 'fieldType']
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/name' },
          { type: 'Control', scope: '#/properties/description' },
          { type: 'Control', scope: '#/properties/fieldType' }
        ]
      }
    ]
  };

  // If there are additional options for the field, add them to the UI
  if (optionsSchema.uiElements.length > 0) {
    uischema.elements.push({
      type: 'Group',
      label: fieldType,
      elements: optionsSchema.uiElements
    } as any);
  }

  return { schema, uischema: uischema as UISchemaElement };
};

/**
 * Converts the react-admin-shaped errors returned by a `FormFragment`'s `validate` into
 * the ajv `ErrorObject` shape JsonForms expects via `additionalErrors`, so type-specific
 * checks (e.g. a Slider's minimum being less than its maximum) surface on the relevant
 * control alongside JsonForms' own schema-driven errors.
 */
const buildAdditionalErrors = (errors: FieldValidationErrors): ErrorObject[] =>
  Object.entries(errors).map(([property, message]) => ({
    keyword: 'custom',
    dataPath: `.fieldOptions.${property}`,
    schemaPath: '',
    params: {},
    message
  }));

interface JSONFormsSingleFieldProps {
  /** The path this field's generated schema fragment is reported to react-admin under. */
  source: string;
  deleteField: () => void;
}

const INITIAL_DATA: FieldFormData = { fieldType: DEFAULT_FIELD_TYPE, fieldOptions: {} };

export const JSONFormsSingleField: React.FC<JSONFormsSingleFieldProps> = (props) => {
  const [data, setData] = useState<FieldFormData>(INITIAL_DATA);
  const { schema, uischema } = useMemo(() => buildSchema(data.fieldType || DEFAULT_FIELD_TYPE), [data.fieldType]);


  const validationErrors = useMemo(
    () => FIELD_TYPES[data.fieldType || DEFAULT_FIELD_TYPE].validate(data.fieldOptions),
    [data.fieldType, data.fieldOptions]
  );

  // Validation function for the input as a whole, used to propogate errors up to React Admin
  const validate = () => {
    const messages = Object.values(validationErrors);
    return messages.length > 0 ? messages.join('; ') : undefined;
  };

  // Handle the React Admin Input implementation
  const { field, fieldState } = useInput({
    source: props.source,
    defaultValue: FIELD_TYPES[DEFAULT_FIELD_TYPE].buildSchemaFragment(INITIAL_DATA),
    validate
  });

  // Errors related to the field form, like a Slider whose maximum value is less than the minimum
  const additionalErrors = useMemo(() => buildAdditionalErrors(validationErrors), [validationErrors]);

  const handleChange = ({ data: newData }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    // Check if the type has changed, if so update form fields
    const resolvedData =
      newData.fieldType !== data.fieldType
        ? { ...newData, fieldOptions: FIELD_TYPES[newData.fieldType].getDefaultOptions() }
        : (newData as FieldFormData);

    // Update the stored data itself
    setData(resolvedData);

    // Pass the data up through React Admin
    field.onChange(FIELD_TYPES[resolvedData.fieldType || DEFAULT_FIELD_TYPE].buildSchemaFragment(resolvedData));
  };

  return (
    <Card>
      <CardHeader title={data.name ? data.name : 'Incomplete'} />
      <CardContent>
        <JsonForms
          schema={schema}
          uischema={uischema}
          renderers={materialRenderers}
          data={data}
          onChange={handleChange}
          additionalErrors={additionalErrors}
        />
        {fieldState.invalid && <FormHelperText error>{fieldState.error?.message}</FormHelperText>}
      </CardContent>
      <CardActions>
        <IconButton onClick={props.deleteField}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
