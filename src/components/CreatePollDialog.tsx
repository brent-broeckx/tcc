import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useConvexMutation } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { toast } from 'sonner'

interface CreatePollDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export function CreatePollDialog({ open, onOpenChange }: CreatePollDialogProps) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])

  const createPollMutation = useMutation({
    mutationFn: useConvexMutation(api.poll.createPoll)
  })

  const handleClose = () => {
    setQuestion('')
    setOptions(['', ''])
    onOpenChange(false)
  }

  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim()) {
      toast.error('Please enter a question')
      return
    }

    const validOptions = options.filter(option => option.trim())
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options')
      return
    }

    const trimmedOptions = validOptions.map(option => option.trim());
    createPollMutation.mutate(
      { question: question.trim(), options: trimmedOptions })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Poll</DialogTitle>
          <DialogDescription>
            Create a new poll for people to vote on. You can add multiple options.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder="What would you like to ask?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-4">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {options.length < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createPollMutation.isPending}
            >
              {createPollMutation.isPending ? 'Creating...' : 'Create Poll'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
