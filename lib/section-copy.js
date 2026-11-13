// Update the original starter wording even if it was already saved in Supabase.
// Other admin-authored copy and fields are preserved.
export function normalizeSectionCopy(key, content) {
    if (key !== 'second-boot') return content;
    const neutral = value => typeof value === 'string' ? value
        .replaceAll('legacy Intel 1st–6th gen systems', 'legacy PCs')
        .replaceAll('Bring Intel 1st–6th gen systems', 'Bring older computers') : value;
    return { ...content, description: neutral(content.description), items: content.items.map(item => ({ ...item, description: neutral(item.description) })) };
}
