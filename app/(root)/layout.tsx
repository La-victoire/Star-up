import Navbar from "../../components/Navbar"

export const layout = ({children}:Readonly<{children:React.ReactNode}>) => {
  return (
    <main className="font-work-sans">
      <Navbar/>
      {children}
    </main>
  )
}
