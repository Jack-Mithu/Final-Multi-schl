import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    const { props } = usePage();
    const toastData = props.toast as { type: string; message: string } | null;

    useEffect(() => {
        if (toastData) {
            if (toastData.type === 'success') {
                toast.success(toastData.message);
            } else if (toastData.type === 'error') {
                toast.error(toastData.message);
            } else {
                toast(toastData.message);
            }
        }
    }, [toastData]);

    return <Toaster position="top-right" />;
}
