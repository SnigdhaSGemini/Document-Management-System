import { toast } from 'react-toastify';

export const toastSuccess = (message) =>{
    toast.success(message, {position: 'top-right'});
}

export const toastError = (message) =>{
    toast.error(message, {position: 'top-right'});
}