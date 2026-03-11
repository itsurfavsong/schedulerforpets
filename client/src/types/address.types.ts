export interface AddressResult {
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}

export interface KakaoAddressResponse {
  documents: AddressResult[];
  meta: {
    total_count: number;
  };
}