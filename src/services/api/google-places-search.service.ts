import { apiClient } from "../../vars";

import { School } from "../../components/SchoolSearchAutocomplete/SchoolSearchAutocomplete";

export const schoolSearch = async (schoolName: string) => {
  try {
    const response = await apiClient.get(`/google-school-search/${schoolName}`);

    return response.data as School[];
  } catch(error) {
    console.log(error);
  }
};

export const GooglePlacesSearchApi = {
  schoolSearch,
};