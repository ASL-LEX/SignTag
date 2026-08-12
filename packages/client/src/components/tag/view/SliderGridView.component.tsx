import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE, GetGridColDefs } from '../../../types/TagColumnView';
import { materialSliderControlTester } from '@jsonforms/material-renderers';

/** Visualize basic text data in a grid view */
const SliderGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return data;
};

export const sliderTest: TagViewTest = (uischema, schema, context) => {
  if (materialSliderControlTester(uischema, schema, context) !== NOT_APPLICABLE) {
    return 2;
  }
  return NOT_APPLICABLE;
};

export const getSliderCols: GetGridColDefs = (uischema, schema, property) => {
  return [
    {
      field: property,
      headerName: property,
      valueGetter: (_value, row) => row.data && row.data[property],
      renderCell: (params) =>
        params.value && <SliderGridView data={params.row.value} schema={schema} uischema={uischema} />
    }
  ];
};
