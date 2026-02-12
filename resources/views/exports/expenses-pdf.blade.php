<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Expenses Report</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        table,
        th,
        td {
            border: 1px solid #ddd;
        }

        th {
            background: #f4f4f4;
            padding: 8px;
            text-align: left;
        }

        td {
            padding: 8px;
        }

        .text-right {
            text-align: right;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>

<body>

    <div class="title">Expenses Report</div>
    <div>Date: {{ now()->format('d M Y') }}</div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Description</th>
                <th>Date</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($expenses as $index => $expense)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $expense->description }}</td>
                    <td>{{ $expense->date }}</td>
                    <td class="text-right">
                        Rp {{ number_format($expense->amount, 0, ',', '.') }}
                    </td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" class="text-right"><strong>Total</strong></td>
                <td class="text-right">
                    <strong>
                        Rp {{ number_format($total, 0, ',', '.') }}
                    </strong>
                </td>
            </tr>
        </tfoot>
    </table>

</body>

</html>
