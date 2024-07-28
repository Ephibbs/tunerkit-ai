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
import { createClient } from '@/utils/supabase/client';
import { Textarea } from "@/components/ui/textarea"


const supabase = createClient();

interface Judge {
  id?: number;
  name: string;
  prompt: string;
  user_id: string;
}

interface JudgeDialogButtonProps {
  judge?: Judge;
  onSave?: (judge: Judge) => void;
}

export function JudgeDialogButton({ judge, onSave }: JudgeDialogButtonProps) {
  const [name, setName] = useState(judge?.name || '');
  const [prompt, setPrompt] = useState(judge?.prompt || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (judge) {
      setName(judge.name);
      setPrompt(judge.prompt);
    }
  }, [judge]);

  const handleSave = async () => {
    const userId = (await supabase.auth.getSession())?.data.session?.user?.id;
    const newJudge: Judge = {
      id: judge?.id,
      name,
      prompt,
      user_id: userId,
    };

    try {
      if (judge?.id) {
        // Update existing judge
        const { data, error } = await supabase
          .from('judges')
          .update({ name, prompt })
          .eq('id', judge.id)
          .eq('user_id', userId); // Ensure the user can only update their own judges
        if (error) throw error;
      } else {
        // Insert new judge with user_id
        const { data, error } = await supabase
          .from('judges')
          .insert([{ name, prompt, user_id: userId }]);
        if (error) throw error;
      }

      if (onSave) {
        onSave(newJudge);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving judge:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{judge ? 'Edit' : 'Add Judge'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{judge ? 'Edit Judge' : 'Add Judge'}</DialogTitle>
          <DialogDescription>
            {judge ? 'Edit the judge\'s name and prompt.' : 'Give your judge a name and a detailed prompt to help the AI best evaluate the outputs.'}
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
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            {judge ? 'Save Changes' : 'Add Judge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}