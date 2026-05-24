import { Suspense } from "react";
import Search from "@/app/facilities/Search";
import List from "@/app/facilities/List";
import Loading from  "@/app/facilities/Loading";

export default async function Facilities({ searchParams }) {
    const { search, sport } = await searchParams;
    const key = `${search}-${sport}`; // changes with every new search
    return (
        <main className="min-h-screen">
            <Search />
            <Suspense key={key} fallback={<Loading/>}>
                <List search={search} sport={sport} />
            </Suspense>
        </main>
    );

}
