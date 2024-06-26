export type Student = {
    userID: string;
    // reference to allergen
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
    // reference to meal
    events: Meal[];
}

export type Meal = {
    uuid: string;
    name: string;
    description: string;
    ingredients: string[];
    //reference to allergens
    allergens: Allergy[];
    //reference to students
    students: Student[];
    period: [Date, Date];
    location: string;
    imageURL?: string;
}

export type Day = {
    daysOfWeek: DaysofWeek;
    period: [Date, Date]; // [start, end]
};

enum Allergy {
    gluten,
    dairy,
    nuts,
    soy,
}

export type DaysofWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
