import {Answer} from './answer';

export interface Quiz
{
    id:number,
    question:string,
    answers:Answer[]
}