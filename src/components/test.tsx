import Image from "next/image";

export default function Test() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                <h1 className="text-6xl font-bold ">I.M.</h1>
            </main>
            <footer className="flex h-24 w-full items-center justify-center border-t">
                <h3 className="text-2xl">Devin Johnson</h3>
            </footer>
        </div>
    );
}
