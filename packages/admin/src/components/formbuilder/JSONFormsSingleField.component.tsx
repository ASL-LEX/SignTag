import { materialRenderers } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import type { JsonFormsCore, JsonSchema, JsonSchema7, UISchemaElement } from '@jsonforms/core';
import { Card, CardContent } from '@mui/material';
import { useMemo, useState } from 'react';

interface JSONFormsSingleFieldProps {
}

/** The data this component tracks for a single tag field. */
interface FieldFormData {
  name?: string;
  description?: string;
  fieldType: string;
  fieldOptions: { [property: string]: unknown };
}

/**
 * Definition of the additional (type-specific) properties, UI elements, and required
 * fields for a single tag field type. Mirrors the `customFields` / `customUISchema` /
 * required list produced by each provider in packages/client's TagFormBuilder.
 */
interface FieldTypeConfig {
  properties: { [property: string]: JsonSchema7 };
  uiElements: UISchemaElement[];
  required: string[];
}

/**
 * The field types available, matching the providers offered by the client's
 * TagFormBuilder (packages/client/src/components/tagbuilder). ASL-LEX and Video Record
 * are omitted here since they depend on live lexicon/dataset lookups the admin package
 * does not yet have access to.
 */
const FIELD_TYPES: { [fieldKind: string]: FieldTypeConfig } = {
  'Free Text': {
    properties: {},
    uiElements: [],
    required: []
  },
  'Numeric': {
    properties: {},
    uiElements: [],
    required: []
  },
  'True/False Option': {
    properties: {},
    uiElements: [],
    required: []
  },
  'Slider': {
    properties: {
      minimum: { type: 'number', description: 'The minimum value of the slider' },
      maximum: { type: 'number', description: 'The maximum value of the slider' },
      stepSize: { type: 'number', description: 'The step size of the slider' }
    },
    uiElements: [
      { type: 'Control', scope: '#/properties/fieldOptions/properties/minimum' },
      { type: 'Control', scope: '#/properties/fieldOptions/properties/maximum' },
      { type: 'Control', scope: '#/properties/fieldOptions/properties/stepSize' }
    ],
    required: ['minimum', 'maximum']
  },
  'Categorical': {
    properties: {
      userOptions: { type: 'array', items: { type: 'string' } }
    },
    uiElements: [
      {
        type: 'Control',
        scope: '#/properties/fieldOptions/properties/userOptions',
        options: { customType: 'file-list' }
      }
    ],
    required: ['userOptions']
  },
  'List of Video Options': {
    properties: {
      allowCustomLabels: { type: 'boolean' },
      userVideoParameters: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            videoURL: { type: 'string' },
            code: { type: 'string' },
            searchTerm: { type: 'string' }
          },
          required: ['videoURL', 'code', 'searchTerm']
        }
      }
    },
    uiElements: [
      { type: 'Control', scope: '#/properties/fieldOptions/properties/allowCustomLabels' },
      {
        type: 'Control',
        scope: '#/properties/fieldOptions/properties/userVideoParameters',
        options: { customType: 'video-option-upload' }
      }
    ],
    required: ['userVideoParameters']
  }
};

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

  const uischema: UISchemaElement = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/name' },
          { type: 'Control', scope: '#/properties/description' },
          { type: 'Control', scope: '#/properties/fieldType' }
        ]
      },
      ...(config.uiElements.length > 0
        ? [
            {
              type: 'Group',
              label: fieldType,
              elements: config.uiElements
            }
          ]
        : [])
    ]
  } as UISchemaElement;

  return { schema, uischema };
};

export const JSONFormsSingleField: React.FC<JSONFormsSingleFieldProps> = () => {
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
      <CardContent>
        <JsonForms
          schema={schema}
          uischema={uischema}
          renderers={materialRenderers}
          data={data}
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  );
};
