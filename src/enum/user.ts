export enum ENUM_USER_ROLE {
    ADMIN = 'admin',
    USER="user"
  }
  
  export const RoleWiseUserValue = {
    
    [ENUM_USER_ROLE.ADMIN]: 95,
    [ENUM_USER_ROLE.USER]: 90,
    
  };
  
  export enum ENUM_COOKIE_NAME {
    REFRESH_TOKEN = 'AvatarJwt',
  }
  
  export type DiskTypeEnum = 'LOCAL' | 'AWS' | 'SHARED';
  export type FileTypeEnum = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'OTHER';
  
  export type GeoLocationTypeEnum = 'Point' | 'Polygon';
  
  export const allGeoLocationTypeEnum: GeoLocationTypeEnum[] = [
    'Point',
    'Polygon',
  ];
  