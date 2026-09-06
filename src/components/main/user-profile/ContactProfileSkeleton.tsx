import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ContactProfileSkeleton = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 transition-colors duration-300 dark:bg-slate-950">
      <Card className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
        <div className="h-36 animate-pulse bg-slate-200 dark:bg-slate-800" />
        <CardContent className="relative px-6 pb-7 pt-0">
          <div className="-mt-16 flex flex-col items-center">
            <div className="h-32 w-32 animate-pulse rounded-full border-[5px] border-white bg-slate-200 dark:border-slate-900 dark:bg-slate-800" />
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="h-6 w-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="mt-6 h-14 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
          <Separator className="my-6 bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3">
            <div className="h-14 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
            <div className="h-14 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <Separator className="my-6 bg-slate-200 dark:bg-slate-800" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </CardContent>
      </Card>
    </main>
  );
};

export default ContactProfileSkeleton