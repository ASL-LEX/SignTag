import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE, GetGridColDefs } from '../../../types/TagColumnView';
import { materialBooleanControlTester } from '@jsonforms/material-renderers';
import { Checkbox } from '@mui/material';

/** Visualize basic text data in a grid view */
const BooleanGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return <Checkbox disabled checked={data} />;
};

export const booleanTest: TagViewTest = (uischema, schema, context) => {
  if (materialBooleanControlTester(uischema, schema, context) !== NOT_APPLICABLE) {
    return 2;
  }
  return NOT_APPLICABLE;
};

export const getBoolCols: GetGridColDefs = (uischema, schema, property) => {
  return [
    {
      field: property,
      headerName: property,
      valueGetter: (_value, row) => row.data[property]?.field?.boolValue,
      renderCell: (params) =>
        params.value && <BooleanGridView data={params.row.data[property]} schema={schema} uischema={uischema} />
    }
  ];
};
