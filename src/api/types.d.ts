export interface User {
    id: number,
    uuid: string,
    username: string,
    email: string,
    picture?: string,
}

export interface SurveyField {
    name: string;
    question: string;
    touched: boolean;
    type: string;
    error: string;
    radioOptions?: RadioOption[];
    checkBoxOptions?: CheckBoxOption[];
    checkedValue?: string;
    value: string;
}

export interface TransormedFields {
    question: string;
    answer: string;
}

export type RadioOption = {
    name: string;
    value: string;
}

export type CheckBoxOption = {
    name: string;
    checked: boolean;
}