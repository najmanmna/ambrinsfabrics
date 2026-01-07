import Header from "@/components/header/Header";
import Footer from "@/components/common/Footer";
import "../globals.css";
import LinkBadge from "@/components/common/LinkBadge";
import LoomLines from "@/components/ui/LoomLines";
import TextureOverlay from "@/components/ui/TextureOverlay";
import PrintedBackground from "@/components/ui/PrintedBackground";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <LinkBadge />
      {children}
      <Footer />
 <PrintedBackground />
      {/* <LoomLines /> */}
    </>
  );
}
