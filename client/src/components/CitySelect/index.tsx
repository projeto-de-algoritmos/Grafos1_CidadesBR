import { Autocomplete, TextField } from "@mui/material";
import { City } from "../../api/city";

interface CitySelectProps {
  cities: City[];
  value: City | null;
  onChange: (value: City | null) => void;
}

export default function CitySelect({
  cities,
  value,
  onChange,
}: CitySelectProps) {
  return (
    <Autocomplete
      options={cities}
      value={value}
      onChange={(_, value) => onChange(value)}
      renderInput={(params) => (
        <TextField {...params} label="Cidade de origem" />
      )}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.name}
        </li>
      )}
      style={{ width: "100%" }}
    />
  );
}
