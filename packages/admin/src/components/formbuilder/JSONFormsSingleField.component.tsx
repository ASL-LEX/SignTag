import { materialRenderers } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import type { JsonFormsCore, JsonSchema, UISchemaElement } from '@jsonforms/core';
import { Card, CardActions, CardContent, CardHeader, IconButton } from '@mui/material';
import { useMemo, useState } from 'react';
import { FIELD_TYPES, type FieldFormData } from './fields';
import DeleteIcon from '@mui/icons-material/Delete';

const DEFAULT_FIELD_TYPE = 'Free Text';

/**
 * Builds the schema/UI schema for a single tag field, given the currently selected
 * field type. The name, description, and field type are always present; the
 * type-specific fields are nested under the `fieldOptions` sub object.
 */
const buildSchema = (fieldType: string): { schema: JsonSchema; uischema: UISchemaElement } => {
  const config = FIELD_TYPES[fieldType];

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
        properties: config.properties,
        required: config.required
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
  if (config.uiElements.length > 0) {
    uischema.elements.push({
      type: 'Group',
      label: fieldType,
      elements: config.uiElements
    } as any);
  }

  return { schema, uischema: uischema as UISchemaElement };
};

interface JSONFormsSingleFieldProps {
  deleteField: () => void;
}

export const JSONFormsSingleField: React.FC<JSONFormsSingleFieldProps> = (props) => {
  const [data, setData] = useState<FieldFormData>({ fieldType: DEFAULT_FIELD_TYPE, fieldOptions: {} });

  const { schema, uischema } = useMemo(() => buildSchema(data.fieldType || DEFAULT_FIELD_TYPE), [data.fieldType]);

  const handleChange = ({ data: newData }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    // Reset the type-specific fields whenever the field type changes, since they no
    // longer correspond to the newly selected type's schema.
    if (newData.fieldType !== data.fieldType) {
      setData({ ...newData, fieldOptions: {} });
      return;
    }

    setData(newData);
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
        />
      </CardContent>
      <CardActions>
        <IconButton onClick={props.deleteField}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
