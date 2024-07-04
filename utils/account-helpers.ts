

export async function getAccountId(supabase: any, jwt?: string) {
    const { data: { user } } = await supabase.auth.getUser(jwt)
    if (!user) {
        return null
    }
    const { data: {account_id}, error } = await supabase
        .from('members')
        .select('account_id')
        .eq('user_id', user.id)
        .single();

    return account_id
}

export async function getAccessToken(supabase: any) {
    const { data: {session}, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Error fetching session:', error);
        return;
    }
    return session?.access_token;
}