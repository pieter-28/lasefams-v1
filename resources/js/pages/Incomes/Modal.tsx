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
    income?: any; // kalau ada berarti edit
}

export default function IncomeModal({ open, onClose, income }: Props) {
    const isEdit = !!income;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            description: '',
            amount: '',
            date: '',
        });

    useEffect(() => {
        if (!open) return;
        clearErrors();
        if (income) {
            setData({
                description: income.description ?? '',
                amount: income.amount ?? '',
                date: income.date ?? '',
            });
        } else {
            reset();
        }
    }, [income, open]);

    const submit = () => {
        if (isEdit) {
            put(`/incomes/${income.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                    toast.success('Income updated successfully');
                },
            });
        } else {
            post('/incomes', {
                onSuccess: () => {
                    reset();
                    clearErrors();
                    onClose();
                    toast.success('Income created successfully');
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="mb-2">
                    <DialogTitle>
                        {isEdit ? 'Edit Income' : 'Create Income'}
                    </DialogTitle>
                    <DialogDescription>
                        Make changes to your income here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={data.description}
                            placeholder="Income Description"
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
                            placeholder="Income Amount"
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
                            placeholder="Income Date"
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
