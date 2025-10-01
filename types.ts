// Fix: Define and export all necessary types and enums for the application.
export enum SchoolType {
    Public = '公立',
    Private = '私立',
}

export enum Gender {
    Coed = '共学',
    Boys = '男子校',
    Girls = '女子校',
}

export enum SchoolCategory {
    FullTime = '全日制',
    PartTime = '定時制',
    Correspondence = '通信制',
}

export enum SchoolSystem {
    Grade = '学年制',
    Credit = '単位制',
}

export interface School {
    id: number;
    name: string;
    address: string;
    deviation: number;
    type: SchoolType;
    gender: Gender;
    category: SchoolCategory[];
    system: SchoolSystem;
    courses: string[];
    features: string[];
    commuteInfo: string;
    commuteTime: number;
}

export enum SortType {
    DeviationDesc = 'deviation-desc',
    DeviationAsc = 'deviation-asc',
    CommuteTimeAsc = 'commute-time-asc',
}

export interface ActiveFilters {
    public: boolean;
    private: boolean;
    fullTime: boolean;
    partTime: boolean;
    correspondence: boolean;
    gradeSystem: boolean;
    creditSystem: boolean;
}
