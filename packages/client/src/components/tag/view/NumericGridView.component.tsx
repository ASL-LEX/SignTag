import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE, GetGridColDefs } from '../../../types/TagColumnView';
import { materialNumberControlTester } from '@jsonforms/material-renderers';

/** Visualize basic text data in a grid view */
const NumericGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return data;
};

export const numericTest: TagViewTest = (uischema, schema, context) => {
  if (materialNumberControlTester(uischema, schema, context) !== NOT_APPLICABLE) {
    return 2;
  }
  return NOT_APPLICABLE;
};

export const getNumericCols: GetGridColDefs = (uischema, schema, property) => {
  return [
    {
      field: property,
      headerName: property,
      valueGetter: (_value, row) => row.data[property]?.field?.numericValue,
      renderCell: (params) =>
        params.value && <NumericGridView data={params.value} schema={schema} uischema={uischema} />
    }
  ];
};
