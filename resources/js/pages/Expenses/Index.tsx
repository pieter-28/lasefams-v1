import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { toast } from 'sonner';
import { Trash, Edit, Download, FileDown, Plus } from 'lucide-react';
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
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { SearchIcon } from 'lucide-react';

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
    totalAmount,
}: {
    expenses: {
        data: any[];
        links: any[];
        from: number;
        current_page: number;
        per_page: number;
    };
    filters: {
        search?: string;
    };
    totalAmount: number;
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
        setDeletingExpenseId(null);
        setConfirmOpen(false);
        setLoading(false);
        setSearch('');
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
                        <CardDescription>Manage user expenses.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            {/* LEFT SIDE - BUTTON GROUP */}
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={() => setOpen(true)}>
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add Expense
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        window.open(
                                            `/expenses/export/pdf?search=${search}`,
                                            '_blank',
                                        );
                                    }}
                                >
                                    <Download className="mr-1 h-4 w-4" />
                                    Export PDF
                                </Button>

                                <Button variant="secondary">
                                    <FileDown className="mr-1 h-4 w-4" />
                                    Export Excel
                                </Button>
                            </div>

                            {/* RIGHT SIDE - SEARCH */}
                            <div className="w-full lg:w-80">
                                <InputGroup>
                                    <InputGroupAddon align="inline-start">
                                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        type="search"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search expenses..."
                                    />
                                </InputGroup>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">
                                                #
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Description
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.data.length > 0 ? (
                                            expenses.data.map(
                                                (expense, index) => (
                                                    <tr
                                                        key={expense.id}
                                                        className="border-t transition hover:bg-muted/40"
                                                    >
                                                        <td className="px-4 py-3">
                                                            {(expenses.from ??
                                                                1) + index}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {
                                                                expense.description
                                                            }
                                                        </td>
                                                        <td className="px-4 py-3 text-muted-foreground">
                                                            {expense.date}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-medium">
                                                            {Number(
                                                                expense.amount,
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex justify-center gap-2">
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setSelectedExpense(
                                                                            expense,
                                                                        );
                                                                        setOpen(
                                                                            true,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>

                                                                <Button
                                                                    size="icon"
                                                                    variant="destructive"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            expense.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-10 text-center text-muted-foreground"
                                                >
                                                    No expenses found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                    {/* Footer */}
                                    <tfoot>
                                        <tr className="border-t bg-muted/30">
                                            <td
                                                colSpan={3}
                                                className="px-4 py-3 text-right font-semibold"
                                            >
                                                Total
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold">
                                                <span className="mr-2">
                                                    Rp.
                                                </span>
                                                {totalAmount.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </td>
                                            <td />
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center sm:justify-end">
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
