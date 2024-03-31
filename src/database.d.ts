export type Student = {
    userID: string;
    allergies: Allergy[];
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
    allergens: Allergy[];
    students: Student[];
    period: [Date, Date];
    location: string;
}

type Day = {
    daysOfWeek: DaysofWeek;
    period: [Date, Date]; // [start, end]
};

export enum Allergy {
    gluten,
    dairy,
    nuts,
    soy,
}

export type DaysofWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
