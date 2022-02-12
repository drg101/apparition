export type gender_type = 'M'|'F';

export type email_provider_type = 'outlook'|'gmail';

export interface email_provider_to_extension_interface {
    [email_provider: string]: string
}

export interface offset_interface { 
    top: number,
    left: number
}

export interface element_info_interface {
    backgroundColor: string,
    ocr_text: string,
    innerText: string,
    offset: offset_interface,
    width: number,
    height: number,
    id: string,
    title: string,
    className: string,
    placeholder: string,
    value: string,
    label: string,
    score?: number
}

export interface selectable_to_click_on_interface {
    innerText: string,
    value: string,
    score?: number
}