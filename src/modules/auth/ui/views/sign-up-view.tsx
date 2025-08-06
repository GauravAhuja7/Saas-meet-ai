"use client";

import {z} from "zod";
import {OctagonAlertIcon} from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, {message: "Name is required."}),
  email: z.string().email(),
  password: z.string().min(1, {message: "Password is required."}),
  confirmPassword: z.string().min(1, {message: "Confirm password is required."}),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    },
    {
      onSuccess: () => {
        setPending(false);
        router.push("/");
      },
      onError: ({error}) => {
        setPending(false);
        setError(error.message);
      },
    }
  )}

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2" >

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    Let&apos;s get started!
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Create an account to get started.
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField 
                    control={form.control}
                    name="name"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            type="text"
                            placeholder="John Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField 
                    control={form.control}
                    name="email"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField 
                    control={form.control}
                    name="password"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField 
                    control={form.control}
                    name="confirmPassword"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="Password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle>
                      {error}
                    </AlertTitle>
                  </Alert>
                )}
                <Button disabled={pending} type="submit" className="w-full">
                  Sign up
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute
                after:inset-0 after top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button disabled={pending} variant="outline" className="w-full">
                    Google
                  </Button>
                  <Button disabled={pending} variant="outline" className="w-full">
                    Github
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "} 
                  <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-green-600 to-green-900 relative hidden md:flex felx-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="logo" className="w-[92px] h-[92px]" />
            <p className="text-2xl font-semibold text-white">
              Meet.AI 
            </p>
          </div>
        </CardContent>
      </Card> 

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs
      text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="/terms" className="underline underline-offset-4">Terms of Service</Link> 
        and <Link href="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
      </div>
    </div>
    )
}