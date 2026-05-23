import "./globals.css";
import Navbar from "@/comps/Navbar";
import Footer from "@/comps/Footer";

export default function RootLayout({ children }) {
    return (
        <html>
            <body className="min-h-full flex flex-col font-serif">
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
