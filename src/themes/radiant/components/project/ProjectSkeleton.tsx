import Navbar from "@/themes/radiant/components/Navbar.tsx";

export const ProjectSkeleton = () => {
  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen">
        {/* Header Skeleton */}
        <section className="pt-40 pb-20">
          <div className="container mx-auto px-6 max-w-5xl space-y-12">
            <div className="h-4 bg-heading/5 rounded-full w-32 animate-pulse" />
            <div className="space-y-6">
              <div className="h-20 bg-heading/5 rounded-3xl w-3/4 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-12 border-y border-heading/5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-2 bg-heading/5 rounded-full w-16 animate-pulse" />
                  <div className="h-6 bg-heading/5 rounded-xl w-32 animate-pulse" />
                </div>
              ))}
            </div>
            <div className="h-[480px] bg-heading/5 rounded-[4rem] animate-pulse" />
          </div>
        </section>

        {/* Narrative Skeleton */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-20">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-8">
                  <div className="h-4 bg-heading/5 rounded-full w-24 animate-pulse" />
                  <div className="h-10 bg-heading/5 rounded-2xl w-48 animate-pulse" />
                  <div className="space-y-4">
                    <div className="h-4 bg-heading/5 rounded-full w-full animate-pulse" />
                    <div className="h-4 bg-heading/5 rounded-full w-full animate-pulse" />
                    <div className="h-4 bg-heading/5 rounded-full w-4/5 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
