export type Student = {
    userID: string;
    allergies: Allergies[];
    schedule: Day[];
}

export type User = {
    uuid: string;
    username: string;
    emailAddress: string;
}

export type Cook = {
    userID: string;
    events: Meal[];
}

type Meal = {
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
};

export enum Allergies {
    gluten,
    dairy,
    nuts,
    soy,
}

type DaysofWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
