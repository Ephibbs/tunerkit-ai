'use client';
import { useState } from "react"
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";


const UserAuthPicker = (props: any) => {
    const [authentication, setAuthentication] = useState("none");

    return (
        <div className="text-gray-500 text-sm">
            <div className="flex flex-col gap-4 max-w-md">
                <p>
                    Secure your project with your existing user authentication. For public, we'll track users by IP address.
                </p>
                <RadioGroup
                    defaultValue={authentication}
                    className="grid grid-cols-3 gap-4"
                    value={authentication}
                    onValueChange={(value: any) => {
                        setAuthentication(value);
                    }}
                >
                    <div>
                        <RadioGroupItem
                            value="none"
                            id="none"
                            className="peer sr-only"
                            aria-label="none"
                        />
                        <Label
                            htmlFor="none"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            Public
                        </Label>
                    </div>

                    <div>
                        <RadioGroupItem
                            value="supabase"
                            id="supabase"
                            className="peer sr-only"
                            aria-label="supabase"
                        />
                        <Label
                            htmlFor="supabase"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            Supabase
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem
                            value="firebase"
                            id="firebase"
                            className="peer sr-only"
                            aria-label="firebase"
                        />
                        <Label
                            htmlFor="firebase"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            Firebase
                        </Label>
                    </div>
                    {/* <div>
                        <RadioGroupItem
                            value="cognito"
                            id="cognito"
                            className="peer sr-only"
                            aria-label="cognito"
                        />
                        <Label
                            htmlFor="cognito"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            AWS Cognito
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem
                            value="auth0"
                            id="auth0"
                            className="peer sr-only"
                            aria-label="auth0"
                        />
                        <Label
                            htmlFor="auth0"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            Auth0
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem
                            value="clerk"
                            id="clerk"
                            className="peer sr-only"
                            aria-label="clerk"
                        />
                        <Label
                            htmlFor="clerk"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            Clerk
                        </Label>
                    </div> */}
                </RadioGroup>
            </div>
            {
                authentication === 'supabase' && (
                    <div className="mt-4 flex flex-col gap-2 max-w-sm text-center mx-auto">
                        <input
                            type="text"
                            placeholder="Supabase URL"
                            className="input mt-2 p-2 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Supabase Key"
                            className="input mt-2 p-2 rounded-md"
                        />
                    </div>
                )
            }
            {
                authentication === 'firebase' && (
                    <div className="mt-4 text-center">
                        <input
                            type="text"
                            placeholder="Firebase API Key"
                            className="input mt-2 p-2 rounded-md"
                        />
                    </div>
                )
            }
            <p className="mt-4">
                <Link href="/docs" className="text-blue-500 hover:underline">
                    Using a different authentication provider? Let us know!
                </Link>
            </p>
        </div>
    );
}

export default UserAuthPicker;