import { ENV_CONFIGS } from '@helpers/constants/configs/env-vars';

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export const isValidPostalCode = async (postalCode: string, city: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${ENV_CONFIGS.GOOGLE_API_KEY}`,
  );
  const data = await response.json();

  if (data.status === 'OK') {
    const localities = data.results[0].postcode_localities;
    const address_components = data.results[0].address_components
      .flatMap((address: AddressComponent) =>
        address.types.includes('locality') ? [address.long_name, address.short_name] : null,
      )
      .filter(Boolean);

    localities.push(...address_components);

    if (localities.includes(city)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
