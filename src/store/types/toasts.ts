export type ToastType = {
    type: string;
    message: string;
    id: string | number;
}

export interface ToastsState {
    toasts: ToastType[]
}
