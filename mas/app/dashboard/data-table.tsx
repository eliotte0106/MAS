'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    ColumnDef,
    ColumnFiltersState,
    RowData,
    RowSelectionState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BsChevronDown } from 'react-icons/bs'
import { Requests, RequestStatus } from "@/types"
import { buildUrl } from "@/lib/utils"
import { toast } from 'react-toastify'
import PhotoModal from "@/components/modal/photo-modal"
import LoadingModal from "@/components/modal/loading-modal"

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        photoThumbClicked: (rowIndex: string) => void
    }
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [photoModal, setPhotoModal] = useState({
        open: false,
        url: ''
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection
        },
        meta: {
            photoThumbClicked(rowIndex) {
                const photo: string =
                    table.getRowModel().rows.at(Number.parseInt(rowIndex))?.getValue('photo') as string
                setPhotoModal({
                    open: true,
                    url: photo
                })
            }
        }
    })

    const handleMarkComplete = async () => {
        const rowIndex = Object.keys(rowSelection)
        const requestsToMark: Requests[] = []

        try {

            setLoading(true)
            rowIndex.forEach(index => {
                const row = table.getRowModel().rows.at(Number.parseInt(index))
                requestsToMark.push(row?.original as Requests)
            })

            // fire a http call
            await fetch(buildUrl('request/bulk'), {
                method: 'PATCH',
                body: JSON.stringify({
                    requests: requestsToMark,
                    status: RequestStatus.COMPLETED
                })
            })

            setLoading(false)
            toast.success("requests updated")
            setRowSelection({})
            router.refresh()
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const handleDelete = async () => {
        const rowIndex = Object.keys(rowSelection);
        const requestsToDelete: Requests[] = [];

        try {

            setLoading(true)
            rowIndex.forEach(index => {
                const row = table.getRowModel().rows.at(Number.parseInt(index))
                requestsToDelete.push(row?.original as Requests)
            })

            await fetch('request/bulk', {
                method: 'DELETE',
                body: JSON.stringify({
                    requests: requestsToDelete
                })
            })

            setLoading(false)
            toast.success("requests deleted")
            setRowSelection({})

            router.refresh()
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    return (
        <div>

            {/* toolbar */}
            <div className="flex items-center py-4">
                {
                    Object.keys(rowSelection).length > 0 ?
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>Bulk Action <BsChevronDown className="ml-2" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className="text-green-600"
                                    onClick={handleMarkComplete}>
                                    Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        :
                        <Input
                            placeholder="Filter by name..."
                            value={(table.getColumn('submitterName')?.getFilterValue() as string ?? "")}
                            onChange={(event) =>
                                table.getColumn('submitterName')?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                }
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {
                            table.getHeaderGroups().map(hg => (
                                <TableRow key={hg.id}>
                                    {
                                        hg.headers.map(h => {
                                            return (
                                                <TableHead key={h.id}>
                                                    {
                                                        h.isPlaceholder ? null :
                                                            flexRender(
                                                                h.column.columnDef.header,
                                                                h.getContext()
                                                            )
                                                    }
                                                </TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            ))
                        }
                    </TableHeader>
                    <TableBody>
                        {
                            table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))

                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            
            <LoadingModal open={loading} />
            <PhotoModal open={photoModal.open}
                onClose={() => setPhotoModal({ open: false, url: '' })}
                url={photoModal.url} />
        </div>
    )
}