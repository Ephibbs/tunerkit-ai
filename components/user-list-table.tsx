import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UserListTable = ({ object }) => {
    if (!object || !object.items || object.items.length === 0) {
        return null;
    }

    const columns = Object.keys(object.items[0]);

    return (
        <div className="w-full">
            <h2 className="text-lg font-bold mb-4">Generated User List</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column}>{column}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {object.items.map((item, index) => (
                        <TableRow key={index}>
                            {columns.map((column) => (
                                <TableCell key={`${index}-${column}`}>{item[column]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UserListTable;