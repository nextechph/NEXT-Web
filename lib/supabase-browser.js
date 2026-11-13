'use client';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './supabase-config';
let client;
export function getBrowserClient() {
    client ||= createClient(supabaseUrl, supabaseAnonKey);
    return client;
}
