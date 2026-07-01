import { AgeSeoPage, buildAgeSeoMetadata } from "../xem-tuoi-hop/AgeSeoPage";
import { ageSeoConfigs } from "../xem-tuoi-hop/config";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildAgeSeoMetadata(ageSeoConfigs.lamNha);
export default async function Page({ searchParams }: PageProps) { return <AgeSeoPage config={ageSeoConfigs.lamNha} params={(await searchParams) ?? {}} />; }
