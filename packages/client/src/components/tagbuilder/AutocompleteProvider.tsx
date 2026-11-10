import { TagFieldProviderProps, produceJSONForm, ProviderButton } from './TagProvider.tsx';
import { TextFormat } from '@mui/icons-material';

export const AutocompleteProvider: React.FC<TagFieldProviderProps> = (props) => {
  const customFields = {
    userOptions: { type: 'array', items: { type: 'string' } }
  };

  const customUISchema = [
    {
      type: 'Control',
      scope: '#/properties/userOptions',
      options: {
        customType: 'file-list'
      }
    }
  ];

  const produceDataSchema = (data: any) => {
    return {
      [data.fieldName]: {
        type: 'string',
        description: data.description,
        enum: [...data.userOptions]
      }
    };
  };

  const produceUISchema = (data: any) => {
    return [
      {
        type: 'Control',
        scope: `#/properties/${data.fieldName}`,
        options: {
          allowCustomLabels: data.allowCustomLabels,
          showUnfocusedDescription: true
        }
      }
    ];
  };

  const handleClick = () => {
    props.handleClick({
      ...produceJSONForm(customFields, customUISchema, ['userOptions']),
      fieldKind: 'Categorical',
      produceDataSchema,
      produceUISchema
    });
  };

  return <ProviderButton icon={<TextFormat />} name="Categorical" onClick={handleClick} />;
};
