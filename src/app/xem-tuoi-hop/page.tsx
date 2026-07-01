import { AgeSeoPage, buildAgeSeoMetadata } from "./AgeSeoPage";
import { ageSeoConfigs } from "./config";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
export const dynamic = "force-dynamic";
export const metadata = buildAgeSeoMetadata(ageSeoConfigs.tongQuan);

export default async function Page({ searchParams }: PageProps) {
  return <AgeSeoPage config={ageSeoConfigs.tongQuan} params={(await searchParams) ?? {}} />;
}
