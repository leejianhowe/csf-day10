export interface apiKey{
    id?: number,
    apiKey:string
}

export interface CountryInfo{
    id?: number,
    name: string,
    code: string,
    flag:string
}
export interface NewsInfo{
    source: string,
    author: string,
    title: string,
    description: string,
    url: string,
    image: string
    date: string,
    content: string,

}

export interface NewsTable{
    article: NewsInfo,
    country: string
    save?: boolean,
    id?: string

}