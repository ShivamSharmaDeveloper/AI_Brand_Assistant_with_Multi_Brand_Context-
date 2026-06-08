import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

export default function BrandSelector({ brands, selectedBrandId, onSelect, disabled }) {
  return (
    <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="brand-select-label">Select Brand</InputLabel>
      <Select
        labelId="brand-select-label"
        value={selectedBrandId || ''}
        label="Select Brand"
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled || brands.length === 0}
      >
        {brands.length === 0 ? (
          <MenuItem value="" disabled>
            No brands yet
          </MenuItem>
        ) : (
          brands.map((brand) => (
            <MenuItem key={brand.id} value={brand.id}>
              {brand.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
