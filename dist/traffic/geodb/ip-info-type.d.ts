/**
 * IP Info Type Constants
 *
 * Defines the types of geo information that can be resolved from an IP.
 *
 * @see keitaro_source/application/Traffic/GeoDb/IpInfoType.php
 */
export declare const IpInfoType: {
    readonly COUNTRY: "country";
    readonly REGION: "region";
    readonly CITY: "city";
    readonly ISP: "isp";
    readonly CONNECTION_TYPE: "connection_type";
    readonly OPERATOR: "operator";
    readonly ORGANIZATION: "organization";
    readonly PROXY_TYPE: "proxy_type";
    readonly IS_PROXY: "is_proxy";
    readonly IS_BOT: "is_bot";
    readonly ASN: "asn";
    readonly AS_NAME: "as_name";
    readonly TIMEZONE: "timezone";
    readonly LATITUDE: "latitude";
    readonly LONGITUDE: "longitude";
};
export type IpInfoTypeValue = typeof IpInfoType[keyof typeof IpInfoType];
/**
 * All available IP info types
 */
export declare const ALL_IP_INFO_TYPES: ("is_bot" | "operator" | "connection_type" | "isp" | "country" | "region" | "city" | "organization" | "proxy_type" | "is_proxy" | "asn" | "as_name" | "timezone" | "latitude" | "longitude")[];
//# sourceMappingURL=ip-info-type.d.ts.map