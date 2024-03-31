export type Student = {
    uuid: string;
    allergies: Allergies[];
    schedule: [Day, Day, Day, Day, Day, Day, Day];
}

export type User = {
    uuid: string;
    username: string;
    emailAddress: string;
}

export type Cook = {
    uuid: string;
    events: Meal[];
}

type Meal = {
    uuid: string;
    name: string;
    description: string;
    ingredients: string[];
    allergens: Allergies[];
    students: Student[];
    period: [Date, Date];
    location: string;
}

type Day = {
    daysOfWeek: DaysofWeek;
    Period: [Date, Date]; // [start, end]
}[];

export enum Allergies {
    gluten,
    dairy,
    nuts,
    soy,
}

type DaysofWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
