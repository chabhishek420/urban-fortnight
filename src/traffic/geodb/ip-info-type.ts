/**
 * IP Info Type Constants
 * 
 * Defines the types of geo information that can be resolved from an IP.
 * 
 * @see keitaro_source/application/Traffic/GeoDb/IpInfoType.php
 */
export const IpInfoType = {
  COUNTRY: 'country',
  REGION: 'region',
  CITY: 'city',
  ISP: 'isp',
  CONNECTION_TYPE: 'connection_type',
  OPERATOR: 'operator',
  ORGANIZATION: 'organization',
  PROXY_TYPE: 'proxy_type',
  IS_PROXY: 'is_proxy',
  IS_BOT: 'is_bot',
  ASN: 'asn',
  AS_NAME: 'as_name',
  TIMEZONE: 'timezone',
  LATITUDE: 'latitude',
  LONGITUDE: 'longitude'
} as const;

export type IpInfoTypeValue = typeof IpInfoType[keyof typeof IpInfoType];

/**
 * All available IP info types
 */
export const ALL_IP_INFO_TYPES = Object.values(IpInfoType);
