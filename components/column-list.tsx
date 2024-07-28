import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Column {
    id: string;
    name: string;
    type: string;
    description: string;
}

interface ExpandableColumnListProps {
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
}

export default function ExpandableColumnList({ columns, setColumns }: ExpandableColumnListProps) {
    const addColumn = () => {
        const newColumn: Column = {
            id: Date.now().toString(),
            name: '',
            type: '',
            description: ''
        };
        setColumns([...columns, newColumn]);
    };

    const deleteColumn = (id: string) => {
        setColumns(columns.filter(column => column.id !== id));
    };

    const updateColumn = (id: string, field: keyof Column, value: string) => {
        setColumns(columns.map(column =>
            column.id === id ? { ...column, [field]: value } : column
        ));
    };

    return (
        <div className="space-y-4">
            {columns.map(column => (
                <div key={column.id} className="flex items-center space-x-2">
                    <Input
                        placeholder="Column Name"
                        value={column.name}
                        onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
                        className="flex-grow"
                    />
                    <Select
                        value={column.type}
                        onValueChange={(value) => updateColumn(column.id, 'type', value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Description"
                        value={column.description}
                        onChange={(e) => updateColumn(column.id, 'description', e.target.value)}
                        className="flex-grow"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteColumn(column.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button onClick={addColumn} className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Column
            </Button>
        </div>
    );
}