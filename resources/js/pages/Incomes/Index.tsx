import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { toast } from 'sonner';
import { Trash, Edit, Plus, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaginationLaravel from '@/components/PaginationLaravel';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useState, useEffect } from 'react';
import IncomeModal from '@/pages/Incomes/Modal';
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Incomes', href: '/incomes' },
];

export default function Index({ incomes, filters }: any) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<any>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const closeModal = () => {
        setOpen(false);
        setSelectedIncome(null);
    };

    // 🔎 debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/incomes',
                { search },
                { preserveState: true, replace: true },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const handleDelete = (income: any) => {
        setSelectedIncome(income);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedIncome) return;

        router.delete(`/incomes/${selectedIncome.id}`, {
            onSuccess: () => toast.success('Income deleted successfully'),
            onError: () => toast.error('Failed to delete income'),
        });

        setConfirmOpen(false);
        setSelectedIncome(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incomes" />

            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Incomes Management</CardTitle>
                        <CardDescription>Manage user incomes.</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* TOP BAR */}
                        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                            <Button onClick={() => setOpen(true)}>
                                <Plus className="mr-1 h-4 w-4" />
                                Add Income
                            </Button>

                            <div className="w-full lg:w-80">
                                <InputGroup>
                                    <InputGroupAddon>
                                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search incomes..."
                                    />
                                </InputGroup>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-hidden rounded-xl border">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3">#</th>
                                            <th className="px-4 py-3">
                                                Description
                                            </th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3 text-right">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-center">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {incomes?.data?.length ? (
                                            incomes.data.map(
                                                (
                                                    income: any,
                                                    index: number,
                                                ) => (
                                                    <tr key={income.id}>
                                                        <td className="px-4 py-3">
                                                            {(incomes.from ??
                                                                0) + index}
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            {income.description}
                                                        </td>

                                                        <td className="px-4 py-3 text-muted-foreground">
                                                            {income.date}
                                                        </td>

                                                        <td className="px-4 py-3 text-right font-medium">
                                                            {Number(
                                                                income.amount,
                                                            ).toLocaleString()}
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            <div className="flex justify-center gap-2">
                                                                <Button
                                                                    className="cursor-pointer"
                                                                    size="icon"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setSelectedIncome(
                                                                            income,
                                                                        );
                                                                        setOpen(
                                                                            true,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>

                                                                <Button
                                                                    className="cursor-pointer"
                                                                    size="icon"
                                                                    variant="destructive"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            income.id,
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
                                                    No incomes found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* PAGINATION */}
                        <div className="flex justify-end">
                            <PaginationLaravel links={incomes.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Render modal */}
            <IncomeModal
                open={open}
                onClose={closeModal}
                income={selectedIncome}
            />

            {/* CONFIRM DELETE */}
            <ConfirmDialog
                open={confirmOpen}
                title="Delete Income"
                description="Are you sure you want to delete this income?"
                onConfirm={confirmDelete}
                onCancel={() => setConfirmOpen(false)}
                loading={loading}
            />
        </AppLayout>
    );
}
