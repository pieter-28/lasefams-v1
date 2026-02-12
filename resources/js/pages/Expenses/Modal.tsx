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
import { Textarea } from '@/components/ui/textarea';
import { NumericFormat } from 'react-number-format';
interface Props {
    open: boolean;
    onClose: () => void;
    expense?: any; // kalau ada berarti edit
}

export default function ExpenseModal({ open, onClose, expense }: Props) {
    const isEdit = !!expense;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            description: '',
            amount: '',
            date: '',
        });

    useEffect(() => {
        if (!open) return;
        clearErrors();
        if (expense) {
            setData({
                description: expense.description ?? '',
                amount: expense.amount ?? '',
                date: expense.date ?? '',
            });
        } else {
            reset();
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
                    clearErrors();
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

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={data.description}
                            placeholder="Expense Description"
                            rows={3}
                            className="resize-none"
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

                    <div className="space-y-2">
                        <Label>Amount</Label>
                        <NumericFormat
                            value={data.amount}
                            thousandSeparator="."
                            decimalSeparator=","
                            onValueChange={(values) => {
                                setData('amount', values.value); // value tanpa format
                            }}
                            customInput={Input}
                            placeholder="Expense Amount"
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-500">
                                {errors.amount}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
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
                    <Button
                        variant="outline"
                        onClick={() => {
                            reset();
                            clearErrors();
                            onClose();
                        }}
                    >
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
