
export interface NewsItem {
    id: number;
    title: string;
    description: string;
    src:string;
}

export type LinkProps = { isActive: boolean}

//User Type
export interface User{
    email :string,
    password :string
}

//type for action props
export interface ActionProps {request:Request}