import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onClose: () => void;
    expense?: any; // kalau ada berarti edit
}

export default function ExpenseModal({ open, onClose, expense }: Props) {
    const isEdit = !!expense;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        description: '',
        amount: '',
        date: '',
    });

    useEffect(() => {
        if (open) {
            reset();
        }
        if (open && expense) {
            setData({
                description: expense.description ?? '',
                amount: expense.amount ?? '',
                date: expense.date ?? '',
            });
        }
    }, [expense, open]);

    const submit = () => {
        if (isEdit) {
            put(`/expenses/${expense.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                    toast.success('Expense updated successfully');
                },
            });
        } else {
            post('/expenses', {
                onSuccess: () => {
                    reset();
                    onClose();
                    toast.success('Expense created successfully');
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="mb-2">
                    <DialogTitle>
                        {isEdit ? 'Edit Expense' : 'Create Expense'}
                    </DialogTitle>
                    <DialogDescription>
                        Make changes to your expense here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Description</Label>
                        <Input
                            value={data.description}
                            placeholder="Expense Description"
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Amount</Label>
                        <Input
                            value={data.amount}
                            type="number"
                            placeholder="Expense Amount"
                            onChange={(e) => setData('amount', e.target.value)}
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-500">
                                {errors.amount}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Date</Label>
                        <Input
                            value={data.date}
                            type="date"
                            placeholder="Expense Date"
                            onChange={(e) => setData('date', e.target.value)}
                        />
                        {errors.date && (
                            <p className="text-sm text-red-500">
                                {errors.date}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={submit} disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
