'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const supabase = createClient();

enum UserAuthType {
    PUBLIC = 'public',
    SUPABASE = 'supabase',
    FIREBASE = 'firebase',
    COGNITO = 'cognito',
}

interface UserAuthGroup {
    type: UserAuthType;
    metadata?: {
        url?: string;
        key?: string;
    }
}

const UserAuthPicker = ({ project }: any) => {
    const [userAuth, setUserAuth] = useState<UserAuthGroup>({ type: UserAuthType.PUBLIC });
    const {toast} = useToast();

    useEffect(() => {
        setUserAuth(project.user_auth || { type: UserAuthType.PUBLIC });
    }, [project]);

    const handleSave = async () => {
        let result;
        if (userAuth.type === UserAuthType.PUBLIC) {
            result = await supabase.from('projects').update({ user_auth: { type: UserAuthType.PUBLIC } }).eq('id', project.id);
        } else {
            result = await supabase.from('projects').update({ user_auth: userAuth }).eq('id', project.id);
        }
        console.log(result);
        if (result.error) {
            toast({
                title: 'Error',
                description: result.error.message,
                // type: 'error',
                });
        } else {
            toast({
                title: 'Success',
                description: 'User authentication settings saved successfully',
                // type: 'success',
            });
        }

    }

    const handleTypeChange = (value: UserAuthType) => {
        console.log(value);
        setUserAuth({ type: value });
    }

    const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserAuth(prevState => ({
            ...prevState,
            metadata: {
                ...prevState.metadata,
                [name]: value,
            },
        }));
    }

    return (
        <div className="text-gray-500 text-sm flex flex-col">
            <div className="flex flex-col gap-4">
                <p>
                    Secure your project with your existing user authentication. For public, we'll track users by IP address.
                </p>
                <p className="font-bold">
                    Authentication Method:
                </p>
                <RadioGroup
                    value={userAuth.type || UserAuthType.PUBLIC}
                    onValueChange={handleTypeChange}
                    className="grid grid-cols-3 gap-4"
                >
                    <div>
                        <RadioGroupItem
                            value={UserAuthType.PUBLIC}
                            id="public"
                            className="peer sr-only"
                            aria-label="public"
                        />
                        <Label
                            htmlFor="public"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            Public
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem
                            value={UserAuthType.SUPABASE}
                            id="supabase"
                            className="peer sr-only"
                            aria-label="supabase"
                        />
                        <Label
                            htmlFor="supabase"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            Supabase (Beta)
                        </Label>
                    </div>
                    {/* <div>
                        <RadioGroupItem
                            value={UserAuthType.FIREBASE}
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
                    </div> */}
                </RadioGroup>
            </div>
            {
                userAuth.type === UserAuthType.SUPABASE && (
                    <div className="mt-4 flex justify-center gap-2 max-w-sm text-center mx-auto">
                        <input
                            type="text"
                            name="url"
                            placeholder="Supabase URL"
                            value={userAuth.metadata?.url || ''}
                            className="input mt-2 p-2 rounded-md border"
                            onChange={handleMetadataChange}
                        />
                        <input
                            type="text"
                            name="key"
                            placeholder="Supabase Public Key"
                            value={userAuth.metadata?.key || ''}
                            className="input mt-2 p-2 rounded-md border"
                            onChange={handleMetadataChange}
                        />
                    </div>
                )
            }
            {
                userAuth.type === UserAuthType.FIREBASE && (
                    <div className="mt-4 text-center">
                        <input
                            type="text"
                            name="key"
                            placeholder="Firebase API Key"
                            value={userAuth.metadata?.key || ''}
                            className="input mt-2 p-2 rounded-md border"
                            onChange={handleMetadataChange}
                        />
                    </div>
                )
            }
            <p className="mt-4">
                <Link href="/docs" className="text-blue-500 hover:underline">
                    Using a different authentication provider? Let us know!
                </Link>
            </p>
            <button onClick={handleSave} className="btn mt-4 bg-green-500 text-white p-2 rounded-md w-20 m-auto">Save</button>
        </div>
    );
}

export default UserAuthPicker;
