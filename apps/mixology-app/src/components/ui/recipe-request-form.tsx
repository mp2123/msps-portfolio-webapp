'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Send, GlassWater } from 'lucide-react';

type RecipeRequestValues = {
  name: string;
  email: string;
  spirit: string;
  request: string;
};

export function RecipeRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<RecipeRequestValues>({
    defaultValues: {
      name: '',
      email: '',
      spirit: '',
      request: '',
    },
  });

  function onSubmit(values: RecipeRequestValues) {
    console.log(values);
    setSubmitted(true);
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-20" id="request">
      <div className="bg-muted/30 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <GlassWater className="h-64 w-64" />
        </div>

        {!submitted ? (
          <>
            <div className="mb-10 text-center relative z-10">
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Request a Recipe</h2>
              <p className="text-muted-foreground text-sm">Looking for a specific riff or spirit pairing? Let me know.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-primary">Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-background/50 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-primary">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" className="bg-background/50 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="spirit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-primary">Base Spirit (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Bourbon, Gin, Tequila..." className="bg-background/50 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="request"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-primary">Your Vision</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell me what you're craving... (e.g., 'Something tart with a smoky finish')" 
                          className="bg-background/50 rounded-xl min-h-[120px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full rounded-xl py-6 font-bold uppercase tracking-widest shadow-xl shadow-primary/20 gap-2">
                  Send Request <Send className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tight">Request Received!</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              I&apos;ll dive into my recipe vault and get back to you soon.
            </p>
            <Button variant="ghost" className="mt-8" onClick={() => setSubmitted(false)}>Send another</Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
