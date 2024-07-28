import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface Tool {
  id?: number;
  name: string;
  prompt: string;
  schema: string;
  user_id: string;
}

interface ToolDialogButtonProps {
  tool?: Tool;
  onSave?: (tool: Tool) => void;
}

export function ToolDialogButton({ tool, onSave }: ToolDialogButtonProps) {
  const [name, setName] = useState(tool?.name || '');
  const [prompt, setPrompt] = useState(tool?.prompt || '');
  const [schema, setSchema] = useState(tool?.schema || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (tool) {
      setName(tool.name);
      setPrompt(tool.prompt);
      setSchema(tool.schema);
    }
  }, [tool]);

  const handleSave = async () => {
    const userId = (await supabase.auth.getSession())?.data?.session?.user.id;
    const newTool: Tool = {
      id: tool?.id,
      name,
      prompt,
      schema,
      user_id: userId,
    };

    try {
      if (tool?.id) {
        // Update existing tool
        const { data, error } = await supabase
          .from('tools')
          .update({ name, prompt, schema })
          .eq('id', tool.id)
          .eq('user_id', userId);
        if (error) throw error;
      } else {
        // Insert new tool with user_id
        const { data, error } = await supabase
          .from('tools')
          .insert([{ name, prompt, schema, user_id: userId }]);
        if (error) throw error;
      }

      if (onSave) {
        onSave(newTool);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving tool:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{tool ? 'Edit' : 'Add Tool'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tool ? 'Edit Tool' : 'Add Tool'}</DialogTitle>
          <DialogDescription>
            {tool ? 'Edit the tool\'s name, prompt, and JSON schema.' : 'Give your tool a name, a detailed prompt, and a JSON schema to help the AI imagine outputs.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prompt" className="text-right">
              Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="Type your prompt here."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schema" className="text-right">
              JSON Schema
            </Label>
            <Textarea
              id="schema"
              placeholder="Enter your JSON schema here."
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            {tool ? 'Save Changes' : 'Add Tool'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}