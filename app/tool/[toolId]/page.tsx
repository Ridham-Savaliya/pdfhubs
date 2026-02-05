import type { Metadata } from 'next';
import { toolSEO } from '@/data/toolSEO';
import ToolClient from './ToolClient';

type Props = {
    params: Promise<{ toolId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { toolId } = await params;
    const seo = toolSEO[toolId];
    if (!seo) return { title: 'Tool Not Found' };

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: {
            canonical: `https://pdfhubs.site/tool/${toolId}`,
        }
    }
}

export default async function ToolPageWrapper({ params }: Props) {
    const { toolId } = await params;
    return <ToolClient toolId={toolId} />;
}
