<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $expenses = Expense::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where('description', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();
        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'filters' => request()->only(['search']),
            'totalAmount' => number_format(Expense::sum('amount'), 0, ',', '.'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExpenseRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = Auth::id();
        Expense::create($validated);
        return redirect()->route('expenses.index')->with('success', 'Expense created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $expense->update($request->validated());
        return redirect()->route('expenses.index')->with('success', 'Expense updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $expense->delete();
        return redirect()->route('expenses.index')->with('success', 'Expense deleted successfully.');
    }

    /**
     * Export expenses to PDF.
     */
    public function exportPdf(Request $request)
    {
        $expenses = Expense::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where('description', 'like', "%{$search}%");
            })
            ->get();

        $total = $expenses->sum('amount');

        $pdf = Pdf::loadView('exports.expenses-pdf', [
            'expenses' => $expenses,
            'total' => $total,
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('expenses-report.pdf');
    }
}
