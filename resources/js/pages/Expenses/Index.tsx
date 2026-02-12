import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { toast } from 'sonner';
import { Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import PaginationLaravel from '@/components/PaginationLaravel';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useState, useEffect } from 'react';
import Modal from '@/pages/Expenses/Modal';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Expenses',
        href: '/expenses',
    },
];

export default function ExpensesIndex({
    expenses,
    filters,
}: {
    expenses: {
        data: any[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(
        null,
    );
    // ✅ FIX: define search state
    const [search, setSearch] = useState(filters.search || '');

    const [open, setOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);

    const handleDelete = (expenseId: number) => {
        setDeletingExpenseId(expenseId);
        setConfirmOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setSelectedExpense(null);
    };
    const confirmDelete = () => {
        if (deletingExpenseId === null) return;

        setLoading(true);
        router.delete(`/expenses/${deletingExpenseId}`, {
            onSuccess: () => {
                toast.success('Expense deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete expense');
            },
            onFinish: () => {
                setLoading(false);
                setConfirmOpen(false);
                setDeletingExpenseId(null);
            },
        });
    };

    // ✅ Auto search with debounce
    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                '/expenses',
                { search },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Expenses" />
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Expenses Management</CardTitle>
                        <CardDescription>
                            Manage user expenses.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full overflow-x-auto">
                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setOpen(true)}
                                >
                                    Add Expense
                                </Button>
                                <div>
                                    <input
                                        type="search"
                                        placeholder="Search description..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="w-64 rounded border px-3 py-2"
                                    />
                                </div>
                            </div>
                            <hr className="my-3" />

                            <table className="w-full table-auto border-collapse">
                                <thead>
                                    <tr className="border bg-gray-100 text-sm leading-normal text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <th className="border-b p-2 text-left">
                                            Description
                                        </th>
                                        <th className="border-b p-2 text-left">
                                            Date
                                        </th>
                                        <th className="border-b p-2 text-left">
                                            Amount
                                        </th>
                                        <th className="border-b p-2 text-left">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Example row */}
                                    {expenses.data.length > 0 ? (
                                        expenses.data.map((expense) => (
                                            <tr key={expense.id}>
                                                <td className="border-b p-2">
                                                    {expense.description}
                                                </td>
                                                <td className="border-b p-2">
                                                    {expense.date}
                                                </td>
                                                <td className="border-b p-2">
                                                    $
                                                    {Number(
                                                        expense.amount,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="border-b p-2">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="default"
                                                            onClick={() => {
                                                                setSelectedExpense(
                                                                    expense,
                                                                );
                                                                setOpen(true);
                                                            }}
                                                        >
                                                            <Edit />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    expense.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="mb-0 border-b p-2 text-center"
                                            >
                                                No expenses found.
                                            </td>
                                        </tr>
                                    )}
                                    {/* More rows can be added here */}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <PaginationLaravel links={expenses.links} />
                        </div>
                    </CardContent>
                </Card>

                {/* Render modal */}
                <Modal
                    open={open}
                    onClose={closeModal}
                    expense={selectedExpense}
                />

                <ConfirmDialog
                    open={confirmOpen}
                    title="Delete Expense"
                    description="Are you sure you want to delete this expense?"
                    onConfirm={confirmDelete}
                    onCancel={() => setConfirmOpen(false)}
                    loading={loading}
                />
            </div>
        </AppLayout>
    );
}
