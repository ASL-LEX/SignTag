import type { JsonSchema7, UISchemaElement } from '@jsonforms/core';

/** The data this component tracks for a single tag field. */
export interface FieldFormData {
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
export interface FieldTypeConfig {
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
export const FIELD_TYPES: { [fieldKind: string]: FieldTypeConfig } = {
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
