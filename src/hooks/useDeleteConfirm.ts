import { useState } from "react";

interface DeleteConfirmState {
    isOpen: boolean;
    itemId: string | null;
    itemName?: string;
}

export const useDeleteConfirm = () => {
    const [state, setState] = useState<DeleteConfirmState>({
        isOpen: false,
        itemId: null,
        itemName: undefined,
    });

    const openConfirm = (itemId: string, itemName?: string) => {
        setState({
            isOpen: true,
            itemId,
            itemName,
        });
    };

    const closeConfirm = () => {
        setState({
            isOpen: false,
            itemId: null,
            itemName: undefined,
        });
    };

    return {
        isOpen: state.isOpen,
        itemId: state.itemId,
        itemName: state.itemName,
        openConfirm,
        closeConfirm,
    };
};
