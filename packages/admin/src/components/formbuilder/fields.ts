import type { JsonSchema7, UISchemaElement } from '@jsonforms/core';

/** The data this component tracks for a single tag field. */
export interface FieldFormData {
  name?: string;
  description?: string;
  fieldType: string;
  fieldOptions: { [property: string]: unknown };
}

/**
 * JSONSchema/UISchema fragment for the type-specific (`fieldOptions`) portion of the
 * field editor form shown in `JSONFormsSingleField`.
 */
export interface FieldOptionsSchema {
  properties: { [property: string]: JsonSchema7 };
  uiElements: UISchemaElement[];
  required: string[];
}

/** JSONSchema/UISchema fragment a single field contributes to the generated study form. */
export interface FieldSchemaFragment {
  properties: { [property: string]: JsonSchema7 };
  uiElements: UISchemaElement[];
}

/**
 * Validation errors for a field type's `fieldOptions`, keyed by property name.
 * Shaped to match react-admin/react-hook-form's nested `validate` return
 * convention: `{ fieldOptions: <what this returns> }` can be assigned directly
 * onto a form-level errors object at the `fieldOptions` path.
 */
export type FieldValidationErrors = { [property: string]: string };

/**
 * Everything needed to support one tag field type (matching the providers offered by
 * the client's TagFormBuilder, packages/client/src/components/tagbuilder). ASL-LEX and
 * Video Record are omitted here since they depend on live lexicon/dataset lookups the
 * admin package does not yet have access to.
 */
export interface FormFragment {
  /** Display name for this field type; also used as the `fieldType` enum value. */
  readonly label: string;

  /** The JSONSchema/UISchema fragment for editing this type's `fieldOptions`. */
  getOptionsSchema(): FieldOptionsSchema;

  /** Sensible blank `fieldOptions` to seed when a field is switched to this type. */
  getDefaultOptions(): { [property: string]: unknown };

  /**
   * The JSONSchema/UISchema fragment this field contributes to the generated
   * study/label form, once fully configured.
   */
  buildSchemaFragment(field: FieldFormData): FieldSchemaFragment;

  /**
   * Validates a field's `fieldOptions` against this type's constraints (e.g. a
   * Slider's minimum must be less than its maximum). Returns an empty object when
   * valid.
   */
  validate(fieldOptions: { [property: string]: unknown }): FieldValidationErrors;
}

class FreeTextField implements FormFragment {
  readonly label = 'Free Text';

  getOptionsSchema(): FieldOptionsSchema {
    return { properties: {}, uiElements: [], required: [] };
  }

  getDefaultOptions() {
    return {};
  }

  buildSchemaFragment(field: FieldFormData): FieldSchemaFragment {
    return {
      properties: { [field.name ?? '']: { type: 'string', description: field.description } },
      uiElements: [{ type: 'Control', scope: `#/properties/${field.name}` }]
    };
  }

  validate(): FieldValidationErrors {
    return {};
  }
}

class NumericField implements FormFragment {
  readonly label = 'Numeric';

  getOptionsSchema(): FieldOptionsSchema {
    return { properties: {}, uiElements: [], required: [] };
  }

  getDefaultOptions() {
    return {};
  }

  buildSchemaFragment(field: FieldFormData): FieldSchemaFragment {
    return {
      properties: { [field.name ?? '']: { type: 'number', description: field.description } },
      uiElements: [{ type: 'Control', scope: `#/properties/${field.name}` }]
    };
  }

  validate(): FieldValidationErrors {
    return {};
  }
}

class BooleanField implements FormFragment {
  readonly label = 'True/False Option';

  getOptionsSchema(): FieldOptionsSchema {
    return { properties: {}, uiElements: [], required: [] };
  }

  getDefaultOptions() {
    return {};
  }

  buildSchemaFragment(field: FieldFormData): FieldSchemaFragment {
    return {
      properties: { [field.name ?? '']: { type: 'boolean', description: field.description } },
      uiElements: [{ type: 'Control', scope: `#/properties/${field.name}` }]
    };
  }

  validate(): FieldValidationErrors {
    return {};
  }
}

class SliderField implements FormFragment {
  readonly label = 'Slider';

  getOptionsSchema(): FieldOptionsSchema {
    return {
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
    };
  }

  getDefaultOptions() {
    return { minimum: 0, maximum: 10, stepSize: 1 };
  }

  buildSchemaFragment(field: FieldFormData): FieldSchemaFragment {
    const { minimum, maximum, stepSize } = field.fieldOptions;
    return {
      properties: {
        [field.name ?? '']: {
          type: 'number',
          description: field.description,
          minimum: minimum as number,
          maximum: maximum as number,
          multipleOf: stepSize as number,
          default: minimum as number
        }
      },
      uiElements: [
        {
          type: 'Control',
          scope: `#/properties/${field.name}`,
          options: { slider: true, showUnfocusedDescription: true }
        }
      ]
    };
  }

  validate(fieldOptions: { [property: string]: unknown }): FieldValidationErrors {
    const errors: FieldValidationErrors = {};
    const minimum = fieldOptions.minimum as number | undefined;
    const maximum = fieldOptions.maximum as number | undefined;
    const stepSize = fieldOptions.stepSize as number | undefined;

    // `required` on the options schema already covers missing values.
    if (minimum === undefined || maximum === undefined) {
      return errors;
    }

    if (minimum >= maximum) {
      errors.maximum = 'Maximum must be greater than minimum';
    }

    if (stepSize !== undefined) {
      if (stepSize <= 0) {
        errors.stepSize = 'Step size must be greater than 0';
      } else if (maximum > minimum && stepSize > maximum - minimum) {
        errors.stepSize = 'Step size cannot be larger than the range between minimum and maximum';
      }
    }

    return errors;
  }
}

class CategoricalField implements FormFragment {
  readonly label = 'Categorical';

  getOptionsSchema(): FieldOptionsSchema {
    return {
      properties: { userOptions: { type: 'array', items: { type: 'string' } } },
      uiElements: [
        {
          type: 'Control',
          scope: '#/properties/fieldOptions/properties/userOptions',
          options: { customType: 'file-list' }
        }
      ],
      required: ['userOptions']
    };
  }

  getDefaultOptions() {
    return { userOptions: [] };
  }

  buildSchemaFragment(field: FieldFormData): FieldSchemaFragment {
    const userOptions = (field.fieldOptions.userOptions as string[] | undefined) ?? [];
    return {
      properties: { [field.name ?? '']: { type: 'string', description: field.description, enum: userOptions } },
      uiElements: [{ type: 'Control', scope: `#/properties/${field.name}` }]
    };
  }

  validate(fieldOptions: { [property: string]: unknown }): FieldValidationErrors {
    const errors: FieldValidationErrors = {};
    const userOptions = (fieldOptions.userOptions as string[] | undefined) ?? [];

    if (userOptions.length < 2) {
      errors.userOptions = 'At least 2 options are required';
    } else if (new Set(userOptions).size !== userOptions.length) {
      errors.userOptions = 'Options must be unique';
    }

    return errors;
  }
}

interface VideoOptionParameter {
  videoURL: string;
  code: string;
  searchTerm: string;
}

class VideoOptionsField implements FormFragment {
  readonly label = 'List of Video Options';

  getOptionsSchema(): FieldOptionsSchema {
    return {
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
    };
  }

  getDefaultOptions() {
    return { allowCustomLabels: false, userVideoParameters: [] };
  }

  buildSchemaFragment(field: FieldFormData): FieldSchemaFragment {
    return {
      properties: { [field.name ?? '']: { type: 'string', description: field.description } },
      uiElements: [
        {
          type: 'Control',
          scope: `#/properties/${field.name}`,
          options: {
            customType: 'video-options',
            allowCustomLabels: field.fieldOptions.allowCustomLabels,
            userVideoParameters: field.fieldOptions.userVideoParameters,
            showUnfocusedDescription: true
          }
        }
      ]
    };
  }

  validate(fieldOptions: { [property: string]: unknown }): FieldValidationErrors {
    const errors: FieldValidationErrors = {};
    const userVideoParameters = (fieldOptions.userVideoParameters as VideoOptionParameter[] | undefined) ?? [];

    if (userVideoParameters.length === 0) {
      errors.userVideoParameters = 'At least one video option is required';
      return errors;
    }

    const codes = userVideoParameters.map((option) => option.code);
    if (new Set(codes).size !== codes.length) {
      errors.userVideoParameters = 'Option codes must be unique';
    }

    return errors;
  }
}

export const FIELD_TYPES: { [fieldKind: string]: FormFragment } = {
  'Free Text': new FreeTextField(),
  'Numeric': new NumericField(),
  'True/False Option': new BooleanField(),
  'Slider': new SliderField(),
  'Categorical': new CategoricalField(),
  'List of Video Options': new VideoOptionsField()
};
